'use strict';

const Audit = require('../models/Audit');

/**
 * audit ログ書き込みヘルパー
 *
 * 呼び出し元のトランザクションとは独立して実行する（transaction を渡さない）。
 * audit 書き込み失敗はサイレントに無視し、本処理を止めない。
 *
 * @param {object} params
 * @param {string} params.level     - ログレベル（例: 'INFO', 'ERROR'）
 * @param {string} params.eventType - イベント種別（例: 'RESERVE_ERROR'）
 * @param {number|null} params.userId  - 利用者ID（不明な場合は null）
 * @param {string} params.message   - 詳細メッセージ
 */
async function _writeAuditLog({ level, eventType, userId, message }) {
    try {
        await Audit.create({ level, eventType, userId: userId ?? null, message });
    } catch (_) {
        // audit 書き込み失敗はサイレントに無視（本処理を止めない）
    }
}

module.exports = { _writeAuditLog };