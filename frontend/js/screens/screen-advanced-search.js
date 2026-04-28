/*
 * =============================================================================
 * ファイル名 : js/screens/screen-advanced-search.js
 * 概要       : G03 詳細検索画面（詳細画面）のコントローラ。
 *
 * 仕様書トレーサビリティ:
 *   - 外部仕様書 G03 詳細検索 / §6 入力データ仕様 / API-03
 *   - 要求仕様書 RF-05 詳細検索
 *   - 内部仕様書 SR01 normalizeSearchCriteria
 *   - テスト仕様 TC-SRH-02 / TC-SRH-04（条件エラー）
 * 作成日 : 2026-04-26
 * =============================================================================
 */
"use strict";

(function () {
  window.Screen = window.Screen || {};

  /**
   * G03 - initAdvancedSearch
   * 概要 : 検索フォームの送信ハンドラと前回条件の復元を行う。
   */
  function initAdvancedSearch() {
    if (!requireSession()) return;

    const form = document.getElementById("advancedSearchForm");
    if (!form) return;

    // 前回条件の復元（操作回数の少なさ）
    const stored = _safeJSON(sessionStorage.getItem("lib-search-criteria"));
    if (stored) {
      _setVal("title",          stored.title);
      _setVal("author",         stored.author);
      _setVal("category",       stored.category);
      _setVal("sort",           stored.sort);
      _setChk("availableOnly",  stored.availableOnly);
      _setChk("reservableOnly", stored.reservableOnly);
    }

    // 分類セレクトを動的生成
    _populateCategorySelect();

    // クリアボタン
    const clearBtn = form.querySelector("[data-clear-form]");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        form.reset();
        clearMessage();
      });
    }

    // 送信
    form.addEventListener("submit", e => {
      e.preventDefault();
      clearMessage();
      const criteria = {
        title:          document.getElementById("title")?.value          || "",
        author:         document.getElementById("author")?.value         || "",
        category:       document.getElementById("category")?.value       || "",
        sort:           document.getElementById("sort")?.value           || "bookId",
        availableOnly:  document.getElementById("availableOnly")?.checked  || false,
        reservableOnly: document.getElementById("reservableOnly")?.checked || false
      };
      // 全空チェック（クライアント側でも E04）
      const allEmpty = !criteria.title.trim() && !criteria.author.trim() && !criteria.category.trim();
      if (allEmpty && !criteria.availableOnly && !criteria.reservableOnly) {
        showMessage("warn", "検索条件を 1 つ以上入力してください。(E04)");
        document.getElementById("title")?.focus();
        return;
      }
      sessionStorage.setItem("lib-search-criteria", JSON.stringify(criteria));
      window.location.href = "search-results.html";
    });

    // 初回フォーカス
    setTimeout(() => document.getElementById("title")?.focus(), 100);
  }

  /** _populateCategorySelect : シードから分類リストを構築 */
  function _populateCategorySelect() {
    const sel = document.getElementById("category");
    if (!sel) return;
    const seed = (window.LIBRARY_SEED_DATA && LIBRARY_SEED_DATA.books) || [];
    const set = new Set();
    seed.forEach(b => { if (b.category) set.add(b.category); });
    const current = new Set(Array.from(sel.options).map(o => o.value));
    Array.from(set).sort((a,b) => a.localeCompare(b, "ja")).forEach(cat => {
      if (!current.has(cat)) {
        const opt = document.createElement("option");
        opt.value = cat; opt.textContent = cat;
        sel.appendChild(opt);
      }
    });
  }

  function _setVal(id, v) { const el = document.getElementById(id); if (el && v != null) el.value = v; }
  function _setChk(id, v) { const el = document.getElementById(id); if (el) el.checked = !!v; }
  function _safeJSON(s) { try { return s ? JSON.parse(s) : null; } catch { return null; } }

  Screen.initAdvancedSearch = initAdvancedSearch;
})();
