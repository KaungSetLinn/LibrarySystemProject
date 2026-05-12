/*
 * =============================================================================
 * ファイル名 : js/core/config-manager.js
 * 概要       : 設定管理モジュール（ConfigManager）。
 *              ★ v2.x の dbType=Excel バグ（BUG-01）を完全修正する核 ★
 *
 *              【SSOT 設定優先順位】（高 → 低）
 *                (1) library-system-config.txt          ★ SSOT（唯一の真実）
 *                (2) library-system-config.js           file:// 用 fallback
 *                (3) window.LIBRARY_CONFIG_FALLBACK     ハードコード安全網
 *                (4) localStorage.lib-config-overrides  デバッグ専用上書き（既定無効）
 *
 *              ★ v2.x との非互換変更 ★
 *                - 旧キー localStorage.lib-config を v3.0 で廃止。
 *                  起動時に検出したら警告のうえ削除する（過去テストの SQLite 残留対策）。
 *                - setDbType() を「永続化しない一時切替」に変更。
 *                  恒久的に変更する場合は txt を編集する旨ガイドする。
 *
 * 仕様書トレーサビリティ:
 *   - 要求仕様書 v3.0  RF-11 ブリッジ入出力 / §C 非機能要件
 *   - 内部仕様書 v3.0  CF01 loadConfig / CF02 validateConfig / CF03 createRepository
 *   - 外部仕様書 v3.0  §11 性能要件
 *   - DB仕様書   v3.0  §22 Excel/CSV ↔ SQLite 切替
 *   - テスト仕様 v3.0  TC-COM-01〜09
 *   - ADR-002 ハイブリッド構成 / ADR-005 設定 SSOT
 *   - BUG調査         BUG-01 (txt未読込) / BUG-02 (localStorage上書き)
 *   - 議事録          P1-01 / P1-02 / P4-03 / P4-12 / D-01
 *
 * 改訂履歴:
 *   v1.0  2026-04-15  Y.Toyoda  v2.x 初版（FALLBACK + localStorage の2段）
 *   v2.0  2026-04-25  Y.Toyoda  validateConfig 強化
 *   v3.0  2026-05-04  Y.Toyoda  ★ 全面書き換え ★
 *                                - txt fetch 経路追加（BUG-01 修正）
 *                                - .js fallback 経路追加（file:// 対応）
 *                                - localStorage 永続化廃止（BUG-02 修正）
 *                                - SSOT 整合性チェック実装
 *                                - 旧 lib-config キーを起動時自動削除
 *
 * @author  Y.Toyoda
 * @since   v1.0
 * @version v3.0
 * =============================================================================
 */
"use strict";

