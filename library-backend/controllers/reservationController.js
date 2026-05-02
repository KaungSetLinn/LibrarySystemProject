const { Op, literal, fn, col } = require('sequelize');
const sequelize = require('../db/connection');
const Book = require('../models/Book');
const Reservation = require('../models/Reservation');
const Loan = require('../models/Loan');

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
        // DB例外
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
// [FIX 3] _nextReservationId を削除
//   Reservation.reservationId は INTEGER / autoIncrement であるため、
//   文字列 "R-XXXXX" 形式の採番は型不一致を引き起こす。
//   INSERT 時は reservationId を指定せず DB の autoIncrement に委ねる。
// =============================================================
 
// =============================================================
// reserveBook
// POST /api/users/:userId/reservations
// body: { bookId }
//
// 予約上限・重複・書籍状態チェックを行い、予約レコードを
// トランザクション内で登録します（仕様書 6-5）。
// History / Notification / Audit は対応モデル追加後に実装予定。
// =============================================================
exports.reserveBook = async (req, res) => {
    const { userId } = req.params;
    const { bookId }  = req.body;
 
    // -------------------------------------------------
    // 1. バリデーション
    // -------------------------------------------------
    if (!userId || String(userId).trim() === '') {
        return res.status(400).json({ success: false, reservationId: null, message: 'userId は必須です。' });
    }
    if (!bookId || String(bookId).trim() === '') {
        return res.status(400).json({ success: false, reservationId: null, message: 'bookId は必須です。' });
    }
 
    const transaction = await sequelize.transaction();
    try {
        const now = new Date().toISOString();
        const MAX_RESERVATIONS = 3; // ConfigManager.get("maxReservations") 相当
 
        // -------------------------------------------------
        // 2. 予約上限チェック（仕様書 6-5-4）
        // -------------------------------------------------
        const activeCount = await Reservation.count({
            where: { userId, status: { [Op.ne]: 'CANCELLED' } },
            transaction,
        });
        if (activeCount >= MAX_RESERVATIONS) {
            await transaction.rollback();
            return res.json({ success: false, reservationId: null,
                message: `予約可能件数の上限（${MAX_RESERVATIONS}冊）を超えています` });
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
            return res.json({ success: false, reservationId: null, message: '同じ書籍を重複して予約できません' });
        }
 
        // -------------------------------------------------
        // 4. 書籍状態判定（仕様書 6-5-4 / 6-4-8）
        // -------------------------------------------------
        const book = await Book.findOne({ where: { bookId }, transaction });
        if (!book || book.isDisabled || !book.canReserve) {
            await transaction.rollback();
            return res.json({ success: false, reservationId: null, message: 'この書籍は予約できません' });
        }
 
        // -------------------------------------------------
        // [FIX 2] 貸出中判定
        //   Loan モデルに "status" フィールドは存在しない。
        //   returnDate が NULL であるレコードが貸出中を意味する。
        // -------------------------------------------------
        const activeLoan = await Loan.findOne({
            where: {
                bookId,
                returnDate: { [Op.is]: null },
            },
            transaction,
        });
        const isOnLoan = !!activeLoan;
 
        // 状態判定: 貸出中 → WAITING、それ以外 → RESERVED
        const status = isOnLoan ? 'WAITING' : 'RESERVED';
        const pickup = isOnLoan ? null : _calcPickupDeadline();
 
        // -------------------------------------------------
        // [FIX 3] reservationId の明示指定を廃止
        //   Reservation.reservationId は INTEGER / autoIncrement。
        //   文字列 "R-XXXXX" を渡すと型不一致になるため、
        //   DB の autoIncrement に採番を委ねる（フィールド自体を渡さない）。
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
 
        await transaction.commit();
 
        const message = isOnLoan ? '予約を登録しました（順番待ち）' : '予約を登録しました';
        // autoIncrement で採番された ID を返す
        return res.json({ success: true, reservationId: created.reservationId, message });
 
    } catch (err) {
        // -------------------------------------------------
        // 例外: ROLLBACK（仕様書 6-5-4）
        // -------------------------------------------------
        try { await transaction.rollback(); } catch (_) {}
        return res.status(500).json({ success: false, reservationId: null, message: '処理に失敗しました' });
    }
};