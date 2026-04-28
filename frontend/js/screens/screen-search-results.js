/*
 * =============================================================================
 * ファイル名 : js/screens/screen-search-results.js
 * 概要       : G04 検索結果画面（予約登録の起点）のコントローラ。
 *              sessionStorage に保存された検索条件で Service.searchBooks を呼び、
 *              外部仕様§7.2 の正式形式で受け取った結果を描画する。
 *              actionState に応じて予約ボタンの活性／文言を制御する。
 *
 * 仕様書トレーサビリティ:
 *   - 外部仕様書 G04 検索結果 / §7.2 searchBooks / actionState 仕様 / API-04
 *   - 要求仕様書 RF-06 検索結果表示 / RF-07 予約登録
 *   - 内部仕様書 SR02/SR03/SR04 / RV03
 *   - テスト仕様 TC-SRH-01〜10 / TC-RES-01〜06
 *
 * 設計ポイント:
 *   - フロント制御は actionState 基準（status 文言変更で挙動が崩れない）。
 *   - ページング（Prev/Next + ページ番号 + 件数表示）。
 *   - 予約成功時は通知画面（G05）に遷移して結果を表示する。
 * 作成日 : 2026-04-26
 * =============================================================================
 */
"use strict";

(function () {
  window.Screen = window.Screen || {};

  // モジュール内のページング状態
  let _currentPage = 0;
  let _currentCriteria = {};

  /**
   * G04 - initSearchResults
   * 概要 : sessionStorage の検索条件で初回検索を実行し、描画する。
   */
  function initSearchResults() {
    if (!requireSession()) return;

    _currentCriteria = _safeJSON(sessionStorage.getItem("lib-search-criteria")) || {};
    _currentPage = 0;
    _renderCriteriaSummary(_currentCriteria);
    _runSearch();

    // 検索条件の編集導線
    document.querySelector("[data-edit-criteria]")?.addEventListener("click", e => {
      e.preventDefault();
      window.location.href = "advanced-search.html";
    });
  }

  /** _runSearch : 現在ページで検索を実行し描画 */
  function _runSearch() {
    clearMessage();
    const result = Service.searchBooks(_currentCriteria, _currentPage,
                                       ConfigManager.get("searchPageSize"));
    if (result.result === "error") {
      showMessage("warn", result.message + " 詳細検索画面で条件を入力してください。");
      _clearTable();
      _renderPager({ page: 0, totalPages: 1, count: 0, pageSize: result.pageSize });
      return;
    }
    _renderResults(result);
    _renderPager(result);
  }

  /** 検索条件サマリ */
  function _renderCriteriaSummary(c) {
    const host = document.querySelector("[data-criteria-summary]");
    if (!host) return;
    const parts = [];
    if (c.title)          parts.push(`書名：「${c.title}」`);
    if (c.author)         parts.push(`著者：「${c.author}」`);
    if (c.category)       parts.push(`分類：${c.category}`);
    if (c.availableOnly)  parts.push("貸出可能のみ");
    if (c.reservableOnly) parts.push("予約可能のみ");
    if (c.sort && c.sort !== "bookId") {
      const sortMap = { title: "書名昇順", author: "著者昇順", arrivalDateDesc: "入荷日降順" };
      parts.push("並び：" + (sortMap[c.sort] || c.sort));
    }
    host.innerHTML = parts.length
      ? parts.map(p => `<span class="badge badge-reserved">${escapeHTML(p)}</span>`).join(" ")
      : `<span class="muted">条件未指定</span>`;
  }

  /** 結果テーブル描画 */
  function _renderResults(result) {
    const tbody = document.querySelector("[data-search-tbody]");
    const empty = document.querySelector("[data-search-empty]");
    const meta  = document.querySelector("[data-result-meta]");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (meta) {
      meta.textContent = result.count > 0
        ? `${result.count}件中 ${result.page * result.pageSize + 1}〜${Math.min(result.count, (result.page + 1) * result.pageSize)}件目`
        : "0件";
    }

    if (!result.books.length) {
      if (empty) empty.style.display = "";
      return;
    }
    if (empty) empty.style.display = "none";

    result.books.forEach(b => {
      const tr = document.createElement("tr");
      const isDisabled = (b.actionState === "DISABLED" || b.actionState === "RESERVED");
      const btnClass   = b.actionState === "AVAILABLE" ? "btn-primary"
                       : b.actionState === "ON_LOAN"   ? "btn-warn" : "btn-light";

      tr.innerHTML = `
        <td>${escapeHTML(b.bookId)}</td>
        <td><strong>${escapeHTML(b.title)}</strong></td>
        <td>${escapeHTML(b.author)}</td>
        <td>${escapeHTML(b.category)}</td>
        <td>${renderActionStateBadge(b.actionState, b.status)}</td>
        <td>${b.dueDate ? escapeHTML(formatDate(b.dueDate)) : "—"}</td>
        <td>
          <button type="button" class="btn ${btnClass} btn-sm"
                  data-reserve-id="${escapeHTML(b.bookId)}"
                  data-action-state="${escapeHTML(b.actionState)}"
                  ${isDisabled ? "disabled aria-disabled='true'" : ""}>
            ${escapeHTML(b.actionLabel)}
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll("[data-reserve-id]").forEach(btn => {
      btn.addEventListener("click", () => _onReserve(btn));
    });

    decorateResponsiveTables();
  }

  /** 予約ボタン押下時 */
  function _onReserve(btn) {
    const bid = btn.dataset.reserveId;
    const state = btn.dataset.actionState;
    const isWaiting = (state === "ON_LOAN");
    const msg = isWaiting
      ? "この書籍は現在貸出中です。待機予約として登録します。よろしいですか？"
      : "この書籍を予約します。よろしいですか？";
    if (!confirm(msg)) return;

    btn.disabled = true; const orig = btn.textContent; btn.textContent = "予約中…";
    const result = Service.reserveBook(bid);
    if (result.success) {
      window.location.href = "notification.html";
    } else {
      showMessage("error", result.message);
      btn.disabled = false; btn.textContent = orig;
      // 競合系（E02/E11）は最新状態に再描画
      if (result.messageCode === "E02" || result.messageCode === "E11") {
        _runSearch();
      }
    }
  }

  /** ページャ描画 */
  function _renderPager(result) {
    const host = document.querySelector("[data-pager]");
    if (!host) return;
    host.innerHTML = "";
    if (result.totalPages <= 1) return;

    const prev = document.createElement("button");
    prev.type = "button";
    prev.className = "btn btn-light btn-sm";
    prev.textContent = "← 前へ";
    prev.disabled = (result.page <= 0);
    prev.addEventListener("click", () => { _currentPage = Math.max(0, _currentPage - 1); _runSearch(); });
    host.appendChild(prev);

    const cur = result.page;
    const total = result.totalPages;
    const start = Math.max(0, cur - 2);
    const end   = Math.min(total, start + 5);
    for (let i = start; i < end; i++) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = (i === cur) ? "btn btn-primary btn-sm" : "btn btn-light btn-sm";
      b.textContent = String(i + 1);
      b.addEventListener("click", () => { _currentPage = i; _runSearch(); });
      host.appendChild(b);
    }

    const next = document.createElement("button");
    next.type = "button";
    next.className = "btn btn-light btn-sm";
    next.textContent = "次へ →";
    next.disabled = (result.page >= result.totalPages - 1);
    next.addEventListener("click", () => { _currentPage = Math.min(result.totalPages - 1, _currentPage + 1); _runSearch(); });
    host.appendChild(next);
  }

  function _clearTable() {
    const tbody = document.querySelector("[data-search-tbody]");
    if (tbody) tbody.innerHTML = "";
    const meta = document.querySelector("[data-result-meta]");
    if (meta) meta.textContent = "0件";
    const empty = document.querySelector("[data-search-empty]");
    if (empty) empty.style.display = "";
  }

  function _safeJSON(s) { try { return s ? JSON.parse(s) : null; } catch { return null; } }

  Screen.initSearchResults = initSearchResults;
})();
