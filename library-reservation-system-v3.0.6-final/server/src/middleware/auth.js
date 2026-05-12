/*
 * =============================================================================
 * ファイル名 : server/src/middleware/auth.js
 * 概要       : 認証ミドルウェア。セッション必須 API を保護する。
 *
 * 仕様書トレーサビリティ:
 *   - 外部仕様書 v3.0  §7 認証認可
 *   - ADR-006 認証方式
 *   - 議事録          P4-12 / BUG-09
 *
 * 改訂履歴:
 *   v3.0  2026-05-04  Y.Toyoda  新規作成
 *
 * @author  Y.Toyoda
 * @version v3.0
 * =============================================================================
 */
"use strict";

const { err } = require("../utils/response");

/**
 * requireAuth
 * 概要 : セッションが無いリクエストを 401 で弾く。
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {void}
 * @spec    外部仕様 §7
 */
function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return err(res, "W02", "セッションが切れました。再度ログインしてください。", 401);
  }
  next();
}

module.exports = { requireAuth };
