const { Op, literal } = require('sequelize');
const sequelize = require('../db/connection');
const Book = require('../models/Book');
const Reservation = require('../models/Reservation');
const Loan = require('../models/Loan');
const History = require('../models/History');
const Notification = require('../models/Notification');
const Audit = require('../models/Audit');

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
                status: { [Op.ne]: 'CANCELLED' },
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
            reservationId:  r.reservationId,
            userId:         r.userId,
            bookId:         r.bookId,
            title:          r.Book?.title  ?? null,
            author:         r.Book?.author ?? null,
            status:         r.status,
            reservedAt:     r.reservedAt,
            pickupDeadline: r.pickupDeadline,
            queueNo:        r.queueNo,
            cancelledAt:    r.cancelledAt,
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
// POST /api/users/:userId/reservations
// body: { bookId }
//
// 予約上限・重複・書籍状態チェックを行い、予約レコードを
// トランザクション内で登録します（仕様書 6-5）。
// History / Notification / Audit は仕様書 6-5-5 に従い実装。
// =============================================================
exports.reserveBook = async (req, res) => {
    const { userId } = req.params;
    const { bookId }  = req.body;

    // -------------------------------------------------
    // 1. バリデーション
    // -------------------------------------------------
    if (!userId || String(userId).trim() === '') {
        return res.status(400).json({ result: 'error', messageCode: 'E04', message: 'userId は必須です。', data: null });
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
            where: { userId, status: { [Op.ne]: 'CANCELLED' } },
            transaction,
        });
        if (activeCount >= MAX_RESERVATIONS) {
            await transaction.rollback();
            // 仕様書 6-5-7: INFO / RESERVE_LIMIT
            await _writeAuditLog({
                level: 'INFO', eventType: 'RESERVE_LIMIT',
                userId, message: `予約上限超過 (bookId=${bookId})`,
            });
            return res.status(400).json({ result: 'error', messageCode: 'E02', message: `予約可能件数の上限（${MAX_RESERVATIONS}冊）を超えています`, data: null });
        }

        // -------------------------------------------------
        // 3. 重複チェック（仕様書 6-5-4）
        // -------------------------------------------------
        const duplicate = await Reservation.findOne({
            where: { userId, bookId, status: { [Op.ne]: 'CANCELLED' } },
            transaction,
        });
        if (duplicate) {
            await transaction.rollback();
            // 仕様書 6-5-7: INFO / RESERVE_DUPLICATE
            await _writeAuditLog({
                level: 'INFO', eventType: 'RESERVE_DUPLICATE',
                userId, message: `重複予約 (bookId=${bookId})`,
            });
            return res.status(400).json({ result: 'error', messageCode: 'E02', message: '同じ書籍を重複して予約できません', data: null });
        }

        // -------------------------------------------------
        // 4. 書籍状態判定（仕様書 6-5-4 / 6-4-8）
        // -------------------------------------------------
        const book = await Book.findOne({ where: { bookId }, transaction });
        if (!book || book.isDisabled || !book.canReserve) {
            await transaction.rollback();
            // 仕様書 6-5-7: INFO / RESERVE_DISABLED
            await _writeAuditLog({
                level: 'INFO', eventType: 'RESERVE_DISABLED',
                userId, message: `予約不可書籍 (bookId=${bookId})`,
            });
            return res.status(400).json({ result: 'error', messageCode: 'E02', message: 'この書籍は予約できません', data: null });
        }

        // -------------------------------------------------
        // 貸出中判定: returnDate が NULL のレコードが貸出中
        // -------------------------------------------------
        const activeLoan = await Loan.findOne({
            where: { bookId, returnDate: { [Op.is]: null } },
            transaction,
        });
        const isOnLoan = !!activeLoan;

        const status = isOnLoan ? 'WAITING' : 'RESERVED';
        const pickup = isOnLoan ? null : _calcPickupDeadline();

        // -------------------------------------------------
        // 5. 予約登録（仕様書 6-5-5 step 6）
        //    reservationId は autoIncrement に委ねる
        // -------------------------------------------------
        const created = await Reservation.create({
            userId,
            bookId,
            status,
            reservedAt:     now,
            pickupDeadline: pickup,
            queueNo:        1,
            cancelledAt:    null,
        }, { transaction });

        // -------------------------------------------------
        // 6. 履歴登録（仕様書 6-5-5 step 7）
        //    eventType='RESERVE', detail に書籍名・状態を記録
        // -------------------------------------------------
        const detail = isOnLoan
            ? `bookId=${bookId} title=${book.title} status=WAITING`
            : `bookId=${bookId} title=${book.title} pickupDeadline=${pickup}`;

        await History.create({
            userId,
            bookId,
            eventType: 'RESERVE',
            eventAt:   now,
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
            type:       'SUCCESS',
            title:      '予約完了',
            message:    notiMessage,
            isRead:     false,
        }, { transaction });

        // -------------------------------------------------
        // 8. 監査ログ（仕様書 6-5-5 step 9）
        //    トランザクション内で commit 前に作成
        // -------------------------------------------------
        await Audit.create({
            level:     'INFO',
            eventType: 'RESERVE_SUCCESS',
            userId,
            message:   `bookId=${bookId} の予約を登録 (reservationId=${created.reservationId})`,
        }, { transaction });

        await transaction.commit();

        const message = isOnLoan ? '予約を登録しました（順番待ち）' : '予約を登録しました';
        return res.status(200).json({
            result:      'success',
            messageCode: 'I01',
            message,
            data: { reservationId: created.reservationId, status },
        });

    } catch (err) {
        // -------------------------------------------------
        // 例外: ROLLBACK → audit に RESERVE_ERROR を記録（仕様書 6-5-7）
        // -------------------------------------------------
        try { await transaction.rollback(); } catch (_) {}
        await _writeAuditLog({
            level: 'ERROR', eventType: 'RESERVE_ERROR',
            userId, message: err.message,
        });
        return res.status(500).json({ result: 'error', messageCode: 'E10', message: '処理に失敗しました', data: null });
    }
};