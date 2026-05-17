/*
 * READABLE-CODE REVIEW NOTE
 * 対象ファイル: frontend/js/app.js
 * 責務: SPA 起動エントリ。設定解決、DataSource 自己診断、Router 起動を順番に行う。
 * 保守メモ: ConfigManager.init() 後に動く処理だけをここへ置き、画面固有処理は screen-* に分離する。
 */
/*
 * =============================================================================
 * ファイル名 : js/app.js
 * 概要       : 図書予約システム v3.0 SPA 起動エントリ。
 *              ConfigManager.init() を必ず await し、txt 設定の解決完了後に
 *              Router.start() で画面描画を開始する。
 *
 *              ★ v3.0 で v2.x の致命バグ（BUG-01: txt 未読込）を完全修正 ★
 *
 * 仕様書トレーサビリティ:
 *   - 内部仕様書 v3.0  §3 モジュール構成 / CF01 loadConfig / CF02 validateConfig
 *   - 外部仕様書 v3.0  §3 画面一覧（G01〜G06） / §10 UI共通仕様
 *   - 要求仕様書 v3.0  RF-02 / RF-14
 *   - テスト仕様 v3.0  TC-COM-01〜09
 *   - ADR-005 設定 SSOT
 *   - 議事録          P1-01 / P4-01 / D-01 / D-02
 *
 * 読込み順（index.html の <script> タグで指定）:
 *    1. js/library-config.js               LIBRARY_CONFIG_FALLBACK
 *    2. library-system-config.js           LIBRARY_CONFIG_FILE_JS（fallback経路）
 *    3. js/library-seed.js                 LIBRARY_SEED_DATA
 *    4. js/core/logger.js                  Logger
 *    5. js/core/messages.js                MESSAGES マスタ
 *    6. js/core/config-manager.js          ConfigManager（async init）
 *    7. js/datasource/data-source.js       DataSource 契約検証
 *    8. js/datasource/excel-adapter.js     ExcelAdapter
 *    9. js/datasource/sqlite-stub-adapter.js SQLiteStubAdapter
 *   10. js/core/repository-factory.js      RepositoryFactory
 *   11. js/core/service.js                 Service
 *   12. js/core/ui-common.js               UI共通
 *   13. js/core/router.js                  Router
 *   14. js/screens/screen-*.js             各画面（Router.register）
 *   15. js/app.js                          本ファイル（最後）
 *
 * 改訂履歴:
 *   v1.0  2026-04-15  Y.Toyoda  v2.x 初版（マルチページ）
 *   v3.0  2026-05-04  Y.Toyoda  SPA 化 + async ConfigManager.init() 必須化
 *
 * @author  Y.Toyoda
 * @version v3.0
 * =============================================================================
 */
"use strict";


async function initializeConfiguredDataSources() {
  const dbType = (window.ConfigManager && ConfigManager.get("dbType")) || "Excel";
  if (dbType !== "SQLite") return;

  // 統合起動（node start.js）では HTTP API を優先する。
  // サーバが無い file:// / 静的配信環境では sql.js または Excel へフォールバックする。
  if (window.ApiAdapter && typeof ApiAdapter.ping === "function") {
    await ApiAdapter.ping();
  }
  if ((!window.ApiAdapter || !ApiAdapter.isAvailable()) &&
      window.SQLiteAdapter && typeof SQLiteAdapter.init === "function") {
    await SQLiteAdapter.init();
  }
}


/**
 * bootApp
 * 概要 : 全画面共通の初期化と SPA 起動を行う。
 *        ★ async 必須 ★ ConfigManager.init() を await することで、
 *        txt fetch 完了後にアプリが起動する（dbType バグの根本対策）。
 *
 * @returns {Promise<void>}
 * @throws  なし（最上位例外ハンドラで安全停止）
 *
 * @spec  内部仕様 §3, BUG-01 修正
 */
async function bootApp() {
  try {
    // ----------------------------------------------------------------
    // (1) 設定読込（CF01 / CF02）— ★ async ★
    //     ConfigManager.init() が library-system-config.txt を fetch する。
    // ----------------------------------------------------------------
    if (window.ConfigManager) {
      await ConfigManager.init();
      ConfigManager.validateConfig();
      Logger.info("bootApp", "設定読込完了", ConfigManager.getAll());
    }

    // ----------------------------------------------------------------
    // (2) SQLite / API DataSource 初期化
    //     ConfigManager.init() 完了後に起動することで、txt 設定読込前に
    //     Adapter が dbType=Excel と誤判定して停止する競合を避ける。
    // ----------------------------------------------------------------
    if (window.ConfigManager && ConfigManager.get("dbType") === "SQLite") {
      let sqliteReady = false;
      if (window.SQLiteAdapter && typeof SQLiteAdapter.init === "function") {
        sqliteReady = await SQLiteAdapter.init();
      }
      if (!sqliteReady && window.ApiAdapter && typeof ApiAdapter.ping === "function") {
        await ApiAdapter.ping();
      }
    }

    // ----------------------------------------------------------------
    // (3) DataSource 契約セルフチェック（議事録 P3-08）
    // ----------------------------------------------------------------
    if (window.DataSource) DataSource.runSelfCheck();

    // ----------------------------------------------------------------
    // (4) ブラウザ警告 / モバイルナビ
    // ----------------------------------------------------------------
    if (typeof checkBrowserWarning === "function") checkBrowserWarning();
    if (typeof buildMobileBottomNav === "function") buildMobileBottomNav();

    // ----------------------------------------------------------------
    // (5) SPA Router 起動
    // ----------------------------------------------------------------
    if (window.Router) {
      await Router.start();
      Logger.info("bootApp", "SPA 起動完了");
    }

    // ----------------------------------------------------------------
    // (6) 全画面共通：トップレベル例外ハンドラ（議事録 P4-04）
    // ----------------------------------------------------------------
    window.addEventListener("error", e => {
      Logger.error("window.onerror", e.message, { filename: e.filename, lineno: e.lineno });
    });
    window.addEventListener("unhandledrejection", e => {
      Logger.error("window.onunhandledrejection",
        String(e.reason && e.reason.message || e.reason));
    });

  } catch (e) {
    // 起動時例外でも画面表示は壊さず、コンソールにのみ記録する。
    if (window.Logger) Logger.error("bootApp", e.message, { stack: e.stack });
    else console.error("[bootApp]", e);
  }
}

// ----------------------------------------------------------------------------
// DOM 準備完了を待ってから起動する。
// 既に DOM が読み込み済みの場合（defer / 動的挿入）も即時起動できるよう分岐。
// ----------------------------------------------------------------------------
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootApp);
} else {
  bootApp();
}
