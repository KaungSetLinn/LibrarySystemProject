/*
 * Readable-code review note:
 * - Role: Displays active reservations and cancellation actions. Keep reservation state labels consistent with repository responses.
 * - Keep behavior unchanged unless a specification or bug-fix task explicitly requires it.
 * - Comments in this file should explain intent, data contracts, and edge cases rather than repeat the code.
 */
/*
 * =============================================================================
 * ファイル名 : js/screens/screen-reservation-status.js
 * 概要       : G02 予約状況画面（SPA ビュー + コントローラ）。
 *              ログイン直後に表示され、現在予約・残枠・最早締切を一覧表示する。
 *
 * 仕様書トレーサビリティ:
 *   - 外部仕様書 v3.0  G02 予約状況 / §4 画面遷移 / API-02 dashboard
 *   - 要求仕様書 v3.0  RF-03 予約一覧
 *   - 内部仕様書 v3.0  RV01 getDashboard
 *   - テスト仕様 v3.0  TC-STA-01〜06
 *   - 議事録          P5-15（サマリ視認性向上）/ P5-08（Empty State）
 *
 * 改訂履歴:
 *   v1.0  2026-04-15  Y.Toyoda  v2.x 初版（HTML）
 *   v3.0  2026-05-04  Y.Toyoda  SPA ビュー化 + Empty State + サマリカード強化
 *
 * @author  Y.Toyoda
 * @version v3.0
 * =============================================================================
 */
"use strict";

(function () {

  /**
   * view
   * 概要 : 予約状況画面の HTML を返す。
   * @returns {string}
   * @spec    G02
   */
  function view() {
    return `
      <div class="container">
        <div class="page-title">
          <h1>予約状況</h1>
          <span class="desc">現在の予約・残枠・最早締切を確認できます。</span>
        </div>

        <div data-message-host aria-live="polite"></div>

        <!-- ===== サマリカード（議事録 P5-15 反映：視認性向上） ===== -->
        <section class="card summary-card spacer-top" aria-label="予約サマリ">
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-label">現在の予約</div>
              <div class="summary-value" data-sum-count>-</div>
              <div class="summary-unit">冊</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">残枠</div>
              <div class="summary-value" data-sum-remaining>-</div>
              <div class="summary-unit">冊</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">最早受取期限</div>
              <div class="summary-value summary-value-sm" data-sum-deadline>-</div>
            </div>
          </div>
        </section>

        <!-- ===== 予約一覧 ===== -->
        <section class="card spacer-top" aria-label="予約一覧">
          <div class="card-head">
            <h2>予約中の本</h2>
            <a href="#/advanced-search" class="btn btn-primary btn-sm">＋ 書籍を探して予約する</a>
          </div>

          <div data-list-host>
            <!-- リスト or Empty State をここに描画 -->
          </div>
        </section>
      </div>
    `;
  }

  /**
   * init
   * 概要 : ログインガード → サマリ取得 → 描画。
   * @returns {void}
   * @spec    G02 / RV01
   */
  function init() {
    if (!requireSession()) return;

    const data = Service.getDashboard(Service.getSession().userId);
    _renderSummary(data);
    _renderList(data);
  }

  /**
   * _renderSummary
   * 概要 : サマリカードを描画する。
   * @param {Object} data Service.getDashboard の戻り値
   * @returns {void}
   */
  function _renderSummary(data) {
    document.querySelector("[data-sum-count]").textContent = String(data.count);
    document.querySelector("[data-sum-remaining]").textContent = String(data.remaining);
    document.querySelector("[data-sum-deadline]").textContent =
      data.nextDeadline ? formatDate(data.nextDeadline) : "ー";
  }

  /**
   * _renderList
   * 概要 : 予約一覧を描画する。空の場合は Empty State（議事録 P5-08）。
   * @param {Object} data
   * @returns {void}
   */
  function _renderList(data) {
    const host = document.querySelector("[data-list-host]");
    if (!host) return;

    if (!data.reservations.length) {
      host.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon" aria-hidden="true">📚</div>
          <p>まだ予約がありません。</p>
          <a href="#/advanced-search" class="btn btn-primary">書籍を検索する</a>
        </div>`;
      return;
    }

    let html = `
      <table class="table">
        <thead>
          <tr>
            <th>予約ID</th><th>書籍</th><th>状態</th><th>予約日</th><th>受取期限</th><th>操作</th>
          </tr>
        </thead><tbody>`;
    data.reservations.forEach(r => {
      const book = _findBook(r.bookId);
      const title = book ? book.title : `(book ${r.bookId})`;
      const author = book ? book.author : "";
      html += `
        <tr>
          <td>${escapeHTML(r.reservationId)}</td>
          <td>
            <strong>${escapeHTML(title)}</strong><br />
            <span class="muted">${escapeHTML(author)}</span>
          </td>
          <td>${escapeHTML(r.status)}</td>
          <td>${escapeHTML(formatDate(r.reservedAt))}</td>
          <td>${escapeHTML(formatDate(r.pickupDeadline))}</td>
          <td>
            <button class="btn btn-danger btn-sm" data-cancel-id="${escapeHTML(r.reservationId)}">
              キャンセル
            </button>
          </td>
        </tr>`;
    });
    html += `</tbody></table>`;
    host.innerHTML = html;
    decorateResponsiveTables();

    // キャンセルボタン
    host.querySelectorAll("[data-cancel-id]").forEach(btn => {
      btn.addEventListener("click", () => _onCancel(btn.dataset.cancelId));
    });
  }

  /**
   * _onCancel
   * 概要 : 予約キャンセル処理（二段階確認は単一 confirm で代用、
   *        破壊度が比較的低いため。マイページ初期化のみ二段階）。
   * @param {string} reservationId
   * @returns {void}
   * @spec    RV02 / RF-08
   */
  function _onCancel(reservationId) {
    if (!confirm(`予約 ${reservationId} をキャンセルしてよろしいですか？`)) return;
    const r = Service.cancelReservation(reservationId);
    if (r.success) {
      showMessage("success", r.message);
      // 再描画
      const data = Service.getDashboard(Service.getSession().userId);
      _renderSummary(data); _renderList(data);
    } else {
      showMessage("error", r.message);
    }
  }

  /**
   * _findBook : books から bookId で1件取得。
   *             v3.0.3 で Service 層経由に変更（B-9 対応）。
   *             直接 localStorage.getItem("lib-books") を参照しないようにし、
   *             将来 SQLite/API 化時もこの画面コードは変更不要にする。
   *
   * @param {string} bookId
   * @returns {Object|null}
   * @spec    RF-04 / SR02 / 改訂対象 B-9
   */
  function _findBook(bookId) {
    if (window.Service && typeof Service.getBookById === "function") {
      return Service.getBookById(bookId);
    }
    // フォールバック（Service 未読込時のみ）
    try {
      const list = JSON.parse(localStorage.getItem("lib-books") || "[]");
      return list.find(b => String(b.bookId) === String(bookId)) || null;
    } catch (_) {
      return null;
    }
  }

  Router.register("reservation-status", {
    title: "予約状況",
    requireAuth: true,
    view, init
  });
})();
