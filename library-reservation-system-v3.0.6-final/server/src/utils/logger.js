/*
 * =============================================================================
 * ファイル名 : server/src/utils/logger.js
 * 概要       : サーバー側 Logger（winston + daily-rotate-file）。
 *              外部仕様 §17 ロギング仕様に従う。
 *
 * 仕様書トレーサビリティ:
 *   - 外部仕様書 v3.0  §17 ロギング仕様
 *   - ADR-014 ロギング基盤
 *
 * 改訂履歴:
 *   v3.0  2026-05-04  Y.Toyoda  新規作成
 *
 * @author  Y.Toyoda
 * @version v3.0
 * =============================================================================
 */
"use strict";

const winston = require("winston");
require("winston-daily-rotate-file");
const path = require("path");

/** マスク対象キー（外部仕様 §17） */
const MASK_KEYS = ["password", "passwordHash", "sessionId", "csrfToken", "secret"];

/**
 * maskSecrets
 * 概要 : ログ出力前に機密キーをマスクする。
 * @param {*} obj
 * @returns {*}
 */
function maskSecrets(obj) {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(maskSecrets);
  const out = {};
  for (const k of Object.keys(obj)) {
    out[k] = MASK_KEYS.includes(k) ? "***MASKED***" : maskSecrets(obj[k]);
  }
  return out;
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.DailyRotateFile({
      filename: path.join("logs", "application-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: "30d"
    })
  ]
});

/**
 * requestLogger
 * 概要 : リクエストログミドルウェア。method/path/status/responseTime を記録する。
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {void}
 */
function requestLogger(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    logger.info("http", {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      ms: Date.now() - start,
      userId: req.session?.userId || null
    });
  });
  next();
}

module.exports = { logger, requestLogger, maskSecrets };
