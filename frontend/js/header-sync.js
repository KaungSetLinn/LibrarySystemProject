/*
 * READABLE-CODE REVIEW NOTE
 * 対象ファイル: frontend/js/header-sync.js
 * 責務: プロジェクト固有コード。上位処理と下位処理の境界を意識して保守する。
 * 保守メモ: このコメントは処理内容ではなく、保守時に誤りやすい責務境界を明示する。
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
 *              v6.0   未読通知バッジの更新処理を追加。
 *
 * 仕様書トレーサビリティ:
 *   - 外部仕様書 v6.0  §5.5 G05 通知 / §4.2 メッセージ（I04）
 *
 * 改訂履歴:
 *   v3.0.3  2026-05-05  Y.Toyoda  index.html から分離、外部スクリプト化
 *   v3.0.4  2026-05-05  Y.Toyoda  ボトムナビ同期＆アクティブ強調
 *   v6.0    2026-05-19  Y.Toyoda  未読通知バッジを「通知」リンク右下に表示
 *
 * @author  Y.Toyoda
 * @version v6.0
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

    // + v6.0 : ヘッダが表示される画面でだけ、未読件数バッジを更新する。
    if (!hide) {
      _updateNotificationBadge();
    } else {
      // ログイン画面では確実に非表示へ戻す。
      var badge = document.querySelector("[data-notif-badge]");
      if (badge) {
        badge.hidden = true;
        badge.textContent = "0";
      }
    }
  }

  /**
   * + v6.0
   * _updateNotificationBadge
   * 概要 : ヘッダの「通知」リンクのやや右下に、未読件数バッジ（赤丸）を表示する。
   *        - 未読 0 件   → バッジ非表示
   *        - 未読 1 件以上 → バッジ表示し、数字を入れる
   *        - 未読 100 件以上 → "99+" 表記（崩れ防止）
   * 取得経路:
   *        1) Service.getNotifications(userId) があれば優先
   *        2) なければ Service.getDashboard(userId).summary.unreadNotifCount を参照
   *        どちらも未取得時はバッジを更新しない（直前状態を維持）。
   * @returns {void}
   */
  function _updateNotificationBadge() {
    var badge = document.querySelector("[data-notif-badge]");
    if (!badge) return;

    var session =
      (window.Service && typeof Service.getSession === "function" && Service.getSession()) || null;

    // セッション無し → 0 件扱いで隠す
    if (!session) {
      badge.hidden = true;
      badge.textContent = "0";
      return;
    }

    // 非同期取得（取れなくても画面は壊さない）
    _fetchUnreadCount(session.userId).then(function (n) {
      var count = (typeof n === "number" && isFinite(n) && n > 0) ? Math.floor(n) : 0;
      if (count <= 0) {
        badge.hidden = true;
        badge.textContent = "0";
      } else {
        badge.hidden = false;
        badge.textContent = count > 99 ? "99+" : String(count);
      }
    }).catch(function (e) {
      if (window.Logger) Logger.warn("header-sync.updateBadge", e && e.message);
    });
  }

  /**
   * + v6.0
   * _fetchUnreadCount
   * 概要 : 未読件数を取得する。Service の実装差異を吸収するため2段で試す。
   * @param  {string|number} userId
   * @returns {Promise<number>}
   */
  async function _fetchUnreadCount(userId) {
    try {
      if (window.Service && typeof Service.getNotifications === "function") {
        var list = await Service.getNotifications(userId);
        if (Array.isArray(list)) {
          return list.filter(function (n) { return n && n.isRead === false; }).length;
        }
      }
    } catch (_e) { /* fallthrough */ }

    try {
      if (window.Service && typeof Service.getDashboard === "function") {
        var d = await Service.getDashboard(userId);
        var v = (d && d.summary && d.summary.unreadNotifCount);
        if (v === undefined && d) v = d.unreadNotifCount;
        return Number(v) || 0;
      }
    } catch (_e) { /* fallthrough */ }

    return 0;
  }

  // 外部から再計算をトリガーできるよう公開（通知画面で既読化したとき等に使う）
  window.updateNotificationBadge = _updateNotificationBadge;

  window.addEventListener("hashchange", syncHeader);
  window.addEventListener("DOMContentLoaded", syncHeader);
})();
