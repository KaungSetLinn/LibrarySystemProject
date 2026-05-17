/*
 * Readable-code review note:
 * - Role: Single source of truth for runtime configuration. Parser changes must stay compatible with generated fallback config.
 * - Keep behavior unchanged unless a specification or bug-fix task explicitly requires it.
 * - Comments in this file should explain intent, data contracts, and edge cases rather than repeat the code.
 */
/*
 * =============================================================================
 * ファイル名 : js/core/config-manager.js
 * 概要       : 設定管理モジュール(ConfigManager)。
 *              ★ v2.x の dbType=Excel バグ(BUG-01)を完全修正する核 ★
 *
 *              【SSOT 設定優先順位】(高 → 低)
 *                (1) library-system-config.txt          ★ SSOT
 *                (2) library-system-config.js           file:// 用 fallback
 *                (3) window.LIBRARY_CONFIG_FALLBACK     ハードコード安全網
 *                (4) localStorage.lib-config-overrides  デバッグ専用
 *
 * 改訂履歴:
 *   v1.0     2026-04-15  Y.Toyoda  v2.x 初版
 *   v2.0     2026-04-25  Y.Toyoda  validateConfig 強化
 *   v3.0     2026-05-04  Y.Toyoda  ★ 全面書き換え(txt fetch 経路追加)★
 *   v3.0.6+  2026-05-12  Y.Toyoda  統合パッケージ用 backendMode キー対応
 *                                  (MAIN / TEST の解釈と getter 追加)
 *
 * @author  Y.Toyoda
 * @version v3.0.6+integration
 * =============================================================================
 */
"use strict";

