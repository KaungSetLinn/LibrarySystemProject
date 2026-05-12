/*
 * =============================================================================
 * ファイル名 : server/src/utils/response.js
 * 概要       : 四層構造応答ヘルパ（外部仕様 §8.2.1）。
 *              全 API は { result, messageCode, message, data } 形式で返す。
 *
 * 仕様書トレーサビリティ:
 *   - 外部仕様書 v3.0  §8.2.1 四層構造の正式定義
 *   - ADR-003 / ADR-005
 *   - 議事録          P4-05 / D-01
 *
 * 改訂履歴:
 *   v3.0  2026-05-04  Y.Toyoda  新規作成
 *
 * @author  Y.Toyoda
 * @version v3.0
 * =============================================================================
 */
"use strict";

/**
 * ok
 * 概要 : 成功時の四層構造応答を生成する。
 *
 * @param {Object} res Express response
 * @param {string} messageCode /^[IWE][0-9]{2}$/
 * @param {string} message
 * @param {*} [data]
 * @param {number} [status=200]
 * @returns {Object}
 * @spec    外部仕様 §8.2.1
 */
function ok(res, messageCode, message, data, status = 200) {
  return res.status(status).json({
    result: "success",
    messageCode,
    message,
    data: data ?? {}
  });
}

/**
 * err
 * 概要 : エラー時の四層構造応答を生成する（data は必ず null）。
 *
 * @param {Object} res Express response
 * @param {string} messageCode
 * @param {string} message
 * @param {number} [status=400]
 * @returns {Object}
 * @spec    外部仕様 §8.2.1 / 議事録 P4-07
 */
function err(res, messageCode, message, status = 400) {
  return res.status(status).json({
    result: "error",
    messageCode,
    message,
    data: null
  });
}

module.exports = { ok, err };
