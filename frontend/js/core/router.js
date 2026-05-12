/*
 * =============================================================================
 * ファイル名 : js/core/router.js
 * 概要       : SPAルーター。hashベース（#/login など）で画面遷移を管理する。
 *              v2.x のマルチHTML を v3.0 で SPA 化した中核モジュール。
 *
 * 仕様書トレーサビリティ:
 *   - 外部仕様書 v3.0  §3 画面一覧 / §4 画面遷移
 *   - 要求仕様書 v3.0  RF-02 / RF-14
 *   - 内部仕様書 v3.0  §3 モジュール構成
 *   - 議事録          P5-01 / D-02（マルチページ→SPA移行）/ P1-10（重複バインド対策）
 *
 * 設計のポイント:
 *   - hash遷移（#/xxx）採用：file:// でも動作（History API は file:// で不安定）
 *   - 画面切替時に teardown() を呼んでリスナをクリーンアップ（議事録 P4-09）
 *   - 各画面の HTML テンプレートは views/* オブジェクトで保持
 *
 * 改訂履歴:
 *   v3.0  2026-05-04  Y.Toyoda  新規作成（議事録 D-02 反映）
 *
 * @author  Y.Toyoda
 * @version v3.0
 * =============================================================================
 */
"use strict";

const Router = (() => {

  /**
   * _routes
   * ルート定義テーブル。各エントリは { name, body[data-page], view, init, teardown? }。
   * @type {Object<string,Object>}
   */
  const _routes = {};

  /**
   * _currentTeardown
   * 直前の画面の teardown 関数（あれば次の遷移時に呼ぶ）。
   * @type {Function|null}
   */
  let _currentTeardown = null;

  /**
   * register
   * 概要 : ルートを登録する。app 起動時に画面別 JS から呼ばれる。
   *
   * @param {string} name ルート名（例 "login"）
   * @param {{title:string, view:Function, init:Function, teardown?:Function, requireAuth?:boolean}} def
   * @returns {void}
   * @spec    内部仕様 §3
   */
  function register(name, def) {
    _routes[name] = def;
  }

  /**
   * navigate
   * 概要 : 指定ルートに遷移する。
   *
   * @param {string} name ルート名
   * @param {Object} [params] sessionStorage 経由で渡したいパラメータ
   * @returns {void}
   */
  function navigate(name, params) {
    if (params && typeof params === "object") {
      sessionStorage.setItem("lib-route-params", JSON.stringify(params));
    }
    location.hash = "#/" + name;
  }

  /**
   * getRouteParams
   * 概要 : navigate で渡したパラメータを取得する（一度きり）。
   * @returns {Object}
   */
  function getRouteParams() {
    try {
      const raw = sessionStorage.getItem("lib-route-params");
      const obj = raw ? JSON.parse(raw) : {};
      sessionStorage.removeItem("lib-route-params");
      return obj || {};
    } catch { return {}; }
  }

  /**
   * _resolve
   * 概要 : 現在の location.hash からルート名を抽出する。
   * @returns {string} デフォルト "index"
   */
  function _resolve() {
    const h = (location.hash || "").replace(/^#\/?/, "").split("?")[0].trim();
    return h || "index";
  }

  /**
   * _render
   * 概要 : 現在のルートに対応する画面を描画する。
   *        teardown → view 描画 → init の順に実行。
   *
   * @returns {Promise<void>}
   * @spec    議事録 P4-09（teardown 必須）
   */
  async function _render() {
    const name = _resolve();
    const def = _routes[name];

    // 直前画面の teardown
    if (typeof _currentTeardown === "function") {
      try { _currentTeardown(); } catch (_e) { /* noop */ }
      _currentTeardown = null;
    }

    if (!def) {
      // 未登録ルートは login にフォールバック
      if (window.Logger) Logger.warn("Router._render", `未登録ルート: ${name}`);
      location.hash = "#/login";
      return;
    }

    // 認証ガード
    if (def.requireAuth && !Service.getSession()) {
      sessionStorage.setItem("lib-redirect-reason", "E09");
      location.hash = "#/login";
      return;
    }

    // body[data-page] とタイトル更新
    document.body.dataset.page = name;
    if (def.title) document.title = def.title + " - 図書予約システム";

    // 描画
    const main = document.getElementById("app-main");
    if (main) {
      main.innerHTML = "";
      const html = typeof def.view === "function" ? def.view() : String(def.view || "");
      main.insertAdjacentHTML("afterbegin", html);
    }

    // 共通 UI 初期化（毎遷移で再適用）
    if (typeof setActiveNav === "function") setActiveNav();
    if (typeof decorateResponsiveTables === "function") decorateResponsiveTables();
    if (typeof applySessionHeader === "function") applySessionHeader();
    if (typeof setToday === "function") setToday();
    if (typeof fillBrowserFields === "function") fillBrowserFields();
    if (typeof setupViewMode === "function") setupViewMode();

    // 画面別 init
    try {
      if (typeof def.init === "function") {
        const result = def.init();
        if (result instanceof Promise) await result;
      }
    } catch (e) {
      if (window.Logger) Logger.error("Router._render", `画面 init 例外: ${name}`, { err: e.message, stack: e.stack });
    }
    _currentTeardown = def.teardown || null;
  }

  /**
   * start
   * 概要 : ルーターを起動する（hashchange 監視 + 初回描画）。
   * @returns {Promise<void>}
   */
  async function start() {
    window.addEventListener("hashchange", _render);
    await _render();
  }

  return Object.freeze({ register, navigate, start, getRouteParams });
})();

window.Router = Router;