const ConfigManager = (() => {

  /**
   * _cfg
   * 内部設定キャッシュ（直接参照禁止、必ず get() 経由）。
   * init() 完了まで「安全な既定値」が入った状態を保証する。
   */
  let _cfg = {
    dbType: "Excel",
    maxReservations: 3,
    searchPageSize: 10,
    pickupDeadlineDays: 7,
    sessionTimeoutMinutes: 30,
    logLevel: "info"
  };

  /**
   * _resolutionPath
   * 設定の解決経路（デバッグ用）。init() 完了後に確定する。
   * 利用者がトラブル時にコンソールで確認できる。
   *
   * @type {{source: string, attempted: string[], rejected: string[]}}
   */
  let _resolutionPath = {
    source: "DEFAULT",        // 最終的にどの経路を採用したか
    attempted: [],            // 試行した経路のリスト
    rejected: []              // 拒否した経路と理由
  };

  /** 設定許容値の定義（バリデーション・補正で使用） */
  const VALID = Object.freeze({
    dbType:        ["Excel", "SQLite"],
    logLevel:      ["debug", "info", "warn", "error"],
    minPositiveInt: 1
  });

  /**
   * _safeJSON
   * 概要 : JSON.parse の例外を握り潰す安全パーサー。
   *        握り潰す理由: 設定値の取得は致命停止させない方が UX が良いため。
   *        破損データに当たっても画面表示は維持し、ログのみ警告する。
   *
   * @param {string|null} s 入力 JSON 文字列
   * @returns {*} パース結果（失敗時は null）
   */
  function _safeJSON(s) {
    try { return s ? JSON.parse(s) : null; } catch { return null; }
  }

  /**
   * _stripBOM
   * 概要 : fetch で取得した txt 先頭の BOM (U+FEFF) を除去する。
   *        BOM 付き UTF-8 で保存されたファイルでもキー名が壊れないように。
   *
   * @param {string} text 入力テキスト
   * @returns {string} BOM 除去済みテキスト
   * @spec    議事録 P1-14
   */
  function _stripBOM(text) {
    if (typeof text !== "string") return "";
    return text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text;
  }

  /**
   * _parseKVText
   * 概要 : "key=value" 形式の Key-Value テキストをオブジェクトに変換する。
   *        # と // で始まる行はコメントとして無視する。
   *        前後空白・引用符は自動除去する。
   *
   * @param {string} text 入力テキスト（library-system-config.txt の内容）
   * @returns {Object<string,string>} key=value のオブジェクト
   *
   * @example
   *   _parseKVText("dbType=Excel\nmaxReservations=3")
   *   // → { dbType: "Excel", maxReservations: "3" }
   *
   * @spec  内部仕様 CF01-2
   */
  function _parseKVText(text) {
    const out = {};
    if (typeof text !== "string") return out;
    text.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim();
      // 空行・コメント行は無視
      if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("//")) return;
      const eq = trimmed.indexOf("=");
      if (eq <= 0) return; // = が無い、または先頭にある行は不正として無視
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      out[key] = val;
    });
    return out;
  }

  /**
   * _coerceTypes
   * 概要 : Key-Value 文字列を本来の型（number / string）に変換する。
   *        BUG-04（searchPageSize の string→NaN 化）対策の核。
   *
   * @param {Object<string,string>} kv パース直後の文字列マップ
   * @returns {Object} 型付き設定オブジェクト
   * @spec    BUG-04 修正 / 議事録 P1-09
   */
  function _coerceTypes(kv) {
    const result = {};
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
   * 概要 : library-system-config.txt を非同期で取得し、設定オブジェクトを返す。
   *        ★ v3.0 BUG-01 修正の核 ★
   *        file:// プロトコルでは Chrome 等が CORS で fetch を拒否するため、
   *        失敗時は null を返して呼出元が次経路（.js）にフォールバックする。
   *
   * @returns {Promise<Object|null>} 設定オブジェクト、失敗時は null
   * @spec    内部仕様 CF01-1, BUG-01 修正経路, 議事録 P1-01 / D-01
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
      // 必須キー（dbType）が無ければ「壊れた txt」と判定
      if (!kv.dbType) {
        _resolutionPath.rejected.push("txt: dbType key missing");
        return null;
      }
      _resolutionPath.attempted.push("txt: OK");
      return _coerceTypes(kv);
    } catch (e) {
      // file:// での CORS 拒否、ネットワーク不可等。致命停止せず次経路へ。
      _resolutionPath.rejected.push(`txt: fetch error (${e.message || e})`);
      return null;
    }
  }

  /**
   * _readJsConfig
   * 概要 : window.LIBRARY_CONFIG_FILE_JS（library-system-config.js）から設定を読む。
   *        file:// 環境用の fallback 経路。
   *
   * @returns {Object|null} 設定オブジェクト、未読込なら null
   * @spec    内部仕様 CF01-2, 議事録 P4-03
   */
  function _readJsConfig() {
    const src = window.LIBRARY_CONFIG_FILE_JS;
    if (!src || typeof src !== "object" || !src.dbType) {
      _resolutionPath.rejected.push("js: not loaded or missing dbType");
      return null;
    }
    _resolutionPath.attempted.push("js: OK");
    return {
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
   * 概要 : window.LIBRARY_CONFIG_FALLBACK（ハードコード安全網）を読む。
   *
   * @returns {Object} ハードコード既定値
   * @spec    内部仕様 CF01-3
   */
  function _readFallback() {
    const fb = window.LIBRARY_CONFIG_FALLBACK || {};
    _resolutionPath.attempted.push("fallback: OK");
    return {
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
   * 概要 : v2.x で使われていた旧 localStorage キー（lib-config）を検出・削除する。
   *        ★ BUG-02 修正の核 ★
   *        過去テストで保存された SQLite 値が起動時に Excel 設定を上書きする
   *        症状を根絶する。削除発生時は警告ログを出して利用者に通知。
   *
   * @returns {void}
   * @spec    BUG-02 修正 / 議事録 P1-02
   */
  function _purgeLegacyKeys() {
    try {
      const legacy = localStorage.getItem("lib-config");
      if (legacy !== null) {
        localStorage.removeItem("lib-config");
        // Logger 未読込時でも console に出るよう、生 console.warn を使う。
        console.warn(
          "[ConfigManager] 旧 localStorage.lib-config を検出したため削除しました。" +
          " v3.0 では library-system-config.txt が SSOT です。" +
          " 削除前の値:", legacy
        );
      }
    } catch (_e) {
      // localStorage アクセス不能環境（プライベートモード等）。致命停止しない。
    }
  }

  /**
   * _readDebugOverrides
   * 概要 : デバッグ用の任意上書き（localStorage.lib-config-overrides）を読む。
   *        既定では存在しない。明示的にコンソールから設定した場合のみ有効。
   *        運用上の無効化のため、非推奨警告を必ず出す。
   *
   * @returns {Object|null} 上書きオブジェクト、無ければ null
   * @spec    議事録 D-01（経路 (4)）
   */
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
   * 概要 : 設定の解決を実行する（async）。
   *        優先順位: txt → .js → fallback → デバッグ上書き。
   *
   *        ★ 必ず async で await する ★
   *        v2.x は同期関数だったため、txt fetch ができなかった。
   *        v3.0 では呼出元（app.js bootApp）が必ず await する設計。
   *
   * @returns {Promise<Object>} 解決済み設定オブジェクトのコピー
   * @throws  なし（全例外を握り潰し、安全な既定値を返す）
   *
   * @example
   *   await ConfigManager.init();
   *   ConfigManager.validateConfig();
   *   const dbType = ConfigManager.get("dbType");
   *
   * @spec  内部仕様 CF01, 外部仕様 §17, BUG-01 修正
   */
  async function init() {
    _resolutionPath = { source: "DEFAULT", attempted: [], rejected: [] };

    // 旧キーの掃除（毎回）
    _purgeLegacyKeys();

    // (1) txt 経路（最優先 = SSOT）
    let resolved = await _fetchTxtConfig();
    if (resolved) {
      _cfg = Object.assign({}, _cfg, resolved);
      _resolutionPath.source = "library-system-config.txt";
    } else {
      // (2) .js 経路（file:// fallback）
      resolved = _readJsConfig();
      if (resolved) {
        _cfg = Object.assign({}, _cfg, resolved);
        _resolutionPath.source = "library-system-config.js";
      } else {
        // (3) ハードコード fallback
        _cfg = Object.assign({}, _cfg, _readFallback());
        _resolutionPath.source = "LIBRARY_CONFIG_FALLBACK";
      }
    }

    // (4) デバッグ用上書き（既定無効）
    const dbg = _readDebugOverrides();
    if (dbg) {
      const dbgTyped = _coerceTypes(dbg);
      _cfg = Object.assign({}, _cfg, dbgTyped);
    }

    // (5) txt と .js の整合性チェック（両方存在する場合）
    _checkSsotConsistency();

    // (6) 解決経路をコンソールに必ず出力（運用者がトラブル時に確認できる）
    console.info(
      "[ConfigManager] 設定の解決完了。 source=" + _resolutionPath.source +
      " dbType=" + _cfg.dbType,
      _resolutionPath
    );

    return Object.assign({}, _cfg);
  }

  /**
   * _checkSsotConsistency
   * 概要 : txt と .js の両方が読めた場合、内容差異を検出して警告する。
   *        SSOT は txt なので、差異があれば .js を更新するよう促す。
   *
   * @returns {void}
   * @spec    議事録 D-01（SSOT 整合性チェック）
   */
  function _checkSsotConsistency() {
    if (_resolutionPath.source !== "library-system-config.txt") return;
    const js = window.LIBRARY_CONFIG_FILE_JS;
    if (!js || typeof js !== "object") return;
    const diffs = [];
    if (String(js.dbType) !== _cfg.dbType) {
      diffs.push(`dbType: txt="${_cfg.dbType}" vs js="${js.dbType}"`);
    }
    if (Number(js.maxReservations) !== _cfg.maxReservations) {
      diffs.push(`maxReservations: txt=${_cfg.maxReservations} vs js=${js.maxReservations}`);
    }
    // ※他キーも必要に応じて追加可能。差異があれば一括警告。
    if (diffs.length > 0) {
      console.warn(
        "[ConfigManager] library-system-config.txt と .js の内容に差異があります。" +
        " SSOT は txt なので、.js を txt に合わせてください。", diffs
      );
    }
  }

  /**
   * validateConfig
   * 概要 : 不正値を安全な既定値に補正する。
   *        補正発生時は console.warn で通知（黙って書き換えない）。
   *
   * @returns {boolean} 常に true（致命停止しないため）
   * @spec    内部仕様 CF02
   */
  function validateConfig() {
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

  /**
   * get
   * 概要 : 設定値を取得する。型保証して返す（BUG-04 対策）。
   *
   * @param {string} key 設定キー
   * @returns {*} 設定値（数値キーは Number、文字列キーは String）
   *
   * @example
   *   ConfigManager.get("dbType");           // "Excel"
   *   ConfigManager.get("maxReservations");  // 3 (number)
   *
   * @spec  BUG-04 修正 / 議事録 P1-09
   */
  function get(key) {
    return _cfg[key];
  }

  /**
   * getAll
   * 概要 : 全設定値のコピーを返す（外部からの直接書換防止）。
   *
   * @returns {Object} 設定値のシャローコピー
   */
  function getAll() {
    return Object.assign({}, _cfg);
  }

  /**
   * setDbType
   * 概要 : ★ v3.0 で挙動変更（BUG-02 修正）★
   *        実行時の dbType を一時的に切替える。
   *        v2.x と異なり localStorage には書込まない（永続化しない）。
   *        恒久変更したい場合は library-system-config.txt を編集する。
   *
   * @param {("Excel"|"SQLite")} dbType 切替先
   * @returns {boolean} 成功すれば true、不正値なら false
   *
   * @example
   *   ConfigManager.setDbType("SQLite"); // 一時切替（次回起動時は txt 設定に戻る）
   *
   * @spec  BUG-02 修正 / 議事録 P1-02 / TC-COM-02
   */
  function setDbType(dbType) {
    if (!VALID.dbType.includes(dbType)) {
      console.warn("[ConfigManager] setDbType: 不正値を拒否:", dbType);
      return false;
    }
    _cfg.dbType = dbType;
    console.info(
      "[ConfigManager] dbType を一時切替:", dbType,
      " ※次回起動時は txt 設定に戻ります。恒久変更は library-system-config.txt を編集してください。"
    );
    return true;
  }

  /**
   * getResolutionPath
   * 概要 : 設定の解決経路を返す（運用診断用）。
   *
   * @returns {{source: string, attempted: string[], rejected: string[]}}
   * @spec    議事録 D-01
   */
  function getResolutionPath() {
    return JSON.parse(JSON.stringify(_resolutionPath));
  }

  /* ===================================================================
   * 公開 API
   * =================================================================== */
  return Object.freeze({
    init,                 // async / 起動時に必ず最初に await する
    validateConfig,       // init 後に呼ぶ
    get,                  // 設定値取得
    getAll,               // 全設定取得
    setDbType,            // 一時切替（永続化しない）
    getResolutionPath     // 解決経路の確認（運用診断）
  });
})();

window.ConfigManager = ConfigManager;
