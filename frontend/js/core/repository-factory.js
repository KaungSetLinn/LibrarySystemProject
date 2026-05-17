/*
 * =============================================================================
 * ファイル名 : js/core/repository-factory.js
 * 概要       : RepositoryFactory。ConfigManager.dbType に応じて
 *              IRepository 実装を返す。
 *
 *              v3.0.4 以降の優先順（dbType=SQLite 時）:
 *                1) SQLiteAdapter（sql.js / WASM、本実装）— ready=true なら採用
 *                2) ApiAdapter（server/ 経由、HTTP 委譲）— available=true なら採用
 *                3) SQLiteStubAdapter（互換維持。ExcelAdapter 委譲スタブ）
 *                4) ExcelAdapter（最終フォールバック）
 *
 *              dbType=Excel 時は ExcelAdapter を直接返す（変更なし）。
 *
 * 仕様書トレーサビリティ:
 *   - 内部仕様書 v4.0  CF03 createDataSource
 *   - DB仕様書   v4.0  §13 ハイブリッド構成
 *   - 改訂対象        S-1（SQLite 本実装化に伴うフォールバック整理）
 *
 * 改訂履歴:
 *   v1.0    2026-04-15  Y.Toyoda  v2.x 初版
 *   v3.0    2026-05-04  Y.Toyoda  Logger 連携、現在の dbType ログ出力
 *   v3.0.4  2026-05-05  Y.Toyoda  SQLiteAdapter / ApiAdapter フォールバック整理
 *
 * @author  Y.Toyoda
 * @version v3.0.4
 * =============================================================================
 */
"use strict";

const RepositoryFactory = (() => {

  /**
   * create
   * 概要 : 現在の ConfigManager.dbType に基づき、最適な IRepository 実装を返す。
   *        dbType=SQLite では sql.js → server → Stub → Excel の順で評価。
   *
   * @returns {Object} IRepository 実装
   * @spec    内部仕様 CF03
   */
  function create() {
    const dbType = (window.ConfigManager && ConfigManager.get("dbType")) || "Excel";

    if (dbType === "SQLite") {
      // (1) sql.js 本実装が初期化完了していれば最優先
      if (window.SQLiteAdapter && typeof SQLiteAdapter.isReady === "function" && SQLiteAdapter.isReady()) {
        return window.SQLiteAdapter;
      }
      // (2) server/ が疎通できていれば ApiAdapter
      if (window.ApiAdapter && typeof ApiAdapter.isAvailable === "function" && ApiAdapter.isAvailable()) {
        return window.ApiAdapter;
      }
      // (3) 旧 Stub（互換維持）
      if (window.SQLiteStubAdapter) {
        return window.SQLiteStubAdapter;
      }
      // (4) Excel 最終フォールバック
    }

    if (window.ExcelAdapter) return window.ExcelAdapter;

    if (window.Logger) {
      Logger.error("RepositoryFactory.create",
        "ExcelAdapter / SQLiteAdapter / ApiAdapter / SQLiteStubAdapter のいずれも利用できません。");
    }
    return null;
  }

  /**
   * getCurrentMode
   * 概要 : 現在使用中のアダプタ名を返す（運用診断用）。
   * @returns {string}
   */
  function getCurrentMode() {
    const r = create();
    if (!r) return "(none)";
    if (r === window.SQLiteAdapter)     return "SQLiteAdapter (sql.js / WASM)";
    if (r === window.ApiAdapter)        return "ApiAdapter (HTTP)";
    if (r === window.SQLiteStubAdapter) return "SQLiteStubAdapter (legacy)";
    return "ExcelAdapter (localStorage)";
  }

  return Object.freeze({ create, getCurrentMode });
})();

window.RepositoryFactory = RepositoryFactory;
