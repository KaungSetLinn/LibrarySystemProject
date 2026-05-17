/*
 * READABLE-CODE REVIEW NOTE
 * 対象ファイル: library-Tbackend/controllers/reservationController.js
 * 責務: 豊田テスト backend の Controller。HTTP 入出力、DB問い合わせ、レスポンス整形を担当する。
 * 保守メモ: フロントエンド契約とレスポンス項目名を揃えること。検索結果では actionState/canReserve が UI 制御に使われる。
 */
const { Op, literal } = require('sequelize');
const sequelize = require('../db/connection');
const Book = require('../models/Book');
const Reservation = require('../models/Reservation');
const Loan = require('../models/Loan');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');

const STATUS = Object.freeze({
    RESERVED: 'RESERVED',
    WAITING: 'WAITING',
    CANCELLED: 'CANCELLED',
});

function _calcPickupDeadline() {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
}

async function _audit(level, eventType, userId, message, transaction) {
    try {
        await AuditLog.create({ level, eventType, userId: userId || null, message }, { transaction });
    } catch (_e) { /* 監査失敗で本処理を止めない */ }
}

async function _notify(userId, type, title, message, transaction) {
    try {
        await Notification.create({ userId, type, title, message, isRead: false }, { transaction });
    } catch (_e) { /* 通知失敗で本処理を止めない */ }
}

/**
 * GET /api/users/:userId/reservations/active
 * 指定利用者のキャンセル以外の有効な予約一覧を返却します。
 */
