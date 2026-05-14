const sequelize = require('../db/connection');
const Notification = require('../models/Notification');
const Audit = require('../models/Audit');

const { _writeAuditLog } = require('../helpers/auditHelper');
const { _checkOwner } = require('../helpers/ownerHelper');

// =============================================================
// API-03b  GET /api/v1/users/:userId/notifications
//
// 通知一覧をページング付きで返す（§8.4.2b）
// Query: page（既定 0）、pageSize（既定 20、最大 100）
// =============================================================
exports.listNotifications = async (req, res) => {

    // --------------------------------------------------
    // 1. userId バリデーション & 本人確認
    // --------------------------------------------------
    const userIdNum = parseInt(req.params.userId, 10);

    if (!Number.isInteger(userIdNum) || userIdNum <= 0) {
        return res.status(400).json({
            result: 'error',
            messageCode: 'E01',
            message: '入力に誤りがあります。',
            data: null,
        });
    }

    if (!_checkOwner(req, res, userIdNum)) return;

    // --------------------------------------------------
    // 2. ページネーション パラメータ
    // --------------------------------------------------
    let page = parseInt(req.query.page, 10);
    let pageSize = parseInt(req.query.pageSize, 10);
    if (isNaN(page) || page < 0) page = 0;
    if (isNaN(pageSize) || pageSize < 1) pageSize = 20;
    if (pageSize > 100) pageSize = 100;

    const offset = page * pageSize;

    try {

        // --------------------------------------------------
        // 3. 通知一覧取得
        // --------------------------------------------------
        const { count, rows } = await Notification.findAndCountAll({
            where: { userId: userIdNum },
            order: [['createdAt', 'DESC']],
            limit: pageSize,
            offset,
        });

        const totalPages = count === 0
            ? 0
            : Math.ceil(count / pageSize);

        const notifications = rows.map(n => ({
            notificationId: n.notificationId,
            type: n.type,
            title: n.title,
            body: n.message,
            isRead: n.isRead,
            createdAt: n.createdAt,
        }));

        return res.status(200).json({
            result: 'success',
            messageCode: 'I00',
            message: 'OK',
            data: {
                count,
                page,
                pageSize,
                totalPages,
                notifications,
            },
        });

    } catch (err) {

        await _writeAuditLog({
            level: 'ERROR',
            eventType: 'NOTIFICATION_LIST_ERROR',
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

// =============================================================
// API-14  POST /api/v1/users/:userId/notifications/:notificationId/read
//
// 通知を既読状態に変更する（§8.4.14）
// =============================================================
exports.markAsRead = async (req, res) => {

    // --------------------------------------------------
    // 1. userId / notificationId バリデーション & 本人確認
    // --------------------------------------------------
    const userIdNum = parseInt(req.params.userId, 10);

    const notificationIdNum = parseInt(
        req.params.notificationId,
        10
    );

    if (!Number.isInteger(userIdNum) || userIdNum <= 0) {
        return res.status(400).json({
            result: 'error',
            messageCode: 'E01',
            message: '入力に誤りがあります。',
            data: null,
        });
    }

    if (
        !Number.isInteger(notificationIdNum) ||
        notificationIdNum <= 0
    ) {
        return res.status(400).json({
            result: 'error',
            messageCode: 'E01',
            message: '入力に誤りがあります。',
            data: null,
        });
    }

    if (!_checkOwner(req, res, userIdNum)) return;

    const transaction = await sequelize.transaction();

    try {

        // --------------------------------------------------
        // 2. 通知存在チェック & 本人所有チェック（W17）
        // --------------------------------------------------
        const notification = await Notification.findOne({
            where: {
                notificationId: notificationIdNum,
                userId: userIdNum,
            },
            transaction,
        });

        if (!notification) {

            await transaction.rollback();

            return res.status(404).json({
                result: 'error',
                messageCode: 'W17',
                message: '対象が見つかりません。',
                data: null,
            });
        }

        // --------------------------------------------------
        // 3. 重複既読チェック（W19）
        // --------------------------------------------------
        if (notification.isRead) {

            await transaction.rollback();

            return res.status(409).json({
                result: 'error',
                messageCode: 'W19',
                message: '既に既読状態です。',
                data: null,
            });
        }

        // --------------------------------------------------
        // 4. 既読化
        // --------------------------------------------------
        notification.isRead = true;
        notification.readAt = new Date();

        await notification.save({ transaction });

        // --------------------------------------------------
        // 5. 監査ログ
        // --------------------------------------------------
        await Audit.create({
            level: 'INFO',
            eventType: 'MARK_READ',
            userId: userIdNum,
            message:
                `notificationId=${notificationIdNum} を既読化`,
        }, { transaction });

        await transaction.commit();

        return res.status(200).json({
            result: 'success',
            messageCode: 'I04',
            message: '通知を既読にしました。',
            data: {
                notificationId: notification.notificationId,
                isRead: notification.isRead,
                readAt: notification.readAt,
            },
        });

    } catch (err) {

        try {
            await transaction.rollback();
        } catch (_) { }

        await _writeAuditLog({
            level: 'ERROR',
            eventType: 'MARK_NOTIFICATION_READ_ERROR',
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