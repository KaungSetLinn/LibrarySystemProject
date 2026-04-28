/*
 * =============================================================================
 * ファイル名 : js/app.js
 * 概要       : 図書予約システムの起動エントリスクリプト。
 *              DOMContentLoaded で共通初期化を行い、body[data-page] に応じて
 *              個別画面の Screen.* を呼び出す。
 *
 * 仕様書トレーサビリティ:
 *   - 内部仕様書 §3 モジュール構成 / CF01 loadConfig / CF02 validateConfig
 *   - 外部仕様書 §3 画面一覧（G01〜G06） / §10 UI共通仕様
 *   - 要求仕様書 RF-02 セッション管理 / RF-14 レスポンシブUI
 *   - テスト仕様 TC-COM-01〜05（設定読込）
 *
 * 読み込み順（各 HTML から script タグで指定する想定）:
 *   1. js/library-config.js           … LIBRARY_CONFIG_FALLBACK 定義
 *   2. js/library-seed.js             … LIBRARY_SEED_DATA 定義
 *   3. js/datasource/data-source.js   … IRepository 契約
 *   4. js/datasource/excel-adapter.js
 *   5. js/datasource/sqlite-stub-adapter.js
 *   6. js/core/config-manager.js
 *   7. js/core/repository-factory.js
 *   8. js/core/service.js
 *   9. js/core/ui-common.js
 *  10. js/screens/screen-*.js
 *  11. js/app.js                      … 本ファイル（最後）
 *
 * 依存関係:
 *   - 本ファイルは window.ConfigManager / window.Service / window.Screen* を参照する。
 *   - いずれかが未定義でも致命停止しないよう、すべて存在チェック付きで呼び出す。
 *
 * 例外処理方針:
 *   - 起動時の例外は console.error にのみ流し、画面表示は壊さない。
 *     （ログイン画面や案内のスプラッシュは最低限見える状態を保つ）
 * 作成日 : 2026-04-26
 * =============================================================================
 */
"use strict";

/**
 * bootApp
 * 概要 : 全画面共通の初期化と画面別処理ディスパッチを行う。
 * 入力 : なし（DOM 状態に依存）
 * 出力 : なし（副作用：DOM 更新、グローバル状態の初期化）
 * 事前条件 : DOMContentLoaded 後に呼ばれる
 * 事後条件 : 共通 UI が整い、当該画面の Screen.* が一度だけ呼ばれる
 * 例外処理 : 例外は console.error にのみ流し、画面表示は壊さない
 *
 * 関連仕様 : 内部仕様書 §3 モジュール構成 / 外部仕様書 §3 画面一覧
 */
function bootApp() {
  try {
    // ------------------------------------------------------------------
    // (1) 設定の読込と妥当性検証（CF01 / CF02）
    //     ConfigManager 未読込時はスキップ（部分配置でも壊れない）
    // ------------------------------------------------------------------
    if (window.ConfigManager) {
      ConfigManager.init();
      ConfigManager.validateConfig();
    }

    // ------------------------------------------------------------------
    // (2) 共通 UI 初期化（外部仕様 §10 UI 共通仕様）
    //     ui-common.js が window にぶら下げた関数を呼ぶ。
    //     未定義関数は個別にスキップ（部分読込時の二次障害を防ぐ）。
    // ------------------------------------------------------------------
    if (typeof setToday === "function")                 setToday();
    if (typeof fillBrowserFields === "function")        fillBrowserFields();
    if (typeof setActiveNav === "function")             setActiveNav();
    if (typeof decorateResponsiveTables === "function") decorateResponsiveTables();
    if (typeof buildMobileBottomNav === "function")     buildMobileBottomNav();
    if (typeof setupViewMode === "function")            setupViewMode();
    if (typeof checkBrowserWarning === "function")      checkBrowserWarning();
    if (typeof applySessionHeader === "function")       applySessionHeader();

    // ------------------------------------------------------------------
    // (3) 個別画面の初期化を data-page で振り分ける（外部仕様 §3）
    //     Screen.* が未定義の場合は呼ばない（順次実装が可能）。
    // ------------------------------------------------------------------
    const page   = (document.body && document.body.dataset && document.body.dataset.page || "").trim();
    const Screen = window.Screen || {};

    switch (page) {
      // G01 : ログイン画面
      case "login":
        if (typeof Screen.initLogin === "function") Screen.initLogin();
        break;

      // G02 : 予約状況画面（一覧）
      case "reservation-status":
        if (typeof Screen.initReservationStatus === "function") Screen.initReservationStatus();
        break;

      // G03 : 詳細検索画面
      case "advanced-search":
        if (typeof Screen.initAdvancedSearch === "function") Screen.initAdvancedSearch();
        break;

      // G04 : 検索結果（予約登録の起点）
      case "search-results":
        if (typeof Screen.initSearchResults === "function") Screen.initSearchResults();
        break;

      // G05 : 通知画面
      case "notification":
        if (typeof Screen.initNotification === "function") Screen.initNotification();
        break;

      // G06 : マイページ画面
      case "mypage":
        if (typeof Screen.initMyPage === "function") Screen.initMyPage();
        break;

      // index などの中継ページは何もしない（リダイレクトは index.html 内で行う）。
      default:
        break;
    }

    // ------------------------------------------------------------------
    // (4) E09 セッション切れによるリダイレクト時のメッセージ表示
    //     - login 画面に着地したときだけ通知する
    //     - showMessage は ui-common.js が提供する
    // ------------------------------------------------------------------
    if (page === "login") {
      const reason = sessionStorage.getItem("lib-redirect-reason");
      if (reason === "E09" && typeof showMessage === "function") {
        showMessage("warn", "セッションが切れました。再度ログインしてください。(E09)");
        sessionStorage.removeItem("lib-redirect-reason");
      }
    }

  } catch (e) {
    // 起動時例外でも画面表示は壊さず、コンソールにのみ記録する。
    if (typeof console !== "undefined") console.error("[bootApp]", e);
  }
}

// ----------------------------------------------------------------------------
// DOM 準備完了を待ってから起動する（XSS / Race 回避のため一本化）。
// 既に DOM が読み込み済みの場合（defer / 動的挿入）も即時起動できるよう分岐。
// ----------------------------------------------------------------------------
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootApp);
} else {
  bootApp();
}
