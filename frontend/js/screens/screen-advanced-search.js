/*
 * READABLE-CODE REVIEW NOTE
 * 対象ファイル: frontend/js/screens/screen-advanced-search.js
 * 責務: 画面コントローラ。DOMイベント、Service呼び出し、画面描画の境界を担当する。
 * 保守メモ: 画面固有の入力値は Service 層で正規化される前提なので、ここでは「どの値を渡すか」が重要。
 */
/*
 * =============================================================================
 * ファイル名 : js/screens/screen-advanced-search.js
 * 概要       : G03 詳細検索画面（SPA ビュー + コントローラ）。
 *              書名・著者・分類・ソート・絞込フラグで検索条件を組立て、
 *              sessionStorage に保存して G04 検索結果に遷移する。
 *
 * 仕様書トレーサビリティ:
 *   - 外部仕様書 v3.0  G03 詳細検索 / §6 入力データ仕様 / API-03
 *   - 要求仕様書 v3.0  RF-05 検索条件 / RF-06 検索結果
 *   - 内部仕様書 v3.0  SR01 normalizeSearchCriteria
 *   - テスト仕様 v3.0  TC-SRH-01〜10
 *   - 議事録          P4-13（入力バリデーション）/ BUG-21（sort 初期値）/ 規約 LL-09
 *
 * 改訂履歴:
 *   v1.0   2026-04-15  Y.Toyoda  v2.x 初版（HTML）
 *   v3.0   2026-05-04  Y.Toyoda  SPA ビュー化 + maxlength 設定
 *   v3.0.1 2026-05-04  Y.Toyoda  BUG-21 修正（form.reset() 後の sort 明示再代入）
 *                                規約 LL-09 適用 + a11y 通知
 *
 * @author  Y.Toyoda
 * @version v3.0.1
 * =============================================================================
 */
"use strict";

(function () {

  /**
   * view
   * 概要 : 詳細検索画面の HTML を返す。
   * @returns {string}
   * @spec    G03
   */
  function view() {
    return `
      <div class="container">
        <div class="page-title">
          <h1>詳細検索</h1>
          <span class="desc">書名・著者・分類で書籍を検索します。</span>
        </div>

        <div data-message-host aria-live="polite"></div>

        <section class="card spacer-top">
          <form id="searchForm" class="form" novalidate>
            <div class="form-row">
              <label for="title">書名（部分一致）</label>
              <input id="title" name="title" type="text" maxlength="100" />
            </div>
            <div class="form-row">
              <label for="author">著者（部分一致）</label>
              <input id="author" name="author" type="text" maxlength="50" />
            </div>
            <div class="form-row">
              <label for="category">分類</label>
              <!-- 分類値は books.category と完全一致させる。init() で DataSource から実値を取得して生成する。 -->
              <select id="category">
                <option value="">分類を読み込み中...</option>
              </select>
            </div>
            <div class="form-row">
              <label for="sort">並び順</label>
              <select id="sort">
                <option value="bookId">書籍ID 昇順</option>
                <option value="title">書名</option>
                <option value="author">著者</option>
                <option value="arrivalDateDesc">入荷日（新しい順）</option>
              </select>
            </div>
            <div class="form-row form-row-checks">
              <label><input type="checkbox" id="availableOnly" /> 貸出可能のみ表示</label>
              <label><input type="checkbox" id="reservableOnly" /> 予約可能のみ表示</label>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary">検索する</button>
              <button type="button" class="btn btn-secondary" data-clear-search>条件をクリア</button>
              <a href="#/reservation-status" class="btn btn-link">← 予約状況へ戻る</a>
            </div>
          </form>
        </section>
      </div>
    `;
  }

  /**
   * init
   * 概要 : フォーム送信ハンドラと条件クリアを組み立てる。
   * @returns {void}
   * @spec    G03 / SR01
   */
  async function init() {
    if (!requireSession()) return;

    const form = document.getElementById("searchForm");
    if (!form) return;

    // 既存条件の復元（戻る動線対応）。分類は選択肢生成後に value を戻す。
    const saved = JSON.parse(sessionStorage.getItem("lib-search-criteria") || "{}");
    await _populateCategoryOptions(saved.category || "");

    if (saved.title)          document.getElementById("title").value          = saved.title;
    if (saved.author)         document.getElementById("author").value         = saved.author;
    if (saved.sort)           document.getElementById("sort").value           = saved.sort;
    if (saved.availableOnly)  document.getElementById("availableOnly").checked  = true;
    if (saved.reservableOnly) document.getElementById("reservableOnly").checked = true;

    // ----------------------------------------------------------------
    // クリアボタン
    // ★ v3.0.1 修正（BUG-21）★ 規約 LL-09 適用
    // ----------------------------------------------------------------
    form.querySelector("[data-clear-search]").addEventListener("click", () => {
      form.reset();
      const sortSel = document.getElementById("sort");
      if (sortSel) sortSel.value = "bookId";
      const categorySel = document.getElementById("category");
      if (categorySel) categorySel.value = "";
      sessionStorage.removeItem("lib-search-criteria");
      clearMessage();
      if (typeof showMessage === "function") {
        showMessage("info", "検索条件をクリアしました。");
      }
    });

    form.addEventListener("submit", e => {
      e.preventDefault();
      const criteria = {
        title:          document.getElementById("title").value,
        author:         document.getElementById("author").value,
        category:       document.getElementById("category").value,
        sort:           document.getElementById("sort").value,
        availableOnly:  document.getElementById("availableOnly").checked,
        reservableOnly: document.getElementById("reservableOnly").checked
      };
      sessionStorage.setItem("lib-search-criteria", JSON.stringify(criteria));
      Router.navigate("search-results");
    });
  }

  async function _populateCategoryOptions(selectedValue) {
    const select = document.getElementById("category");
    if (!select) return;
    const categories = await Service.getCategories();
    const uniqueCategories = Array.from(new Set((categories || [])
      .map(c => String(c || "").trim())
      .filter(Boolean))).sort((a, b) => a.localeCompare(b, "ja"));

    const options = ['<option value="">（指定なし）</option>']
      .concat(uniqueCategories.map(c =>
        `<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`));
    select.innerHTML = options.join("");

    // 保存済み条件が分類マスタに残っている時だけ復元する。
    // 存在しない旧分類（文学・科学など）は空に戻し、0件検索を避ける。
    select.value = uniqueCategories.includes(String(selectedValue || ""))
      ? String(selectedValue)
      : "";
  }


  Router.register("advanced-search", {
    title: "詳細検索",
    requireAuth: true,
    view, init
  });
})();
