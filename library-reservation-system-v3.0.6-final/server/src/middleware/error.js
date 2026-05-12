/*
 * =============================================================================
 * ファイル名 : server/src/middleware/error.js
 * 概要       : Express エラーハンドラミドルウェア。
 *              全例外を四層構造のエラー応答に変換する。
 *
 * 仕様書トレーサビリティ:
 *   - 外部仕様書 v3.0  §8.2.1 四層構造 / §8.2.2 HTTPステータス
 *   - 内部仕様書 v3.0  §7 例外処理方針
 *   - 議事録          P4-04 / P2-05
 *
 * 改訂履歴:
 *   v3.0  2026-05-04  Y.Toyoda  新規作成
 *
 * @author  Y.Toyoda
 * @version v3.0
 * =============================================================================
 */
"use strict";

const { logger } = require("../utils/logger");
const { err }    = require("../utils/response");

/**
 * errorMiddleware
 * 概要 : 例外を四層構造の error 応答に変換する。
 *        CSRF / AppError / 未知例外 で分岐する。
 *
 * @param {Error} error
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {void}
 * @spec    外部仕様 §8.2.1
 */
function errorMiddleware(error, req, res, next) {
  // CSRFトークン不正
  if (error && error.code === "EBADCSRFTOKEN") {
    logger.warn("error.csrf", "CSRFトークン検証失敗", { path: req.path });
    return err(res, "E01", "CSRFトークンが不正です。", 403);
  }
  // 既知の AppError（messageCode と httpStatus を持つ）
  if (error && error.messageCode && error.httpStatus) {
    logger.warn("error.app", error.message, { code: error.messageCode, path: req.path });
    return err(res, error.messageCode, error.message, error.httpStatus);
  }
  // 未知の例外
  logger.error("error.unhandled", error.message, { stack: error.stack, path: req.path });
  return err(res, "E01", "システムエラーが発生しました。", 500);
}

module.exports = { errorMiddleware };
