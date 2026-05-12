const { Op, literal } = require('sequelize');
const sequelize = require('../db/connection');
const Book = require('../models/Book');
const Reservation = require('../models/Reservation');
const Loan = require('../models/Loan');
const History = require('../models/History');
const Notification = require('../models/Notification');
const Audit = require('../models/Audit');

const RESERVATION_STATUS = require('../constants/reservationStatus');

/**
 * GET /api/users/:userId/reservations/active
 * 指定利用者のキャンセル以外の有効な予約一覧を返却します。
 * 書籍情報（title, author）を結合し、受取期限（pickupDeadline）の
 * 昇順でソートします。NULL・空文字は末尾に配置します。
 */
exports.getActiveReservations = async (req, res) => {
    const { userId } = req.params;

    // -------------------------------------------------
    // 1. userId バリデーション
    // -------------------------------------------------
    if (!userId || String(userId).trim() === '') {
        return res.status(400).json({ error: 'userId は必須です。' });
    }

    try {
        // -------------------------------------------------
        // 2. クエリ: reservations と books を結合し、status != CANCELLED で絞り込み
        // -------------------------------------------------
        const reservations = await Reservation.findAll({
            where: {
                userId,
                status: { [Op.ne]: RESERVATION_STATUS.CANCELLED },
            },
            include: [
                {
                    model: Book,
                    required: false,   // LEFT JOIN — 書籍が削除済みでも予約レコードを返す
                    attributes: ['title', 'author'],
                },
            ],
            // pickupDeadline 昇順。NULL・空文字は末尾に配置する
            order: [
                [
                    literal(`CASE WHEN "Reservation"."pickupDeadline" IS NULL
                                   OR "Reservation"."pickupDeadline" = ''
                              THEN 1 ELSE 0 END`),
                    'ASC',
                ],
                ['pickupDeadline', 'ASC'],
            ],
        });

        // -------------------------------------------------
        // 3. レスポンス整形
        // -------------------------------------------------
        const data = reservations.map(r => ({
            reservationId: r.reservationId,
            userId: r.userId,
            bookId: r.bookId,
            title: r.Book?.title ?? null,
            author: r.Book?.author ?? null,
            status: r.status,
            reservedAt: r.reservedAt,
            pickupDeadline: r.pickupDeadline,
            queueNo: r.queueNo,
            cancelledAt: r.cancelledAt,
        }));

        return res.json({
            count: data.length,
            reservations: data,
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// =============================================================
// 補助関数: pickupDeadline 計算（本日 + 7日、YYYY-MM-DD）
// =============================================================
function _calcPickupDeadline() {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
}

// =============================================================
// 補助関数: audit ログ書き込み（仕様書 8.3）
// トランザクション外で呼ぶため transaction は渡さない。
// =============================================================
async function _writeAuditLog({ level, eventType, userId, message }) {
    try {
        await Audit.create({
            level,
            eventType,
            userId: userId ?? null,
            message,
        });
    } catch (_) {
        // audit 書き込み失敗はサイレントに無視（本処理を止めない）
    }
}

// =============================================================
// reserveBook
// POST /api/v1/reservations
// body: { bookId }  ／  userId はセッションから取得（§8.4.4）
//
// 予約上限・重複・書籍状態チェックを行い、予約レコードを
// トランザクション内で登録します（仕様書 6-5）。
// History / Notification / Audit は仕様書 6-5-5 に従い実装。
// =============================================================
exports.reserveBook = async (req, res) => {
    // §8.4.4: userId はセッションから取得する（URLパラメータは使用しない）
    const userId = req.session?.user?.userId;
    const { bookId } = req.body;

    // -------------------------------------------------
    // 1. バリデーション
    // -------------------------------------------------
    // §8.4.4 失敗ケース: 未認証 → 401 E01
    if (!userId) {
        return res.status(401).json({ result: 'error', messageCode: 'E01', message: '認証が必要です。', data: null });
    }
    if (!bookId || String(bookId).trim() === '') {
        return res.status(400).json({ result: 'error', messageCode: 'E04', message: 'bookId は必須です。', data: null });
    }

    const transaction = await sequelize.transaction();
    try {
        const now = new Date().toISOString();
        const MAX_RESERVATIONS = 3;

        // -------------------------------------------------
        // 2. 予約上限チェック（仕様書 6-5-4）
        // -------------------------------------------------
        const activeCount = await Reservation.count({
            where: {
                userId,
                status: { [Op.ne]: RESERVATION_STATUS.CANCELLED }
            },
            transaction,
        });

        if (activeCount >= MAX_RESERVATIONS) {
            await transaction.rollback();

            // 仕様書 6-5-7: INFO / RESERVE_LIMIT
            await _writeAuditLog({
                level: 'INFO',
                eventType: 'RESERVE_LIMIT',
                userId,
                message: `予約上限超過 (bookId=${bookId})`,
            });

            // §8.4.4 失敗ケース: 予約上限超過 → 423 E11
            return res.status(423).json({
                result: 'error',
                messageCode: 'E11',
                message: `予約可能件数の上限（${MAX_RESERVATIONS}冊）を超えています`,
                data: null
            });
        }

        // -------------------------------------------------
        // 3. 重複チェック（仕様書 6-5-4）
        // -------------------------------------------------
        const duplicate = await Reservation.findOne({
            where: {
                userId,
                bookId,
                status: { [Op.ne]: RESERVATION_STATUS.CANCELLED }
            },
            transaction,
        });

        if (duplicate) {
            await transaction.rollback();

            // 仕様書 6-5-7: INFO / RESERVE_DUPLICATE
            await _writeAuditLog({
                level: 'INFO',
                eventType: 'RESERVE_DUPLICATE',
                userId,
                message: `重複予約 (bookId=${bookId})`,
            });

            // §8.4.4 失敗ケース: 重複予約 → 409 E02
            return res.status(409).json({
                result: 'error',
                messageCode: 'E02',
                message: '同じ書籍を重複して予約できません',
                data: null
            });
        }

        // -------------------------------------------------
        // 4. 書籍状態判定（仕様書 6-5-4 / 6-4-8）
        // -------------------------------------------------
        const book = await Book.findOne({
            where: { bookId },
            transaction
        });

        if (!book || book.isDisabled || !book.canReserve) {
            await transaction.rollback();

            // 仕様書 6-5-7: INFO / RESERVE_DISABLED
            await _writeAuditLog({
                level: 'INFO',
                eventType: 'RESERVE_DISABLED',
                userId,
                message: `予約不可書籍 (bookId=${bookId})`,
            });

            return res.status(400).json({
                result: 'error',
                messageCode: 'E02',
                message: 'この書籍は予約できません',
                data: null
            });
        }

        // -------------------------------------------------
        // 貸出中判定: returnDate が NULL のレコードが貸出中
        // -------------------------------------------------
        const activeLoan = await Loan.findOne({
            where: {
                bookId,
                returnDate: { [Op.is]: null }
            },
            transaction,
        });

        const isOnLoan = !!activeLoan;

        const status = isOnLoan
            ? RESERVATION_STATUS.WAITING
            : RESERVATION_STATUS.RESERVED;

        const pickup = isOnLoan
            ? null
            : _calcPickupDeadline();

        // -------------------------------------------------
        // queueNo 採番
        // -------------------------------------------------
        const maxQueueNo = await Reservation.max('queueNo', {
            where: {
                bookId,
                status: { [Op.ne]: RESERVATION_STATUS.CANCELLED }
            },
            transaction,
        });

        const queueNo = (maxQueueNo || 0) + 1;

        // -------------------------------------------------
        // 5. 予約登録（仕様書 6-5-5 step 6）
        //    reservationId は autoIncrement に委ねる
        // -------------------------------------------------
        const created = await Reservation.create({
            userId,
            bookId,
            status,
            reservedAt: now,
            pickupDeadline: pickup,
            queueNo,
            cancelledAt: null,
        }, { transaction });

        // -------------------------------------------------
        // 6. 履歴登録（仕様書 6-5-5 step 7）
        //    eventType='RESERVE', detail に書籍名・状態を記録
        // -------------------------------------------------
        const detail = isOnLoan
            ? `bookId=${bookId} title=${book.title} status=${RESERVATION_STATUS.WAITING}`
            : `bookId=${bookId} title=${book.title} pickupDeadline=${pickup}`;

        await History.create({
            userId,
            bookId,
            eventType: 'RESERVE',
            eventAt: now,
            detail,
        }, { transaction });

        // -------------------------------------------------
        // 7. 通知登録（仕様書 6-5-5 step 8）
        //    type='SUCCESS', title='予約完了'
        // -------------------------------------------------
        const notiMessage = isOnLoan
            ? `「${book.title}」を予約しました（現在貸出中のため順番待ちです）。`
            : `「${book.title}」を予約しました。受取期限は ${pickup} です。`;

        await Notification.create({
            userId,
            type: 'SUCCESS',
            title: '予約完了',
            message: notiMessage,
            isRead: false,
        }, { transaction });

        // -------------------------------------------------
        // 8. 監査ログ（仕様書 6-5-5 step 9）
        //    トランザクション内で commit 前に作成
        // -------------------------------------------------
        await Audit.create({
            level: 'INFO',
            eventType: 'RESERVE_SUCCESS',
            userId,
            message: `bookId=${bookId} の予約を登録 (reservationId=${created.reservationId})`,
        }, { transaction });

        await transaction.commit();

        // §8.4.4 成功レスポンス: message 固定、data に reservationId / bookId / reservedAt
        return res.status(200).json({
            result: 'success',
            messageCode: 'I01',
            message: `「${book.title}」を予約しました。`,
            data: {
                reservationId: created.reservationId,
                bookId: Number(bookId),
                reservedAt: now,
            },
        });

    } catch (err) {
        // -------------------------------------------------
        // 例外: ROLLBACK → audit に RESERVE_ERROR を記録（仕様書 6-5-7）
        // -------------------------------------------------
        try { await transaction.rollback(); } catch (_) { }

        await _writeAuditLog({
            level: 'ERROR',
            eventType: 'RESERVE_ERROR',
            userId,
            message: err.message,
        });

        return res.status(500).json({
            result: 'error',
            messageCode: 'E10',
            message: '処理に失敗しました',
            data: null
        });
    }
};

// =============================================================
// cancelReservation
// DELETE /api/v1/users/:userId/reservations/:reservationId
//
// §8.4.5 API-06 に準拠。本人確認後、予約ステータスを CANCELED に
// 更新します。History / Notification / Audit をトランザクション内で
// 原子的に記録します（§20.3）。
// =============================================================
exports.cancelReservation = async (req, res) => {
    const { userId, reservationId } = req.params;

    // -------------------------------------------------
    // 1. 認証チェック（§8.4.5: 未認証 → 401 E01）
    // -------------------------------------------------
    const sessionUserId = req.session?.user?.userId;

    if (!sessionUserId) {
        return res.status(401).json({
            result: 'error',
            messageCode: 'E01',
            message: '入力に誤りがあります。',
            data: null
        });
    }

    // -------------------------------------------------
    // 2. URLパラメータ バリデーション（§6.2: INTEGER ID は正の整数のみ → 400 E01）
    // -------------------------------------------------
    const userIdNum = parseInt(userId, 10);
    const reservationIdNum = parseInt(reservationId, 10);

    if (!Number.isInteger(userIdNum) || userIdNum <= 0) {
        return res.status(400).json({
            result: 'error',
            messageCode: 'E01',
            message: '入力に誤りがあります。',
            data: null
        });
    }

    if (!Number.isInteger(reservationIdNum) || reservationIdNum <= 0) {
        return res.status(400).json({
            result: 'error',
            messageCode: 'E01',
            message: '入力に誤りがあります。',
            data: null
        });
    }

    // -------------------------------------------------
    // 3. 本人確認（§8.4.5: :userId ≠ session.userId → 403 E02）
    // -------------------------------------------------
    if (userIdNum !== sessionUserId) {
        return res.status(403).json({
            result: 'error',
            messageCode: 'E02',
            message: '予約上限を超過、または対象書籍は予約できません。',
            data: null
        });
    }

    const transaction = await sequelize.transaction();

    try {
        // -------------------------------------------------
        // 4. 予約レコード取得（§8.4.5: 不在 → 404 W17）
        //    userId と reservationId の両方を条件にすることで
        //    他者の予約IDを誤って操作することを防ぐ。
        // -------------------------------------------------
        const reservation = await Reservation.findOne({
            where: {
                reservationId: reservationIdNum,
                userId: userIdNum
            },
            include: [
                {
                    model: Book,
                    attributes: ['title'],
                    required: false,
                }
            ],
            transaction,
        });

        if (!reservation) {
            await transaction.rollback();

            return res.status(404).json({
                result: 'error',
                messageCode: 'W17',
                message: '対象が見つかりません。',
                data: null
            });
        }

        // -------------------------------------------------
        // 5. 取消可能状態チェック（§9 W14: status ≠ RESERVED → 404 W14）
        // -------------------------------------------------
        if (
            reservation.status !== RESERVATION_STATUS.RESERVED &&
            reservation.status !== RESERVATION_STATUS.WAITING
        ) {
            await transaction.rollback();

            return res.status(404).json({
                result: 'error',
                messageCode: 'W14',
                message: 'キャンセル可能な予約ではありません。',
                data: null
            });
        }

        // -------------------------------------------------
        // 6. 予約ステータスを CANCELED に更新（§20.3 BEGIN IMMEDIATE）
        //    cancelledAt に現在日時を記録する（論理削除）。
        // -------------------------------------------------
        const now = new Date().toISOString();

        await reservation.update(
            {
                status: RESERVATION_STATUS.CANCELLED,
                cancelledAt: now
            },
            { transaction }
        );

        // -------------------------------------------------
        // 7. 履歴登録（§20.3: reservations.status='CANCELED' + history）
        //    eventType='CANCEL', detail に書籍ID・予約ID・状態を記録
        // -------------------------------------------------
        await History.create({
            userId: userIdNum,
            bookId: reservation.bookId,
            eventType: 'CANCEL',
            eventAt: now,
            detail: `bookId=${reservation.bookId} reservationId=${reservationIdNum} status=${RESERVATION_STATUS.CANCELLED}`,
        }, { transaction });

        // -------------------------------------------------
        // 8. 通知登録（§20.3: + audit_log）
        //    type='CANCEL_RESERVATION', title='予約取消'
        // -------------------------------------------------
        await Notification.create({
            userId: userIdNum,
            type: 'CANCEL_RESERVATION',
            title: '予約取消',
            message: reservation.Book?.title
                ? `「${reservation.Book.title}」の予約を取り消しました。`
                : `予約ID ${reservationIdNum} の予約を取り消しました。`,
            isRead: false,
        }, { transaction });

        // -------------------------------------------------
        // 9. 監査ログ（§20.3: + audit_log、トランザクション内で commit 前に作成）
        // -------------------------------------------------
        await Audit.create({
            level: 'INFO',
            eventType: 'CANCEL_RESERVATION',
            userId: userIdNum,
            message: `reservationId=${reservationIdNum} の予約を取消 (bookId=${reservation.bookId})`,
        }, { transaction });

        await transaction.commit();

        // §8.4.5 成功レスポンス（200 I03）
        return res.status(200).json({
            result: 'success',
            messageCode: 'I03',
            message: reservation.Book?.title
                ? `「${reservation.Book.title}」の予約をキャンセルしました。`
                : `予約ID ${reservationIdNum} の予約をキャンセルしました。`,
            data: null,
        });

    } catch (err) {
        // -------------------------------------------------
        // 例外: ROLLBACK → audit に CANCEL_ERROR を記録（§20.3 ROLLBACK + E10）
        // -------------------------------------------------
        try { await transaction.rollback(); } catch (_) { }

        await _writeAuditLog({
            level: 'ERROR',
            eventType: 'CANCEL_ERROR',
            userId: userIdNum,
            message: err.message,
        });

        return res.status(500).json({
            result: 'error',
            messageCode: 'E10',
            message: 'システムエラーが発生しました。',
            data: null,
        });
    }
};