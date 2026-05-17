/*
 * Readable-code review note:
 * - Role: Handles authentication flow and session setup. Keep validation and session writes separated from rendering concerns.
 * - Keep behavior unchanged unless a specification or bug-fix task explicitly requires it.
 * - Comments in this file should explain intent, data contracts, and edge cases rather than repeat the code.
 */
/*
 * =============================================================================
 * ファイル名 : js/screens/screen-login.js
 * 概要       : G01 ログイン画面（SPA ビュー + コントローラ）。
 *              v2.x の login.html の左右2カラムレイアウトを完全再現する。
 *
 * 仕様書トレーサビリティ:
 *   - 外部仕様書 v3.0  G01 ログイン画面 / §4 画面遷移 / API-01
 *   - 要求仕様書 v3.0  RF-01 ログイン
 *   - 内部仕様書 v3.0  AU01 authenticateUser
 *   - テスト仕様 v3.0  TC-LOG-01〜07 / TC-AUTH-001〜008
 *   - ADR-006 認証方式
 *   - 議事録          P5-02（送信中スピナー）/ BUG-08（連打防止）/
 *                    BUG-19/20/22/23（form.reset() で動的値消失）/ 規約 LL-09
 *
 * 改訂履歴:
 *   v1.0   2026-04-15  Y.Toyoda  v2.x 初版（HTML）
 *   v3.0   2026-05-04  Y.Toyoda  SPA ビュー化 / submitting フラグ / aria-* 完全対応
 *   v3.0.1 2026-05-04  Y.Toyoda  BUG-19/20/22/23 修正（form.reset() 後の動的再描画）
 *                                規約 LL-09（reset() ペア実行）適用
 *
 * @author  Y.Toyoda
 * @version v3.0.1
 * =============================================================================
 */
"use strict";