exports.getActiveReservations = async (req, res) => {
    const { userId } = req.params;

    if (!userId || String(userId).trim() === '') {
        return res.status(400).json({ error: 'userId は必須です。' });
    }

    try {
        const reservations = await Reservation.findAll({
            where: {
                userId,
                status: { [Op.ne]: STATUS.CANCELLED },
            },
            include: [
                {
                    model: Book,
                    required: false,
                    attributes: ['title', 'author'],
                },
            ],
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

        return res.json({ count: data.length, reservations: data });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

/** POST /api/reservations */
exports.reserveBook = async (req, res) => {
    const userId = req.session?.user?.userId;
    const { bookId } = req.body;

    if (!userId) {
        return res.status(401).json({ result: 'error', messageCode: 'E01', message: '認証が必要です。', data: null });
    }
    if (!bookId || String(bookId).trim() === '') {
        return res.status(400).json({ result: 'error', messageCode: 'E04', message: 'bookId は必須です。', data: null });
    }

    const transaction = await sequelize.transaction();
    try {
        const MAX_RESERVATIONS = 3;
        const now = new Date().toISOString();

        const activeCount = await Reservation.count({
            where: { userId, status: { [Op.ne]: STATUS.CANCELLED } },
            transaction,
        });
        if (activeCount >= MAX_RESERVATIONS) {
            await transaction.rollback();
            await _audit('INFO', 'RESERVE_LIMIT', userId, `予約上限超過 (bookId=${bookId})`);
            return res.status(423).json({
                result: 'error', messageCode: 'E11',
                message: `予約可能件数の上限（${MAX_RESERVATIONS}冊）を超えています`, data: null,
            });
        }

        const duplicate = await Reservation.findOne({
            where: { userId, bookId, status: { [Op.ne]: STATUS.CANCELLED } },
            transaction,
        });
        if (duplicate) {
            await transaction.rollback();
            await _audit('INFO', 'RESERVE_DUPLICATE', userId, `重複予約 (bookId=${bookId})`);
            return res.status(409).json({
                result: 'error', messageCode: 'E02',
                message: '同じ書籍を重複して予約できません', data: null,
            });
        }

        const book = await Book.findOne({ where: { bookId }, transaction });
        if (!book || book.isDisabled || !book.canReserve) {
            await transaction.rollback();
            await _audit('INFO', 'RESERVE_DISABLED', userId, `予約不可書籍 (bookId=${bookId})`);
            return res.status(400).json({
                result: 'error', messageCode: 'E02',
                message: 'この書籍は予約できません', data: null,
            });
        }

        const activeLoan = await Loan.findOne({
            where: { bookId, returnDate: { [Op.is]: null } },
            transaction,
        });
        const status = activeLoan ? STATUS.WAITING : STATUS.RESERVED;
        const pickupDeadline = activeLoan ? null : _calcPickupDeadline();
        const maxQueueNo = await Reservation.max('queueNo', {
            where: { bookId, status: { [Op.ne]: STATUS.CANCELLED } },
            transaction,
        });

        const created = await Reservation.create({
            userId,
            bookId,
            status,
            reservedAt: now,
            pickupDeadline,
            queueNo: (maxQueueNo || 0) + 1,
            cancelledAt: null,
        }, { transaction });

        const message = activeLoan
            ? `「${book.title}」を予約しました（貸出中のため順番待ちです）。`
            : `「${book.title}」を予約しました。`;
        await _notify(userId, 'SUCCESS', '予約完了', message, transaction);
        await _audit('INFO', 'RESERVE_SUCCESS', userId,
            `bookId=${bookId} reservationId=${created.reservationId}`, transaction);

        await transaction.commit();
        return res.status(200).json({
            result: 'success',
            messageCode: 'I01',
            message,
            data: {
                reservationId: created.reservationId,
                bookId: Number(bookId),
                reservedAt: now,
                status,
            },
        });
    } catch (err) {
        try { await transaction.rollback(); } catch (_e) { }
        await _audit('ERROR', 'RESERVE_ERROR', userId, err.message);
        return res.status(500).json({
            result: 'error', messageCode: 'E10',
            message: '処理に失敗しました', data: null,
        });
    }
};

/** DELETE /api/users/:userId/reservations/:reservationId */
exports.cancelReservation = async (req, res) => {
    const { userId, reservationId } = req.params;
    const sessionUserId = req.session?.user?.userId;

    if (!sessionUserId) {
        return res.status(401).json({ result: 'error', messageCode: 'E01', message: '認証が必要です。', data: null });
    }
    if (String(userId) !== String(sessionUserId)) {
        return res.status(403).json({ result: 'error', messageCode: 'E02', message: '本人以外の予約は取消できません。', data: null });
    }

    const transaction = await sequelize.transaction();
    try {
        const reservation = await Reservation.findOne({
            where: { reservationId, userId },
            include: [{ model: Book, attributes: ['title'], required: false }],
            transaction,
        });

        if (!reservation) {
            await transaction.rollback();
            return res.status(404).json({ result: 'error', messageCode: 'W17', message: '対象が見つかりません。', data: null });
        }
        if (reservation.status !== STATUS.RESERVED && reservation.status !== STATUS.WAITING) {
            await transaction.rollback();
            return res.status(404).json({ result: 'error', messageCode: 'W14', message: 'キャンセル可能な予約ではありません。', data: null });
        }

        const now = new Date().toISOString();
        await reservation.update({ status: STATUS.CANCELLED, cancelledAt: now }, { transaction });
        const title = reservation.Book?.title;
        const message = title
            ? `「${title}」の予約をキャンセルしました。`
            : `予約ID ${reservationId} の予約をキャンセルしました。`;
        await _notify(userId, 'INFO', '予約取消', message, transaction);
        await _audit('INFO', 'CANCEL_RESERVATION', userId,
            `reservationId=${reservationId} bookId=${reservation.bookId}`, transaction);

        await transaction.commit();
        return res.json({ result: 'success', messageCode: 'I03', message, data: null });
    } catch (err) {
        try { await transaction.rollback(); } catch (_e) { }
        await _audit('ERROR', 'CANCEL_ERROR', userId, err.message);
        return res.status(500).json({ result: 'error', messageCode: 'E10', message: 'システムエラーが発生しました。', data: null });
    }
};
