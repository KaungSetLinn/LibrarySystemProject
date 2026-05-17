/*
 * Readable-code review note:
 * - Role: Reviewed source file. Comments describe intent, boundaries, and risk areas rather than restating syntax.
 * - Keep behavior unchanged unless a specification or bug-fix task explicitly requires it.
 * - Comments in this file should explain intent, data contracts, and edge cases rather than repeat the code.
 */
/*
 * =============================================================================
 * ファイル名 : app/js/header-sync.js
 * 概要       : 共通ヘッダ・ボトムナビの表示/非表示同期スクリプト。
 *              hashchange / DOMContentLoaded で URLハッシュを判定し、
 *              ログイン前（index/login）はヘッダ＆ボトムナビを隠し、
 *              それ以外で表示する。
 *
 *              v3.0.3 で index.html からインライン分離（CSP対応 S-2）。
 *              v3.0.4 でボトムナビ（スマホ専用）の同期も追加。
 *
 * 仕様書トレーサビリティ:
 *   - 外部仕様書 v4.0  §10.1 ヘッダ・フッタ / §10.4 レスポンシブ対応
 *   - 改訂対象        S-2（CSP整合）/ スマホ表示乱れ
 *
 * 改訂履歴:
 *   v3.0.3  2026-05-05  Y.Toyoda  index.html から分離、外部スクリプト化
 *   v3.0.4  2026-05-05  Y.Toyoda  ボトムナビ同期＆アクティブ強調
 *
 * @author  Y.Toyoda
 * @version v3.0.4
 * =============================================================================
 */
"use strict";

(function () {
  /**
   * _currentScreen
   * 概要 : 現在のURLハッシュから画面ID（例: "login", "reservation-status"）を返す。
   * @returns {string}
   */
  function _currentScreen() {
    return (location.hash || "").replace(/^#\/?/, "").split("?")[0];
  }

  /**
   * syncHeader
   * 概要 : 現在のURLハッシュに応じて、共通ヘッダ＆ボトムナビの表示/非表示を切り替える。
   *        ログイン前画面（空 / index / login）では両方とも隠す。
   *        さらに、現在画面と一致する nav リンクに is-active を付与する。
   * @returns {void}
   */
  function syncHeader() {
    var screen = _currentScreen();
    var hide = !screen || screen === "index" || screen === "login";

    var header = document.querySelector("[data-app-header]");
    if (header) header.hidden = hide;

    var bottomNav = document.querySelector("[data-bottom-nav]");
    if (bottomNav) bottomNav.hidden = hide;

    // アクティブ強調（ヘッダ・ボトムナビ両方）
    var allLinks = document.querySelectorAll("[data-nav]");
    allLinks.forEach(function (a) {
      if (a.getAttribute("data-nav") === screen) {
        a.classList.add("is-active");
        a.setAttribute("aria-current", "page");
      } else {
        a.classList.remove("is-active");
        a.removeAttribute("aria-current");
      }
    });
  }

  window.addEventListener("hashchange", syncHeader);
  window.addEventListener("DOMContentLoaded", syncHeader);
})();
