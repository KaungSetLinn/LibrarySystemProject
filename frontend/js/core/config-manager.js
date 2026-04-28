/*
 * =============================================================================
 * ファイル名 : js/core/config-manager.js
 * 概要       : 設定管理モジュール（ConfigManager）。既定値・設定ファイル・
 *              localStorage の3段で設定を解決する。
 *
 * 仕様書トレーサビリティ:
 *   - 内部仕様書 CF01 loadConfig / CF02 validateConfig
 *   - 要求仕様書 §7 性能要求
 *   - テスト仕様 TC-COM-01〜05
 * 作成日 : 2026-04-26
 * =============================================================================
 */
"use strict";

const ConfigManager = (() => {

  // 内部設定（直接参照禁止、get経由で読む）
  let _cfg = {
    dbType: "Excel",
    maxReservations: 3,
    searchPageSize: 10,
    pickupDeadlineDays: 7
  };

  /**
   * CF01 - init
   * 概要 : フォールバック → localStorage の順に設定を解決する。
   * 事後条件 : _cfg に有効値が格納される（致命停止しない）
   */
  function init() {
    const fb = window.LIBRARY_CONFIG_FALLBACK || {};
    _cfg.dbType             = fb.dbType             || "Excel";
    _cfg.maxReservations    = Number(fb.maxReservations)    || 3;
    _cfg.searchPageSize     = Number(fb.searchPageSize)     || 10;
    _cfg.pickupDeadlineDays = Number(fb.pickupDeadlineDays) || 7;

    // localStorage 上書き（テスト・運用切替）
    const stored = _safeJSON(localStorage.getItem("lib-config"));
    if (stored && typeof stored === "object") {
      if (stored.dbType)                     _cfg.dbType             = stored.dbType;
      if (stored.maxReservations    != null) _cfg.maxReservations    = Number(stored.maxReservations);
      if (stored.searchPageSize     != null) _cfg.searchPageSize     = Number(stored.searchPageSize);
      if (stored.pickupDeadlineDays != null) _cfg.pickupDeadlineDays = Number(stored.pickupDeadlineDays);
    }
  }

  /**
   * CF02 - validateConfig
   * 概要 : 不正値を安全な既定値に補正する。
   */
  function validateConfig() {
    if (!["Excel", "SQLite"].includes(_cfg.dbType)) {
      _info("dbType 不正のため Excel に補正"); _cfg.dbType = "Excel";
    }
    if (!Number.isInteger(_cfg.maxReservations) || _cfg.maxReservations < 1) {
      _info("maxReservations 不正のため 3 に補正"); _cfg.maxReservations = 3;
    }
    if (!Number.isInteger(_cfg.searchPageSize) || _cfg.searchPageSize < 1) {
      _info("searchPageSize 不正のため 10 に補正"); _cfg.searchPageSize = 10;
    }
    if (!Number.isInteger(_cfg.pickupDeadlineDays) || _cfg.pickupDeadlineDays < 1) {
      _info("pickupDeadlineDays 不正のため 7 に補正"); _cfg.pickupDeadlineDays = 7;
    }
    return true;
  }

  function get(key) { return _cfg[key]; }
  function getAll() { return Object.assign({}, _cfg); }

  /** setDbType : 実行時に Excel↔SQLite を切り替える（TC-COM-02） */
  function setDbType(dbType) {
    if (!["Excel", "SQLite"].includes(dbType)) return false;
    _cfg.dbType = dbType;
    const cur = _safeJSON(localStorage.getItem("lib-config")) || {};
    cur.dbType = dbType;
    localStorage.setItem("lib-config", JSON.stringify(cur));
    return true;
  }

  function _safeJSON(s) { try { return s ? JSON.parse(s) : null; } catch { return null; } }
  function _info(m)     { if (typeof console !== "undefined") console.info("[ConfigManager]", m); }

  return { init, validateConfig, get, getAll, setDbType };
})();

window.ConfigManager = ConfigManager;
