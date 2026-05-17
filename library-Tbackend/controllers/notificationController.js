/*
 * Readable-code review note:
 * - Role: Test-backend controller. Keep request validation, DB access, and response mapping visible as separate steps.
 * - Keep behavior unchanged unless a specification or bug-fix task explicitly requires it.
 * - Comments in this file should explain intent, data contracts, and edge cases rather than repeat the code.
 */
/*
 * -----------------------------------------------------------------------------
 * ファイル名 : library-Tbackend/controllers/notificationController.js
 * 概要       : 通知コントローラ(豊田 v3.0.6 由来、Tbackend 追加)。
 *              一覧取得、個別既読化、一括既読化を提供。
 * 作成者     : Y.Toyoda
 * 作成日     : 2026-05-12
 * -----------------------------------------------------------------------------
 */
const { Op } = require('sequelize');
const Notification = require('../models/Notification');

/**
 * GET /api/users/:userId/notifications
 * 通知一覧を取得。未読優先、createdAt 降順。
 */
exports.listNotifications = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) return res.status(400).json({ error: 'userId は必須です。' });

        const list = await Notification.findAll({
            where: { userId },
            order: [
                ['isRead', 'ASC'],         // 未読(false)優先
                ['createdAt', 'DESC']
            ]
        });
        const unread = list.filter(n => !n.isRead).length;
        return res.json({ count: list.length, unread, notifications: list });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

/**
 * POST /api/users/:userId/notifications/:notificationId/read
 * 個別通知を既読化。
 */
exports.markRead = async (req, res) => {
    try {
        const { userId, notificationId } = req.params;
        const n = await Notification.findOne({ where: { notificationId, userId } });
        if (!n) return res.status(404).json({ result: 'error', message: '通知が見つかりません。' });
        n.isRead = true;
        n.readAt = new Date().toISOString();
        await n.save();
        return res.json({ result: 'success' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

/**
 * POST /api/users/:userId/notifications/read-all
 * 利用者の全未読通知を一括既読化。
 */
exports.markAllRead = async (req, res) => {
    try {
        const { userId } = req.params;
        const now = new Date().toISOString();
        const [count] = await Notification.update(
            { isRead: true, readAt: now },
            { where: { userId, isRead: false } }
        );
        return res.json({ result: 'success', count });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