(function () {

  /**
   * view
   * 概要 : ログイン画面の HTML を返す。v2.x のデザインを完全保持。
   * @returns {string} HTML 文字列
   * @spec    G01 / 議事録 P5-12（左ペインモバイル折畳）
   */
  function view() {
    return `
      <main class="login-card">
        <div class="login-grid">
          <!-- ===== 左ペイン：システム説明 ===== -->
          <section class="login-side">
            <div class="login-side-inner">
              <span class="login-eyebrow">図書館サービス</span>
              <h1>図書館の蔵書を、<br />すばやく探して予約する。</h1>
              <p>本画面から予約状況確認、蔵書検索、予約登録、通知確認までを一連の流れで利用できます。</p>

              <div class="feature-grid">
                <div class="feature-point">
                  <strong>予約状況をすぐ確認</strong>
                  <span>現在の予約・残枠・受取期限をログイン直後に把握できます。</span>
                </div>
                <div class="feature-point">
                  <strong>検索から予約まで最短導線</strong>
                  <span>クイック検索／詳細検索の両方を用意し、迷わず操作できます。</span>
                </div>
                <div class="feature-point">
                  <strong>iPhone SE まで対応</strong>
                  <span>PC とスマートフォンで同じ操作が完了する設計です。</span>
                </div>
                <div class="feature-point">
                  <strong>Excel/SQLite 切替</strong>
                  <span>同一 API でデータソースを切替えてテストできます。</span>
                </div>
              </div>

              <div class="login-feature-note">
                <strong>ご利用案内</strong>
                <p>初期データを登録済みです。ログイン後は蔵書検索と予約処理がすぐ利用できます。
                   マイページから JSON データ取込・出力・初期化が行えます。</p>
              </div>
            </div>
          </section>

          <!-- ===== 右ペイン：ログインフォーム ===== -->
          <section>
            <div class="login-form-inner">
              <h2>ログイン</h2>
              <div class="muted">
                利用者 ID と利用者名を入力してください。<br />
                初期データでは「<strong>1 / 佐藤翔太</strong>」で確認できます。
              </div>

              <div data-message-host class="spacer-top" aria-live="polite"></div>

              <form id="loginForm" class="form spacer-top" novalidate>
                <div class="form-row">
                  <label for="userId">利用者ID</label>
                  <input id="userId" name="userId" type="text" autocomplete="username"
                         required aria-required="true" maxlength="20"
                         placeholder="例: 1" />
                  <small class="muted">仕様に合わせて半角数字を基本とします。</small>
                </div>

                <div class="form-row">
                  <label for="userName">利用者名</label>
                  <input id="userName" name="userName" type="text" autocomplete="name"
                         required aria-required="true" maxlength="50"
                         placeholder="例: 佐藤翔太" />
                </div>

                <div class="form-row">
                  <label for="dbTypeSelect">データソース（テスト用切替）</label>
                  <select id="dbTypeSelect" aria-describedby="dbTypeHelp">
                    <option value="Excel">Excel（localStorage 経由）</option>
                    <option value="SQLite">SQLite（スタブ）</option>
                  </select>
                  <small id="dbTypeHelp" class="muted">
                    ※ 一時切替のみ。恒久変更は library-system-config.txt を編集してください。
                  </small>
                </div>

                <div class="form-row">
                  <label for="browserName">ブラウザの種類</label>
                  <input id="browserName" type="text" data-browser-field readonly />
                </div>

                <div class="form-actions">
                  <button type="submit" class="btn btn-primary">ログイン</button>
                  <button type="button" class="btn btn-secondary" data-clear-login>入力をクリア</button>
                </div>

                <div class="login-note">
                  <strong>ログイン後にできること</strong>
                  <ul>
                    <li>現在予約している本と受取期限の確認</li>
                    <li>書名・著者名・分類による AND 検索とページング</li>
                    <li>予約登録、予約取消、通知確認、データ取込・出力</li>
                  </ul>
                </div>

                <p class="muted login-meta">
                  動作日: <span data-today></span> ・ DB: <span data-config-summary></span>
                </p>
              </form>
            </div>
          </section>
        </div>
      </main>
    `;
  }

  /**
   * init
   * 概要 : ログイン画面のイベントハンドラを組み立てる。
   * @returns {void}
   * @spec    G01 / RF-01
   */
  function init() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    // 設定サマリ
    const sumEl = document.querySelector("[data-config-summary]");
    const refreshSummary = () => {
      if (sumEl) {
        sumEl.textContent =
          `${ConfigManager.get("dbType")} / ` +
          `予約上限: ${ConfigManager.get("maxReservations")}冊 / ` +
          `表示件数: ${ConfigManager.get("searchPageSize")}件`;
      }
    };
    refreshSummary();

    // ----------------------------------------------------------------
    // クリアボタン
    // ★ v3.0.1 修正（BUG-19/20/22/23）★ 規約 LL-09 適用
    //   form.reset() は <input value> の HTML 既定値に戻すため、JS で
    //   動的に埋めた値（data-browser-field 等）が消える。さらに <select>
    //   も先頭値に戻るため、refreshSummary() の表示と乖離する。
    //   そのため reset 直後に以下を必ずペアで実行する:
    //     (1) fillBrowserFields() でブラウザ名を再描画（BUG-19）
    //     (2) dbSelect を ConfigManager.dbType に再同期（BUG-20）
    //     (3) refreshSummary() で設定サマリ再描画（BUG-22）
    //     (4) showMessage() で a11y 通知（BUG-23）
    // ----------------------------------------------------------------
    const clearBtn = form.querySelector("[data-clear-login]");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        form.reset();
        // (1) ブラウザ名の再描画（冪等）
        if (typeof fillBrowserFields === "function") fillBrowserFields();
        // (2) DB 種別セレクトの再同期（form.reset で先頭値に戻る対策）
        const dbSel = document.getElementById("dbTypeSelect");
        if (dbSel) dbSel.value = ConfigManager.get("dbType");
        // (3) 設定サマリの再描画（<span> なので reset 影響なしだが念のため）
        refreshSummary();
        // (4) クリア完了を a11y 通知（aria-live="polite"）
        if (typeof showMessage === "function") {
          showMessage("info", "入力をクリアしました。");
        }
        document.getElementById("userId").focus();
      });
    }

    // DB種別切替（TC-COM-02）
    const dbSelect = document.getElementById("dbTypeSelect");
    if (dbSelect) {
      dbSelect.value = ConfigManager.get("dbType");
      dbSelect.addEventListener("change", () => {
        ConfigManager.setDbType(dbSelect.value);
        refreshSummary();
        showMessage("info", `データソースを ${dbSelect.value} に一時切替しました。`);
      });
    }

    // 連打防止フラグ（議事録 BUG-08 / P4-07）
    let submitting = false;

    /**
     * onSubmit : ログインフォーム送信ハンドラ。
     * @param {Event} e
     * @spec   AU01 / RF-01
     */
    form.addEventListener("submit", e => {
      e.preventDefault();
      if (submitting) return;          // 二重送信防止
      submitting = true;
      clearMessage();

      const userId   = document.getElementById("userId")?.value   || "";
      const userName = document.getElementById("userName")?.value || "";

      const btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = "認証中…"; }

      // 1tick 遅延で UI 更新が反映される時間を確保
      setTimeout(() => {
        const result = Service.authenticate(userId, userName);
        if (result.success) {
          // セッション切れ表示の残りカスを掃除
          sessionStorage.removeItem("lib-redirect-reason");
          Router.navigate("reservation-status");
        } else {
          showMessage("error", result.message);
          if (btn) { btn.disabled = false; btn.textContent = "ログイン"; }
          document.getElementById("userId").focus();
        }
        submitting = false;
      }, 50);
    });

    // userId Enter で userName へフォーカス移動
    document.getElementById("userId")?.addEventListener("keydown", e => {
      if (e.key === "Enter") { e.preventDefault(); document.getElementById("userName")?.focus(); }
    });

    // セッション切れ通知
    const reason = sessionStorage.getItem("lib-redirect-reason");
    if (reason === "E09") {
      showMessage("warn", "セッションが切れました。再度ログインしてください。(E09)");
      sessionStorage.removeItem("lib-redirect-reason");
    }

    // 初回フォーカス
    setTimeout(() => document.getElementById("userId")?.focus(), 100);
  }

  // Router に登録
  Router.register("login", { title: "ログイン", view, init, requireAuth: false });
  Router.register("index", {
    title: "起動", requireAuth: false,
    view: () => `<div class="splash"><div class="ring" aria-hidden="true"></div>
                 <div class="title">図書予約システムを準備しています…</div></div>`,
    init: () => {
      // 既ログインなら G02、未ログインなら G01 へ
      const dest = Service.getSession() ? "reservation-status" : "login";
      Router.navigate(dest);
    }
  });
})();
