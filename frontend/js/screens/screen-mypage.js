/*
 * =============================================================================
 * ファイル名 : js/screens/screen-mypage.js
 * 概要       : G06 マイページ画面（SPA ビュー + コントローラ）。
 *              現在予約・予約履歴・お気に入り・通知サマリ・JSONブリッジ
 *              （取込・出力・初期化）の操作を提供する。
 *
 * 仕様書トレーサビリティ:
 *   - 外部仕様書 v3.0  G06 マイページ / §4 画面遷移 / API-06〜09
 *   - 要求仕様書 v3.0  RF-10 マイページ / RF-11 ブリッジ入出力
 *   - 内部仕様書 v3.0  MP01 getMyPageData
 *   - DB仕様書   v3.0  §5.4 reservation_history / §5.7 favorites / §5.8 audit_log
 *   - テスト仕様 v3.0  TC-MYP-01〜08
 *   - 議事録          P5-04 / BUG-06（破壊的操作の二段階確認）/ P5-08（Empty State）
 *
 * 改訂履歴:
 *   v1.0  2026-04-15  Y.Toyoda  v2.x 初版（HTML）
 *   v3.0  2026-05-04  Y.Toyoda  SPA ビュー化 + 二段階確認 + Empty State
 *
 * @author  Y.Toyoda
 * @version v3.0
 * =============================================================================
 */
"use strict";

