'use strict';

/**
 * routes/admin.js
 * API-08系 ブリッジ（管理者専用）
 *   API-08a  POST /api/v1/admin/bridge/import
 *   API-08b  POST /api/v1/admin/bridge/export
 *   API-08c  POST /api/v1/admin/bridge/reset
 *
 * §8.4.10 準拠。全レスポンスは 4層構造（result / messageCode / message / data）。
 */

const express = require('express');
const router  = express.Router();

const sequelize    = require('../db/connection');
const Book         = require('../models/Book');
const Reservation  = require('../models/Reservation');
const Loan         = require('../models/Loan');
const User         = require('../models/User');
const History      = require('../models/History');
const Notification = require('../models/Notification');
const Audit        = require('../models/Audit');
const Favorite     = require('../models/Favorite');

const { _writeAuditLog } = require('../helpers/auditHelper');

// ---------------------------------------------------------------------------
// 管理者セッションチェック
// ---------------------------------------------------------------------------

function requireAdmin(req, res, next) {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({
            result:      'error',
            messageCode: 'E09',
            message:     'セッションが切れました。再度ログインしてください。',
            data:        null,
        });
    }
    if (!req.session.isAdmin) {
        return res.status(403).json({
            result:      'error',
            messageCode: 'E02',
            message:     '管理者専用の操作です。',
            data:        null,
        });
    }
    next();
}

// ---------------------------------------------------------------------------
// 取込／エクスポート対象テーブル定義
// 外部キー制約を考慮し、親テーブルを先に定義する
// ---------------------------------------------------------------------------

const TARGETS = [
    { key: 'users',         model: User,         pkField: 'userId'         },
    { key: 'books',         model: Book,         pkField: 'bookId'         },
    { key: 'reservations',  model: Reservation,  pkField: 'reservationId'  },
    { key: 'loans',         model: Loan,         pkField: 'loanId'         },
    { key: 'history',       model: History,      pkField: 'historyId'      },
    { key: 'notifications', model: Notification, pkField: 'notificationId' },
    { key: 'favorites',     model: Favorite,     pkField: 'favoriteId'     },
    { key: 'audit',         model: Audit,        pkField: 'logId'          },
];

// ---------------------------------------------------------------------------
// API-08a  POST /api/v1/admin/bridge/import
// ---------------------------------------------------------------------------

exports.importBridge = async (req, res) => {
    const { tables } = req.body ?? {};

    const userId = req.session?.user?.userId;

    if (!tables || typeof tables !== 'object' || Array.isArray(tables)) {
        return res.status(400).json({
            result:      'error',
            messageCode: 'E04',
            message:     '取込データが不正です。tables オブジェクトを含む JSON を送信してください。',
            data:        null,
        });
    }

    const hasAnyRecord = TARGETS.some(({ key }) => Array.isArray(tables[key]) && tables[key].length > 0);
    if (!hasAnyRecord) {
        return res.status(400).json({
            result:      'error',
            messageCode: 'E04',
            message:     '取込対象レコードが見つかりません。',
            data:        null,
        });
    }

    const t = await sequelize.transaction();
    try {
        let totalCount = 0;

        for (const { key, model } of TARGETS) {
            const rows = tables[key];
            if (!Array.isArray(rows) || rows.length === 0) continue;

            for (const row of rows) {
                await model.upsert(row, { transaction: t });
            }
            totalCount += rows.length;
        }

        await t.commit();

        await _writeAuditLog({
            level: 'INFO',
            eventType: 'BRIDGE_IMPORT',
            userId,
            message: `取込完了 recordCount=${totalCount}`
        });

        return res.status(200).json({
            result:      'success',
            messageCode: 'I00',
            message:     '取込みました。',
            data: {
                recordCount: totalCount,
            },
        });

    } catch (e) {
        await t.rollback();
        console.error('[bridge/import] error:', e);
        return res.status(500).json({
            result:      'error',
            messageCode: 'E10',
            message:     'システムエラーが発生しました。',
            data:        null,
        });
    }
};

router.post('/import', requireAdmin, async (req, res) => {
    
});

// ---------------------------------------------------------------------------
// API-08b  POST /api/v1/admin/bridge/export
// ---------------------------------------------------------------------------
exports.exportBridge = async (req, res) => {
    try {
        const tables = {};

        const userId = req.session?.user?.userId;

        for (const { key, model } of TARGETS) {
            tables[key] = await model.findAll({ raw: true });
        }

        const exportedAt = new Date().toISOString();

        await _writeAuditLog({
            level: 'INFO',
            eventType: 'BRIDGE_EXPORT',
            userId,
            message: `エクスポート完了 exportedAt=${exportedAt}`
        });

        return res.status(200).json({
            result:      'success',
            messageCode: 'I00',
            message:     'OK',
            data: {
                exportedAt,
                tables,
            },
        });

    } catch (e) {
        console.error('[bridge/export] error:', e);
        return res.status(500).json({
            result:      'error',
            messageCode: 'E10',
            message:     'システムエラーが発生しました。',
            data:        null,
        });
    }
};

// ---------------------------------------------------------------------------
// API-08c  POST /api/v1/admin/bridge/reset
// ---------------------------------------------------------------------------
exports.resetBridge = async (req, res) => {
    const t = await sequelize.transaction();

    const userId = req.session?.user?.userId;

    try {
        // 子テーブルから削除（TARGETS の逆順）
        for (const { model } of [...TARGETS].reverse()) {
            await model.destroy({ where: {}, truncate: false, transaction: t });
        }

        await t.commit();

        await _writeAuditLog({
            level: 'INFO',
            eventType: 'BRIDGE_RESET',
            userId,
            message: 'DB 初期化完了'
        });

        return res.status(200).json({
            result:      'success',
            messageCode: 'I00',
            message:     '初期化しました。',
            data:        null,
        });

    } catch (e) {
        await t.rollback();
        console.error('[bridge/reset] error:', e);
        return res.status(500).json({
            result:      'error',
            messageCode: 'E10',
            message:     'システムエラーが発生しました。',
            data:        null,
        });
    }
};