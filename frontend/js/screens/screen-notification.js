/*
 * READABLE-CODE REVIEW NOTE
 * 対象ファイル: frontend/js/screens/screen-notification.js
 * 責務: 画面コントローラ。DOMイベント、Service呼び出し、画面描画の境界を担当する。
 * 保守メモ: 画面固有の入力値は Service 層で正規化される前提なので、ここでは「どの値を渡すか」が重要。
 */
/*
 * =============================================================================
 * ファイル名 : js/screens/screen-notification.js
 * 概要       : G05 通知画面（SPA ビュー + コントローラ）。
 *              利用者の通知一覧を表示し、クリックで自動既読化する。
 *
 * 仕様書トレーサビリティ:
 *   - 外部仕様書 v3.0  G05 通知 / §4 画面遷移 / §4.9 通知UI仕様 / API-06
 *   - 要求仕様書 v3.0  RF-09 通知表示
 *   - 内部仕様書 v3.0  Service.markNotificationRead
 *   - テスト仕様 v3.0  TC-NOTIFY-001〜009
 *   - ADR-018 回帰テスト常設化（BUG-V2.0）
 *   - 議事録          P5-07 / BUG-V2.0 / BUG-14（既読化即時UI反映）
 *
 * 改訂履歴:
 *   v1.0  2026-04-15  Y.Toyoda  v2.x 初版（HTML）
 *   v3.0  2026-05-04  Y.Toyoda  SPA ビュー化 + 既読化即時UI反映 / Empty State
 *
 * @author  Y.Toyoda
 * @version v3.0
 * =============================================================================
 */
"use strict";

(function () {

  /**
   * view
   * 概要 : 通知画面の HTML を返す。
   * @returns {string}
   * @spec    G05
   */
  function view() {
    return `
      <div class="container">
        <div class="page-title">
          <h1>通知</h1>
          <span class="desc">予約完了・取消・受取期限などの通知を確認できます。</span>
        </div>

        <div data-message-host aria-live="polite"></div>

        <section class="card spacer-top">
          <div class="card-head">
            <h2>通知一覧</h2>
            <span class="muted" data-unread-count></span>
          </div>
          <div data-notif-host>
            <!-- 通知 or Empty State -->
          </div>
        </section>
      </div>
    `;
  }

  /**
   * init
   * 概要 : 認証ガード → 通知一覧取得 → 描画。
   * @returns {void}
   * @spec    G05 / RF-09
   */
  async function init() {
    if (!requireSession()) return;
    await _refresh();
  }

  /**
   * _refresh
   * 概要 : 通知一覧を取得し直して再描画する。
   * @returns {void}
   */
  async function _refresh() {
    const list = await Service.getNotifications();
    _renderList(list);
    _renderUnreadCount(list);
  }

  /**
   * _renderUnreadCount
   * 概要 : 未読件数を表示する。
   * @param {Array} list
   */
  function _renderUnreadCount(list) {
    const el = document.querySelector("[data-unread-count]");
    if (!el) return;
    const unread = list.filter(n => !n.isRead).length;
    el.textContent = unread > 0 ? `未読: ${unread} 件` : "未読なし";
  }

  /**
   * _renderList
   * 概要 : 通知一覧を描画する。空の場合は Empty State（議事録 P5-08）。
   * @param {Array} list
   * @returns {void}
   */
  function _renderList(list) {
    const host = document.querySelector("[data-notif-host]");
    if (!host) return;

    if (!list.length) {
      host.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon" aria-hidden="true">🔔</div>
          <p>通知はありません。</p>
        </div>`;
      return;
    }

    let html = `<ul class="notif-list">`;
    list.forEach(n => {
      const cls = n.isRead ? "notif-item is-read" : "notif-item is-unread";
      html += `
        <li class="${cls}" data-notif-id="${escapeHTML(n.notificationId)}" tabindex="0"
            role="button" aria-label="${n.isRead ? "既読" : "未読"}: ${escapeHTML(n.title)}">
          <div class="notif-head">
            <span class="notif-type">${escapeHTML(n.type || "")}</span>
            <strong>${escapeHTML(n.title || "")}</strong>
            <time class="muted">${escapeHTML(formatDateTime(n.createdAt))}</time>
          </div>
          <div class="notif-body">${escapeHTML(n.body || n.message || "")}</div>
        </li>`;
    });
    html += `</ul>`;
    host.innerHTML = html;

    // クリック自動既読化（議事録 P5-07 / BUG-V2.0 / BUG-14 反映）
    host.querySelectorAll("[data-notif-id]").forEach(li => {
      li.addEventListener("click", () => _onClick(li.dataset.notifId, li));
      // キーボード操作（Enter / Space）でも既読化
      li.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          _onClick(li.dataset.notifId, li);
        }
      });
    });
  }

  /**
   * _onClick
   * 概要 : 通知クリック時に既読化し、即時 UI に反映する。
   *        ★ BUG-V2.0 / BUG-14 / 議事録 P5-07 反映 ★
   *        DOMクラスを即座に更新し、未読件数バッジも再計算する。
   *
   * @param {string} notificationId
   * @param {HTMLElement} li 対象要素
   * @returns {void}
   * @spec    BUG-V2.0 / 議事録 P5-07
   */
  async function _onClick(notificationId, li) {
    if (li.classList.contains("is-read")) return;
    const ok = await Service.markNotificationRead(notificationId);
    if (!ok) {
      showMessage("error", "既読化に失敗しました。再度お試しください。");
      return;
    }
    // 即時 UI 反映
    li.classList.remove("is-unread");
    li.classList.add("is-read");
    li.setAttribute("aria-label",
      "既読: " + (li.querySelector("strong")?.textContent || ""));
    // 未読件数の再計算
    await _refresh();
    if (typeof window.updateNotificationBadge === "function") {
      window.updateNotificationBadge();
    }
  }
  Router.register("notification", {
    title: "通知",
    requireAuth: true,
    view, init
  });
})();