(function () {

  /**
   * view
   * 概要 : マイページ画面の HTML を返す（タブ切替方式）。
   * @returns {string}
   * @spec    G06
   */
  function view() {
    return `
      <div class="container">
        <div class="page-title">
          <h1>マイページ</h1>
          <span class="desc">予約・履歴・お気に入り・通知・データ管理を1つの画面に集約。</span>
        </div>

        <div data-message-host aria-live="polite"></div>

        <!-- ===== サマリ ===== -->
        <section class="card summary-card spacer-top" aria-label="マイページサマリ">
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-label">予約中</div>
              <div class="summary-value" data-mp-reservations>-</div>
              <div class="summary-unit">件</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">履歴</div>
              <div class="summary-value" data-mp-history>-</div>
              <div class="summary-unit">件</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">お気に入り</div>
              <div class="summary-value" data-mp-favorites>-</div>
              <div class="summary-unit">件</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">未読通知</div>
              <div class="summary-value" data-mp-unread>-</div>
              <div class="summary-unit">件</div>
            </div>
          </div>
        </section>

        <!-- ===== タブ ===== -->
        <section class="card spacer-top">
          <div class="tabs" role="tablist">
            <button data-tab="reservations" class="tab is-active" role="tab" aria-selected="true">予約中</button>
            <button data-tab="history"      class="tab"           role="tab" aria-selected="false">履歴</button>
            <button data-tab="favorites"    class="tab"           role="tab" aria-selected="false">お気に入り</button>
            <button data-tab="notifications" class="tab"          role="tab" aria-selected="false">通知</button>
            <button data-tab="bridge"       class="tab"           role="tab" aria-selected="false">データ管理</button>
          </div>

          <div data-tab-panel="reservations" class="tab-panel">
            <div data-mp-reservations-host></div>
          </div>
          <div data-tab-panel="history" class="tab-panel" hidden>
            <div data-mp-history-host></div>
          </div>
          <div data-tab-panel="favorites" class="tab-panel" hidden>
            <div data-mp-favorites-host></div>
          </div>
          <div data-tab-panel="notifications" class="tab-panel" hidden>
            <div data-mp-notif-host></div>
          </div>
          <div data-tab-panel="bridge" class="tab-panel" hidden>
            <div class="bridge-grid">
              <div class="bridge-card">
                <h3>データ出力（JSON）</h3>
                <p class="muted">現在のデータを JSON ファイルとしてダウンロードします。</p>
                <button class="btn btn-primary" data-bridge-export>JSON 出力</button>
              </div>
              <div class="bridge-card">
                <h3>データ取込（JSON）</h3>
                <p class="muted">JSON ファイルから一括で取込みます。</p>
                <input type="file" id="bridgeImportFile" accept="application/json" />
                <button class="btn btn-primary" data-bridge-import>JSON 取込</button>
              </div>
              <div class="bridge-card bridge-card-danger">
                <h3>初期データに戻す</h3>
                <p class="muted">★ 破壊的操作 ★ 二段階確認のうえ全データを seed に戻します。</p>
                <button class="btn btn-danger" data-bridge-reset>初期化する</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  /**
   * init
   * 概要 : 認証ガード → サマリ描画 → タブ初期化 → 各リスト描画 → ブリッジ操作。
   * @returns {void}
   * @spec    G06 / MP01
   */
  function init() {
    if (!requireSession()) return;

    _refresh();
    _setupTabs();
    _setupBridge();
  }

  /**
   * _refresh
   * 概要 : マイページデータを取得して全パネルを再描画する。
   * @returns {void}
   */
  function _refresh() {
    const data = Service.getMyPageData();
    _renderSummary(data.summary);
    _renderReservations(data.currentReservations);
    _renderHistory(data.history);
    _renderFavorites(data.favorites);
    _renderNotificationsPreview(data.notifications);
  }

  /* ========== サマリ ========== */

  /**
   * _renderSummary
   * @param {Object} s
   * @returns {void}
   */
  function _renderSummary(s) {
    _set("[data-mp-reservations]", s.reservationCount);
    _set("[data-mp-history]",      s.historyCount);
    _set("[data-mp-favorites]",    s.favoritesCount);
    _set("[data-mp-unread]",       s.unreadNotifCount);
  }
  function _set(sel, v) { const el = document.querySelector(sel); if (el) el.textContent = String(v); }

  /* ========== タブ切替 ========== */

  /**
   * _setupTabs
   * 概要 : タブ切替を組み立てる（aria-selected を毎回更新）。
   * @returns {void}
   * @spec    P5-14
   */
  function _setupTabs() {
    const tabs = document.querySelectorAll("[data-tab]");
    const panels = document.querySelectorAll("[data-tab-panel]");
    tabs.forEach(t => {
      t.addEventListener("click", () => {
        const target = t.dataset.tab;
        tabs.forEach(x => {
          const active = x === t;
          x.classList.toggle("is-active", active);
          x.setAttribute("aria-selected", String(active));
        });
        panels.forEach(p => {
          p.hidden = (p.dataset.tabPanel !== target);
        });
      });
    });
  }

  /* ========== 予約中（マイページ用詳細） ========== */

  /**
   * _renderReservations
   * @param {Array} list
   */
  function _renderReservations(list) {
    const host = document.querySelector("[data-mp-reservations-host]");
    if (!host) return;
    if (!list.length) {
      host.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon" aria-hidden="true">📚</div>
          <p>予約中の本はありません。</p>
          <a href="#/advanced-search" class="btn btn-primary">書籍を検索する</a>
        </div>`;
      return;
    }
    let html = `<table class="table"><thead><tr>
        <th>予約ID</th><th>書籍ID</th><th>状態</th><th>予約日</th><th>受取期限</th>
      </tr></thead><tbody>`;
    list.forEach(r => {
      html += `<tr>
        <td>${escapeHTML(r.reservationId)}</td>
        <td>${escapeHTML(r.bookId)}</td>
        <td>${escapeHTML(r.status)}</td>
        <td>${escapeHTML(formatDate(r.reservedAt))}</td>
        <td>${escapeHTML(formatDate(r.pickupDeadline))}</td>
      </tr>`;
    });
    html += `</tbody></table>`;
    host.innerHTML = html;
    decorateResponsiveTables();
  }

  /* ========== 履歴 ========== */

  /**
   * _renderHistory
   * @param {Array} list
   */
  function _renderHistory(list) {
    const host = document.querySelector("[data-mp-history-host]");
    if (!host) return;
    if (!list.length) {
      host.innerHTML = `<div class="empty-state"><div class="empty-icon" aria-hidden="true">📜</div>
        <p>予約履歴がありません。</p></div>`;
      return;
    }
    let html = `<table class="table"><thead><tr>
        <th>履歴ID</th><th>予約ID</th><th>イベント</th><th>発生日時</th>
      </tr></thead><tbody>`;
    list.forEach(h => {
      html += `<tr>
        <td>${escapeHTML(h.historyId)}</td>
        <td>${escapeHTML(h.reservationId)}</td>
        <td>${escapeHTML(h.eventType)}</td>
        <td>${escapeHTML(formatDateTime(h.eventAt))}</td>
      </tr>`;
    });
    html += `</tbody></table>`;
    host.innerHTML = html;
    decorateResponsiveTables();
  }

  /* ========== お気に入り ========== */

  /**
   * _renderFavorites
   * @param {Array} list
   */
  function _renderFavorites(list) {
    const host = document.querySelector("[data-mp-favorites-host]");
    if (!host) return;
    if (!list.length) {
      host.innerHTML = `<div class="empty-state"><div class="empty-icon" aria-hidden="true">⭐</div>
        <p>お気に入り登録した書籍はありません。</p></div>`;
      return;
    }
    let html = `<table class="table"><thead><tr>
        <th>お気に入りID</th><th>書籍ID</th><th>登録日</th><th>操作</th>
      </tr></thead><tbody>`;
    list.forEach(f => {
      html += `<tr>
        <td>${escapeHTML(f.favoriteId)}</td>
        <td>${escapeHTML(f.bookId)}</td>
        <td>${escapeHTML(formatDate(f.createdAt))}</td>
        <td><button class="btn btn-secondary btn-sm" data-fav-remove="${escapeHTML(f.bookId)}">削除</button></td>
      </tr>`;
    });
    html += `</tbody></table>`;
    host.innerHTML = html;
    decorateResponsiveTables();

    host.querySelectorAll("[data-fav-remove]").forEach(btn => {
      btn.addEventListener("click", () => {
        if (!confirm("お気に入りから削除してよろしいですか？")) return;
        const ok = Service.removeFavorite(btn.dataset.favRemove);
        if (ok) { showMessage("success", "お気に入りから削除しました。"); _refresh(); }
        else    { showMessage("error", "削除に失敗しました。"); }
      });
    });
  }

  /* ========== 通知プレビュー ========== */

  /**
   * _renderNotificationsPreview
   * @param {Array} list
   */
  function _renderNotificationsPreview(list) {
    const host = document.querySelector("[data-mp-notif-host]");
    if (!host) return;
    if (!list.length) {
      host.innerHTML = `<div class="empty-state"><div class="empty-icon" aria-hidden="true">🔔</div>
        <p>通知はありません。</p></div>`;
      return;
    }
    let html = `<ul class="notif-list">`;
    list.slice(0, 5).forEach(n => {
      const cls = n.isRead ? "notif-item is-read" : "notif-item is-unread";
      html += `<li class="${cls}">
        <div class="notif-head">
          <strong>${escapeHTML(n.title || "")}</strong>
          <time class="muted">${escapeHTML(formatDateTime(n.createdAt))}</time>
        </div>
        <div class="notif-body">${escapeHTML(n.body || "")}</div>
      </li>`;
    });
    html += `</ul>
      <p class="text-right"><a href="#/notification">通知一覧へ →</a></p>`;
    host.innerHTML = html;
  }

  /* ========== ブリッジ（JSON 出力 / 取込 / 初期化） ========== */

  /**
   * _setupBridge
   * 概要 : JSON 出力／取込／初期化のハンドラを組み立てる。
   *        初期化は二段階確認（議事録 P5-04 / BUG-06）。
   * @returns {void}
   * @spec    RF-11 / 議事録 P5-04
   */
  function _setupBridge() {
    document.querySelector("[data-bridge-export]")?.addEventListener("click", _onExport);
    document.querySelector("[data-bridge-import]")?.addEventListener("click", _onImport);
    document.querySelector("[data-bridge-reset]")?.addEventListener("click", _onReset);
  }

  /**
   * _onExport : JSON 出力
   * @spec  RF-11 / API-08
   */
  function _onExport() {
    const json = Service.bridgeExport();
    const blob = new Blob([json], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const ts = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
    a.href = url; a.download = `library-data-${ts}.json`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showMessage("success", "JSON ファイルを出力しました。");
  }

  /**
   * _onImport : JSON 取込
   * @spec  RF-11 / API-07
   */
  function _onImport() {
    const file = document.getElementById("bridgeImportFile")?.files?.[0];
    if (!file) { showMessage("warn", "JSON ファイルを選択してください。"); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const r = Service.bridgeImport(String(reader.result || ""));
      if (r.success) { showMessage("success", r.message); _refresh(); }
      else           { showMessage("error",   r.message); }
    };
    reader.onerror = () => showMessage("error", "ファイル読込に失敗しました。");
    reader.readAsText(file, "utf-8");
  }

  /**
   * _onReset : 初期データに戻す（★ 二段階確認 ★）
   * @spec  RF-11 / API-09 / BUG-06 / 議事録 P5-04
   */
  function _onReset() {
    // 第1段階：通常 confirm
    if (!confirm("★全データを初期 seed に戻します★ 取り消し不可です。続行しますか？")) return;
    // 第2段階：「INITIALIZE」入力（議事録 BUG-06 / P5-04 反映）
    const typed = prompt("最終確認のため、半角大文字で「INITIALIZE」と入力してください：");
    if (typed !== "INITIALIZE") {
      showMessage("info", "初期化をキャンセルしました。");
      return;
    }
    const r = Service.bridgeReset();
    if (r.success) { showMessage("success", r.message); _refresh(); }
    else           { showMessage("error",   r.message || "初期化に失敗しました。"); }
  }

  Router.register("mypage", {
    title: "マイページ",
    requireAuth: true,
    view, init
  });
})();