const ConfigManager = (() => {

  /**
   * _cfg
   * 内部設定キャッシュ(直接参照禁止、必ず get() 経由)。
   */
  let _cfg = {
    backendMode: "MAIN",       // 統合パッケージ追加(MAIN | TEST)
    dbType: "Excel",
    maxReservations: 3,
    searchPageSize: 10,
    pickupDeadlineDays: 7,
    sessionTimeoutMinutes: 30,
    logLevel: "info"
  };

  /**
   * _resolutionPath
   * 設定の解決経路(デバッグ用)。init() 完了後に確定。
   */
  let _resolutionPath = {
    source: "DEFAULT",
    attempted: [],
    rejected: []
  };

  /** 設定許容値の定義 */
  const VALID = Object.freeze({
    backendMode:   ["MAIN", "TEST"],
    dbType:        ["Excel", "SQLite"],
    logLevel:      ["debug", "info", "warn", "error"],
    minPositiveInt: 1
  });

  function _safeJSON(s) {
    try { return s ? JSON.parse(s) : null; } catch { return null; }
  }

  function _stripBOM(text) {
    if (typeof text !== "string") return "";
    return text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text;
  }

  /**
   * _parseKVText
   * "key=value" 形式の Key-Value テキストをオブジェクトに変換する。
   */
  function _parseKVText(text) {
    const out = {};
    if (typeof text !== "string") return out;
    text.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("//")) return;
      const eq = trimmed.indexOf("=");
      if (eq <= 0) return;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      out[key] = val;
    });
    return out;
  }

  /**
   * _coerceTypes
   * Key-Value 文字列を本来の型(number / string)に変換する。
   * ★ 統合パッケージ: backendMode を大文字化して受け入れる ★
   */
  function _coerceTypes(kv) {
    const result = {};
    if (kv.backendMode           != null) result.backendMode           = String(kv.backendMode).toUpperCase();
    if (kv.dbType                != null) result.dbType                = String(kv.dbType);
    if (kv.maxReservations       != null) result.maxReservations       = Number(kv.maxReservations);
    if (kv.searchPageSize        != null) result.searchPageSize        = Number(kv.searchPageSize);
    if (kv.pickupDeadlineDays    != null) result.pickupDeadlineDays    = Number(kv.pickupDeadlineDays);
    if (kv.sessionTimeoutMinutes != null) result.sessionTimeoutMinutes = Number(kv.sessionTimeoutMinutes);
    if (kv.logLevel              != null) result.logLevel              = String(kv.logLevel);
    return result;
  }

  /**
   * _fetchTxtConfig
   * library-system-config.txt を非同期で取得し設定を返す。
   */
  async function _fetchTxtConfig() {
    try {
      const res = await fetch("library-system-config.txt", { cache: "no-store" });
      if (!res.ok) {
        _resolutionPath.rejected.push(`txt: HTTP ${res.status}`);
        return null;
      }
      const raw = _stripBOM(await res.text());
      const kv  = _parseKVText(raw);
      if (!kv.dbType) {
        _resolutionPath.rejected.push("txt: dbType key missing");
        return null;
      }
      _resolutionPath.attempted.push("txt: OK");
      return _coerceTypes(kv);
    } catch (e) {
      _resolutionPath.rejected.push(`txt: fetch error (${e.message || e})`);
      return null;
    }
  }

  /**
   * _readJsConfig
   * window.LIBRARY_CONFIG_FILE_JS から設定を読む。
   */
  function _readJsConfig() {
    const src = window.LIBRARY_CONFIG_FILE_JS;
    if (!src || typeof src !== "object" || !src.dbType) {
      _resolutionPath.rejected.push("js: not loaded or missing dbType");
      return null;
    }
    _resolutionPath.attempted.push("js: OK");
    return {
      backendMode:           String(src.backendMode || "MAIN").toUpperCase(),
      dbType:                String(src.dbType),
      maxReservations:       Number(src.maxReservations),
      searchPageSize:        Number(src.searchPageSize),
      pickupDeadlineDays:    Number(src.pickupDeadlineDays),
      sessionTimeoutMinutes: Number(src.sessionTimeoutMinutes),
      logLevel:              String(src.logLevel)
    };
  }

  /**
   * _readFallback
   * window.LIBRARY_CONFIG_FALLBACK(ハードコード安全網)を読む。
   */
  function _readFallback() {
    const fb = window.LIBRARY_CONFIG_FALLBACK || {};
    _resolutionPath.attempted.push("fallback: OK");
    return {
      backendMode:           String(fb.backendMode           || "MAIN").toUpperCase(),
      dbType:                String(fb.dbType                || "Excel"),
      maxReservations:       Number(fb.maxReservations       || 3),
      searchPageSize:        Number(fb.searchPageSize        || 10),
      pickupDeadlineDays:    Number(fb.pickupDeadlineDays    || 7),
      sessionTimeoutMinutes: Number(fb.sessionTimeoutMinutes || 30),
      logLevel:              String(fb.logLevel              || "info")
    };
  }

  /**
   * _purgeLegacyKeys
   * v2.x で使われていた旧 localStorage キー(lib-config)を検出・削除する。
   */
  function _purgeLegacyKeys() {
    try {
      const legacy = localStorage.getItem("lib-config");
      if (legacy !== null) {
        localStorage.removeItem("lib-config");
        console.warn(
          "[ConfigManager] 旧 localStorage.lib-config を検出したため削除しました。" +
          " v3.0 では library-system-config.txt が SSOT です。" +
          " 削除前の値:", legacy
        );
      }
    } catch (_e) { /* swallow */ }
  }

  function _readDebugOverrides() {
    try {
      const raw = localStorage.getItem("lib-config-overrides");
      const obj = _safeJSON(raw);
      if (!obj || typeof obj !== "object") return null;
      console.warn(
        "[ConfigManager] localStorage.lib-config-overrides が設定されています。" +
        " これはデバッグ専用です。本番では削除してください。", obj
      );
      _resolutionPath.attempted.push("debugOverrides: applied");
      return obj;
    } catch { return null; }
  }

  /**
   * init
   * 設定の解決を実行する(async)。
   */
  async function init() {
    _resolutionPath = { source: "DEFAULT", attempted: [], rejected: [] };
    _purgeLegacyKeys();

    let resolved = await _fetchTxtConfig();
    if (resolved) {
      _cfg = Object.assign({}, _cfg, resolved);
      _resolutionPath.source = "library-system-config.txt";
    } else {
      resolved = _readJsConfig();
      if (resolved) {
        _cfg = Object.assign({}, _cfg, resolved);
        _resolutionPath.source = "library-system-config.js";
      } else {
        _cfg = Object.assign({}, _cfg, _readFallback());
        _resolutionPath.source = "LIBRARY_CONFIG_FALLBACK";
      }
    }

    const dbg = _readDebugOverrides();
    if (dbg) {
      const dbgTyped = _coerceTypes(dbg);
      _cfg = Object.assign({}, _cfg, dbgTyped);
    }

    _checkSsotConsistency();

    console.info(
      "[ConfigManager] 設定の解決完了。 source=" + _resolutionPath.source +
      " backendMode=" + _cfg.backendMode + " dbType=" + _cfg.dbType,
      _resolutionPath
    );

    return Object.assign({}, _cfg);
  }

  function _checkSsotConsistency() {
    if (_resolutionPath.source !== "library-system-config.txt") return;
    const js = window.LIBRARY_CONFIG_FILE_JS;
    if (!js || typeof js !== "object") return;
    const diffs = [];
    if (String(js.backendMode || "MAIN").toUpperCase() !== _cfg.backendMode) {
      diffs.push(`backendMode: txt="${_cfg.backendMode}" vs js="${js.backendMode}"`);
    }
    if (String(js.dbType) !== _cfg.dbType) {
      diffs.push(`dbType: txt="${_cfg.dbType}" vs js="${js.dbType}"`);
    }
    if (Number(js.maxReservations) !== _cfg.maxReservations) {
      diffs.push(`maxReservations: txt=${_cfg.maxReservations} vs js=${js.maxReservations}`);
    }
    if (diffs.length > 0) {
      console.warn(
        "[ConfigManager] library-system-config.txt と .js の内容に差異があります。" +
        " SSOT は txt なので、.js を txt に合わせてください。", diffs
      );
    }
  }

  /**
   * validateConfig
   * 不正値を安全な既定値に補正する。
   */
  function validateConfig() {
    if (!VALID.backendMode.includes(_cfg.backendMode)) {
      console.warn("[ConfigManager] backendMode 不正のため MAIN に補正:", _cfg.backendMode);
      _cfg.backendMode = "MAIN";
    }
    if (!VALID.dbType.includes(_cfg.dbType)) {
      console.warn("[ConfigManager] dbType 不正のため Excel に補正:", _cfg.dbType);
      _cfg.dbType = "Excel";
    }
    if (!Number.isFinite(_cfg.maxReservations) || _cfg.maxReservations < VALID.minPositiveInt) {
      console.warn("[ConfigManager] maxReservations 不正のため 3 に補正:", _cfg.maxReservations);
      _cfg.maxReservations = 3;
    }
    if (!Number.isFinite(_cfg.searchPageSize) || _cfg.searchPageSize < VALID.minPositiveInt) {
      console.warn("[ConfigManager] searchPageSize 不正のため 10 に補正:", _cfg.searchPageSize);
      _cfg.searchPageSize = 10;
    }
    if (!Number.isFinite(_cfg.pickupDeadlineDays) || _cfg.pickupDeadlineDays < VALID.minPositiveInt) {
      console.warn("[ConfigManager] pickupDeadlineDays 不正のため 7 に補正:", _cfg.pickupDeadlineDays);
      _cfg.pickupDeadlineDays = 7;
    }
    if (!Number.isFinite(_cfg.sessionTimeoutMinutes) || _cfg.sessionTimeoutMinutes < VALID.minPositiveInt) {
      console.warn("[ConfigManager] sessionTimeoutMinutes 不正のため 30 に補正:", _cfg.sessionTimeoutMinutes);
      _cfg.sessionTimeoutMinutes = 30;
    }
    if (!VALID.logLevel.includes(_cfg.logLevel)) {
      console.warn("[ConfigManager] logLevel 不正のため info に補正:", _cfg.logLevel);
      _cfg.logLevel = "info";
    }
    return true;
  }

  function get(key) {
    return _cfg[key];
  }

  function getAll() {
    return Object.assign({}, _cfg);
  }

  function setDbType(dbType) {
    if (!VALID.dbType.includes(dbType)) {
      console.warn("[ConfigManager] setDbType: 不正値を拒否:", dbType);
      return false;
    }
    _cfg.dbType = dbType;
    console.info(
      "[ConfigManager] dbType を一時切替:", dbType,
      " ※次回起動時は txt 設定に戻ります。"
    );
    return true;
  }

  /**
   * getBackendMode
   * 統合パッケージ追加。現在の backendMode を取得する(MAIN / TEST)。
   * ApiAdapter が API パス選択に使用する。
   *
   * @returns {("MAIN"|"TEST")}
   */
  function getBackendMode() {
    return _cfg.backendMode || "MAIN";
  }

  function getResolutionPath() {
    return JSON.parse(JSON.stringify(_resolutionPath));
  }

  return Object.freeze({
    init,
    validateConfig,
    get,
    getAll,
    setDbType,
    getBackendMode,        // 統合パッケージ追加
    getResolutionPath
  });
})();

window.ConfigManager = ConfigManager;
