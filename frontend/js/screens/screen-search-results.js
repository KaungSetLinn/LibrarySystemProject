/*
 * Readable-code review note:
 * - Role: Renders normalized search results. The reservation button is enabled only when each row exposes a true canReserve value.
 * - Keep behavior unchanged unless a specification or bug-fix task explicitly requires it.
 * - Comments in this file should explain intent, data contracts, and edge cases rather than repeat the code.
 */
/*
 * =============================================================================
 * ファイル名 : js/screens/screen-search-results.js
 * 概要       : G04 検索結果画面（SPA ビュー + コントローラ）。
 *              sessionStorage に保存された検索条件で Service.searchBooks を呼び、
 *              外部仕様§7.2 の正式形式で受け取った結果を描画する。
 *              actionState に応じて予約ボタンの活性／文言を制御する。
 *
 * 仕様書トレーサビリティ:
 *   - 外部仕様書 v3.0  G04 検索結果 / §7.2 searchBooks / actionState 仕様 / API-04
 *   - 要求仕様書 v3.0  RF-06 検索結果表示 / RF-07 予約登録
 *   - 内部仕様書 v3.0  SR02/SR03/SR04 / RV03
 *   - テスト仕様 v3.0  TC-SRH-01〜10 / TC-RES-01〜06
 *   - 議事録          P5-06 / BUG-13（ページャ disabled 制御）
 *
 * 改訂履歴:
 *   v1.0  2026-04-15  Y.Toyoda  v2.x 初版（HTML）
 *   v3.0  2026-05-04  Y.Toyoda  SPA ビュー化 + ページャ disabled / Empty State
 *
 * @author  Y.Toyoda
 * @version v3.0
 * =============================================================================
 */
"use strict";

