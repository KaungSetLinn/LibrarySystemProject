/*
 * =============================================================================
 * ファイル名 : js/screens/screen-login.js
 * 概要       : G01 ログイン画面のコントローラ。
 *
 * 仕様書トレーサビリティ:
 *   - 外部仕様書 G01 ログイン画面 / §4 画面遷移 / API-01
 *   - 要求仕様書 RF-01 ログイン
 *   - 内部仕様書 AU01 authenticateUser
 *   - テスト仕様 TC-LOG-01〜06
 * 作成日 : 2026-04-26
 * =============================================================================
 */
"use strict";

(function () {
  window.Screen = window.Screen || {};

  /**
   * G01 - initLogin
   * 概要 : ログインフォーム送信ハンドラと UI 補助を組み立てる。
   * 事前条件 : login.html に #loginForm, #userId, #userName が存在する。
   * 事後条件 : 認証成功時のみ reservation-status.html へ遷移。
   * 例外 : E01 認証失敗 → メッセージ表示のみ（致命停止しない）
   */
  function initLogin() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    // 設定サマリ表示（DB種別・上限・表示件数）
    const sumEl = document.querySelector("[data-config-summary]");
    const refreshSummary = () => {
      if (sumEl) {
        sumEl.textContent =
          `DB: ${ConfigManager.get("dbType")} / ` +
          `予約上限: ${ConfigManager.get("maxReservations")}冊 / ` +
          `表示件数: ${ConfigManager.get("searchPageSize")}件`;
      }
    };
    refreshSummary();

    // クリアボタン
    const clearBtn = form.querySelector("[data-clear-login]");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        form.reset();
        clearMessage();
        document.getElementById("userId").focus();
      });
    }

    // DB種別切替（テスト用 TC-COM-02）
    const dbSelect = document.getElementById("dbTypeSelect");
    if (dbSelect) {
      dbSelect.value = ConfigManager.get("dbType");
      dbSelect.addEventListener("change", () => {
        ConfigManager.setDbType(dbSelect.value);
        refreshSummary();
        showMessage("info", `データソースを ${dbSelect.value} に切替えました。`);
      });
    }

    // 送信ハンドラ（AU01）
    form.addEventListener("submit", e => {
      e.preventDefault();
      clearMessage();
      const userId   = document.getElementById("userId")?.value   || "";
      const userName = document.getElementById("userName")?.value || "";

      // 連打抑止
      const btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = "認証中…"; }

      // UI を更新したいので 1tick 遅らせて実行
      setTimeout(() => {
        const result = Service.authenticate(userId, userName);
        if (result.success) {
          window.location.href = "reservation-status.html";
        } else {
          showMessage("error", result.message);
          if (btn) { btn.disabled = false; btn.textContent = "ログイン"; }
          document.getElementById("userId").focus();
        }
      }, 50);
    });

    // userIdでEnterするとuserNameへフォーカス移動（操作回数の少なさ）
    document.getElementById("userId")?.addEventListener("keydown", e => {
      if (e.key === "Enter") { e.preventDefault(); document.getElementById("userName")?.focus(); }
    });

    // 初回フォーカス
    setTimeout(() => document.getElementById("userId")?.focus(), 100);
  }

  Screen.initLogin = initLogin;
})();
