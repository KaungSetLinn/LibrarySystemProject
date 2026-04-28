/*
 * =============================================================================
 * ファイル名 : js/screens/screen-notification.js
 * 概要       : G05 通知画面のコントローラ。
 *              直前操作の結果（予約成功・取消成功）と、運用通知一覧を表示し、
 *              既読化操作を提供する。
 *
 * 仕様書トレーサビリティ:
 *   - 外部仕様書 G05 通知 / §4 画面遷移 / API-06 mypage（通知一覧）
 *   - 要求仕様書 RF-09 通知表示
 *   - 内部仕様書 LG01 writeAuditLog / 通知関連
 *   - DB仕様書   §5.6 notifications
 *   - テスト仕様 TC-NOT-01〜04
 *
 * 設計ポイント:
 *   - 直前操作（lib-last-action）があれば最上部に大きく表示し、
 *     ない場合は通知一覧のみを表示する（迷わなさ）。
 *   - 通知バッジ（severity: SUCCESS/INFO/WARN/ERROR）を色分け。
 *   - 既読化はその場で反映（即時UI更新）。
 *   - 「すべて既読にする」一括操作を用意（操作回数の少なさ）。
 * 作成日 : 2026-04-26
 * =============================================================================
 */
"use strict";

(function () {
  window.Screen = window.Screen || {};

  /**
   * G05 - initNotification
   * 概要 : 直前操作の表示と通知一覧を描画する。
   * 事前条件 : 認証済み（未認証なら login.html へリダイレクト）
   */
  function initNotification() {
    if (!requireSession()) return;

    // 直前操作の結果を最上部に表示（予約成功 → 通知へ自動遷移してきたケース）
    _renderLastAction();
    // 通知一覧を描画
    _renderNotifications();

    // 「すべて既読にする」ボタン
    document.querySelector("[data-mark-all-read]")?.addEventListener("click", () => {
      const list = Service.getNotifications();
      const unread = list.filter(n => !n.isRead);
      if (unread.length === 0) {
        showMessage("info", "未読の通知はありません。");
        return;
      }
      if (!confirm(`未読 ${unread.length} 件をすべて既読にします。よろしいですか？`)) return;
      unread.forEach(n => Service.markNotificationRead(n.notificationId));
      showMessage("success", `${unread.length} 件を既読にしました。`);
      _renderNotifications();
    });

    // 「次に何をしますか」導線
    document.querySelector("[data-go-search]")?.addEventListener("click", e => {
      e.preventDefault();
      window.location.href = "advanced-search.html";
    });
    document.querySelector("[data-go-status]")?.addEventListener("click", e => {
      e.preventDefault();
      window.location.href = "reservation-status.html";
    });
  }

  /**
   * _renderLastAction
   * 概要 : sessionStorage の lib-last-action（reserve/cancel の直前結果）を
   *        画面上部にハイライト表示する。表示後はキーを残し、再訪時にも
   *        確認できるようにする（誤って消えないように）。
   */
  function _renderLastAction() {
    const host = document.querySelector("[data-last-action]");
    if (!host) return;

    const raw = sessionStorage.getItem("lib-last-action");
    if (!raw) {
      host.style.display = "none";
      return;
    }
    let act;
    try { act = JSON.parse(raw); } catch (_e) { host.style.display = "none"; return; }
    if (!act || !act.type) { host.style.display = "none"; return; }

    const isReserve = act.type === "reserve";
    const isWaiting = !!act.waiting;

    const title = isReserve
      ? (isWaiting ? "✅ 待機予約を受け付けました" : "✅ 予約が完了しました")
      : "🗑 予約を取消しました";
    const cls = isReserve ? "msg-success" : "msg-warn";
    const detail = isReserve
      ? (isWaiting
          ? `『${act.bookTitle || ""}』は現在貸出中のため、待機予約として登録しました。返却され次第、受取期限が確定します。`
          : `『${act.bookTitle || ""}』の予約を受け付けました。受取期限までにご来館ください。`)
      : `『${act.bookTitle || ""}』の予約を取消しました。同じ書籍を再度予約することもできます。`;

    host.style.display = "";
    host.innerHTML = `
      <div class="card" style="border-left: 6px solid var(${isReserve ? '--success' : '--warn'});">
        <div class="msg ${cls}" style="border:none; background:transparent; padding:0;">
          <span class="msg-icon" aria-hidden="true"></span>
          <div>
            <div style="font-size:18px; font-weight:700; margin-bottom:4px;">
              ${escapeHTML(title)}
            </div>
            <div style="color: var(--text); line-height:1.65;">
              ${escapeHTML(detail)}
            </div>
            <div class="muted" style="margin-top:8px; font-size:12px;">
              予約ID: <code>${escapeHTML(act.reservationId || "—")}</code>
              　　操作日時: ${escapeHTML(formatDateTime(act.actionAt))}
            </div>
          </div>
        </div>
        <div class="actions">
          <a href="reservation-status.html" class="btn btn-primary btn-sm" data-go-status>予約状況を確認する</a>
          <a href="advanced-search.html"    class="btn btn-light   btn-sm" data-go-search>続けて検索する</a>
        </div>
      </div>
    `;
  }

  /**
   * _renderNotifications
   * 概要 : 通知一覧を描画。未読は強調、既読は薄く表示する。
   */
  function _renderNotifications() {
    const host = document.querySelector("[data-notification-list]");
    const empty = document.querySelector("[data-notification-empty]");
    const meta = document.querySelector("[data-notification-meta]");
    if (!host) return;

    const list = Service.getNotifications();
    host.innerHTML = "";

    if (meta) {
      const unread = list.filter(n => !n.isRead).length;
      meta.textContent = list.length === 0
        ? "通知はありません"
        : `全 ${list.length} 件 / 未読 ${unread} 件`;
    }

    if (!list.length) {
      if (empty) empty.style.display = "";
      return;
    }
    if (empty) empty.style.display = "none";

    // 未読 → 既読の順で並ぶ前提（Service側でソート済）
    list.forEach(n => {
      const item = document.createElement("article");
      item.className = "notif-item" + (n.isRead ? " is-read" : "");
      item.innerHTML = `
        <div class="notif-head">
          ${_severityBadge(n.severity)}
          <h3 class="notif-title">${escapeHTML(n.title || "")}</h3>
          ${n.isRead ? '<span class="notif-flag">既読</span>' : '<span class="notif-flag is-unread">未読</span>'}
        </div>
        <div class="notif-body">${escapeHTML(n.body || "")}</div>
        <div class="notif-meta">
          <span>${escapeHTML(formatDateTime(n.createdAt))}</span>
          ${!n.isRead
            ? `<button type="button" class="btn btn-ghost btn-sm" data-read-id="${escapeHTML(n.notificationId)}">既読にする</button>`
            : ""}
        </div>
      `;
      host.appendChild(item);
    });

    // 個別既読化
    host.querySelectorAll("[data-read-id]").forEach(btn => {
      btn.addEventListener("click", () => {
        const nid = btn.dataset.readId;
        if (Service.markNotificationRead(nid)) {
          _renderNotifications();
        } else {
          showMessage("error", "既読にできませんでした。");
        }
      });
    });
  }

  /** _severityBadge : severity に応じたバッジ HTML を返す。 */
  function _severityBadge(sev) {
    const map = {
      SUCCESS: { cls: "badge-available", text: "完了" },
      INFO:    { cls: "badge-reserved",  text: "情報" },
      WARN:    { cls: "badge-onloan",    text: "注意" },
      ERROR:   { cls: "badge-disabled",  text: "エラー" }
    };
    const m = map[sev] || map.INFO;
    return `<span class="badge ${m.cls}">${m.text}</span>`;
  }

  Screen.initNotification = initNotification;
})();