(function () {

  // モジュール内のページング状態
  let _currentPage = 0;
  let _currentCriteria = {};

  /**
   * view
   * 概要 : 検索結果画面の HTML 雛形を返す。
   * @returns {string}
   */
  function view() {
    return `
      <div class="container">
        <div class="page-title">
          <h1>検索結果</h1>
          <a href="#/advanced-search" class="btn btn-link" data-edit-criteria>← 検索条件を編集</a>
        </div>

        <div data-message-host aria-live="polite"></div>

        <section class="card spacer-top">
          <div class="criteria-summary muted" data-criteria-summary></div>
        </section>

        <section class="card spacer-top">
          <div data-result-host></div>
          <div class="pager spacer-top" data-pager></div>
        </section>
      </div>
    `;
  }

  /**
   * init
   * 概要 : 認証ガード → 検索条件読込 → 検索実行 → 描画。
   * @returns {void}
   * @spec    G04
   */
  function init() {
    if (!requireSession()) return;

    _currentCriteria = JSON.parse(sessionStorage.getItem("lib-search-criteria") || "{}");
    _currentPage = 0;
    _renderCriteriaSummary(_currentCriteria);
    _runSearch();
  }

  /**
   * _renderCriteriaSummary
   * 概要 : 検索条件のサマリ表示。
   * @param {Object} c
   */
  function _renderCriteriaSummary(c) {
    const el = document.querySelector("[data-criteria-summary]");
    if (!el) return;
    const parts = [];
    if (c.title)    parts.push(`書名:${c.title}`);
    if (c.author)   parts.push(`著者:${c.author}`);
    if (c.category) parts.push(`分類:${c.category}`);
    if (c.availableOnly)  parts.push("貸出可能のみ");
    if (c.reservableOnly) parts.push("予約可能のみ");
    el.textContent = parts.length ? `条件: ${parts.join(" / ")}` : "条件: （未設定）";
  }

  /**
   * _runSearch
   * 概要 : 現在ページで検索を実行し描画する。
   * @returns {void}
   * @spec    SR02 / SR03
   */
  function _runSearch() {
    clearMessage();
    const result = Service.searchBooks(
      _currentCriteria, _currentPage, ConfigManager.get("searchPageSize"));
    if (result.result === "error") {
      showMessage("warn", result.message + " 詳細検索画面で条件を入力してください。");
      _clearTable();
      _renderPager({ page: 0, totalPages: 1, count: 0, pageSize: result.pageSize });
      return;
    }
    _renderTable(result.books);
    _renderPager(result);
  }

  /**
   * _renderTable
   * 概要 : 検索結果テーブルを描画する。空の場合は Empty State。
   * @param {BookViewModel[]} books
   */
  function _renderTable(books) {
    const host = document.querySelector("[data-result-host]");
    if (!host) return;

    if (!books.length) {
      host.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon" aria-hidden="true">🔍</div>
          <p>該当する書籍が見つかりませんでした。</p>
          <a href="#/advanced-search" class="btn btn-secondary">条件を見直す</a>
        </div>`;
      return;
    }

    let html = `
      <table class="table">
        <thead>
          <tr>
            <th>書籍ID</th><th>書名・著者</th><th>分類</th><th>状態</th><th>操作</th>
          </tr>
        </thead><tbody>`;
    books.forEach(b => {
      html += `
        <tr>
          <td>${escapeHTML(b.bookId)}</td>
          <td>
            <strong>${escapeHTML(b.title)}</strong><br />
            <span class="muted">${escapeHTML(b.author || "")}</span>
            ${b.dueDate ? `<br /><small class="muted">返却予定: ${escapeHTML(formatDate(b.dueDate))}</small>` : ""}
          </td>
          <td>${escapeHTML(b.category || "")}</td>
          <td>${renderActionStateBadge(b.actionState, b.status)}</td>
          <td>
            <button class="btn btn-primary btn-sm"
                    data-reserve-id="${escapeHTML(b.bookId)}"
                    ${b.canReserve ? "" : "disabled"}>
              ${escapeHTML(b.actionLabel || "予約する")}
            </button>
          </td>
        </tr>`;
    });
    html += `</tbody></table>`;
    host.innerHTML = html;
    decorateResponsiveTables();

    // 予約ボタン
    host.querySelectorAll("[data-reserve-id]").forEach(btn => {
      btn.addEventListener("click", () => _onReserve(btn.dataset.reserveId));
    });
  }

  /**
   * _onReserve
   * 概要 : 予約ボタン押下処理（連打防止 + 確認ダイアログ）。
   * @param {string} bookId
   * @spec   RV03 / RF-07 / 議事録 P4-07
   */
  function _onReserve(bookId) {
    if (!confirm(`書籍 ${bookId} を予約してよろしいですか？`)) return;
    const r = Service.reserveBook(bookId);
    if (r.success) {
      showMessage("success", r.message);
      _runSearch(); // 状態を反映するため再描画
    } else {
      showMessage("error", r.message);
    }
  }

  /**
   * _clearTable : 空テーブル表示
   */
  function _clearTable() {
    const host = document.querySelector("[data-result-host]");
    if (host) host.innerHTML = "";
  }

  /**
   * _renderPager
   * 概要 : ページャを描画する（Prev/Next 端では disabled / BUG-13 反映）。
   * @param {{page:number,totalPages:number,count:number,pageSize:number}} r
   * @spec    BUG-13 / 議事録 P5-06
   */
  function _renderPager(r) {
    const host = document.querySelector("[data-pager]");
    if (!host) return;
    const prevDisabled = r.page <= 0 ? "disabled" : "";
    const nextDisabled = r.page >= (r.totalPages - 1) ? "disabled" : "";
    host.innerHTML = `
      <button class="btn btn-secondary btn-sm" data-page-prev ${prevDisabled}>← 前へ</button>
      <span class="pager-info">${r.page + 1} / ${r.totalPages} ページ（全 ${r.count} 件）</span>
      <button class="btn btn-secondary btn-sm" data-page-next ${nextDisabled}>次へ →</button>
    `;
    host.querySelector("[data-page-prev]")?.addEventListener("click", () => {
      if (_currentPage > 0) { _currentPage--; _runSearch(); }
    });
    host.querySelector("[data-page-next]")?.addEventListener("click", () => {
      _currentPage++; _runSearch();
    });
  }

  Router.register("search-results", {
    title: "検索結果",
    requireAuth: true,
    view, init
  });
})();
