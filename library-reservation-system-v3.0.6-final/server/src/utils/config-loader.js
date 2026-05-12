/*
 * =============================================================================
 * ファイル名 : server/src/utils/config-loader.js
 * 概要       : app/library-system-config.txt を SSOT として読込むユーティリティ。
 *              app/ 側 ConfigManager と完全に同じパース仕様で実装し、
 *              server/ と app/ で設定値が揃うことを保証する。
 *
 * 仕様書トレーサビリティ:
 *   - 内部仕様書 v3.0  CF01 loadConfig（サーバー側実装）
 *   - 議事録          S-09 / D-01（SSOT 経路）
 *
 * 改訂履歴:
 *   v3.0  2026-05-04  Y.Toyoda  新規作成
 *
 * @author  Y.Toyoda
 * @version v3.0
 * =============================================================================
 */
"use strict";

const fs   = require("fs");
const path = require("path");

/** 設定既定値（最後の安全網） */
const DEFAULTS = Object.freeze({
  dbType: "SQLite",        // server/ では既定 SQLite（app/ では Excel）
  maxReservations: 3,
  searchPageSize: 10,
  pickupDeadlineDays: 7,
  sessionTimeoutMinutes: 30,
  logLevel: "info"
});

/**
 * _stripBOM
 * 概要 : UTF-8 BOM を除去する。
 * @param {string} s
 * @returns {string}
 */
function _stripBOM(s) {
  return typeof s === "string" && s.charCodeAt(0) === 0xFEFF ? s.slice(1) : s;
}

/**
 * _parseKVText
 * 概要 : key=value 形式テキストをオブジェクト化する。
 * @param {string} text
 * @returns {Object}
 */
function _parseKVText(text) {
  const out = {};
  if (typeof text !== "string") return out;
  text.split(/\r?\n/).forEach(line => {
    const t = line.trim();
    if (!t || t.startsWith("#") || t.startsWith("//")) return;
    const eq = t.indexOf("=");
    if (eq <= 0) return;
    const k = t.slice(0, eq).trim();
    const v = t.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    out[k] = v;
  });
  return out;
}

/**
 * loadAppConfig
 * 概要 : app/library-system-config.txt を読込み、型変換した設定を返す。
 *        失敗時は DEFAULTS を返す（致命停止しない）。
 *
 * @returns {{dbType:string, maxReservations:number, searchPageSize:number,
 *            pickupDeadlineDays:number, sessionTimeoutMinutes:number, logLevel:string}}
 * @spec    内部仕様 CF01 / 議事録 S-09
 *
 * @example
 *   const cfg = loadAppConfig();
 *   console.log(cfg.dbType); // "Excel" | "SQLite"
 */
function loadAppConfig() {
  const txtPath = path.join(__dirname, "..", "..", "..", "app", "library-system-config.txt");
  try {
    const raw = _stripBOM(fs.readFileSync(txtPath, "utf-8"));
    const kv = _parseKVText(raw);
    return {
      dbType:                kv.dbType || DEFAULTS.dbType,
      maxReservations:       Number(kv.maxReservations)       || DEFAULTS.maxReservations,
      searchPageSize:        Number(kv.searchPageSize)        || DEFAULTS.searchPageSize,
      pickupDeadlineDays:    Number(kv.pickupDeadlineDays)    || DEFAULTS.pickupDeadlineDays,
      sessionTimeoutMinutes: Number(kv.sessionTimeoutMinutes) || DEFAULTS.sessionTimeoutMinutes,
      logLevel:              kv.logLevel || DEFAULTS.logLevel
    };
  } catch (e) {
    console.warn("[config-loader] app/library-system-config.txt 読込失敗。既定値を使用:", e.message);
    return Object.assign({}, DEFAULTS);
  }
}

module.exports = { loadAppConfig, DEFAULTS };
