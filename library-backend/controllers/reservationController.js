const { Op, literal } = require('sequelize');
const Book = require('../models/Book');
const Reservation = require('../models/Reservation');

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