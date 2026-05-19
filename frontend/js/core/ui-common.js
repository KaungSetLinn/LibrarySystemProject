/*
 * READABLE-CODE REVIEW NOTE
 * 対象ファイル: frontend/js/core/ui-common.js
 * 責務: フロントエンド共通基盤。設定、ルーティング、サービス境界、ログ、UI共通処理を担当する。
 * 保守メモ: 画面層とデータソース層を結合しすぎないこと。非同期 API を導入する場合は Service 契約を先に揃える。
 */
/*
 * =============================================================================
 * ファイル名 : js/core/ui-common.js
 * 概要       : 画面共通の UI ユーティリティ。
 *              メッセージ表示（Toast対応）、ヘッダ反映、ブラウザ判定、
 *              レスポンシブ装飾、ナビ生成、PCモバイル切替、未認証ガード、
 *              日付整形、HTMLエスケープ、actionState バッジ生成。
 *
 *              v3.0 で alert() 全廃 → Toast 化（議事録 P4-06 / BUG-10）。
 *              WCAG 2.1 AA 反映（aria-* / focus 二重リング）。
 *
 * 仕様書トレーサビリティ:
 *   - 外部仕様書 v3.0  §10 UI 共通仕様 / §15 アクセシビリティ
 *   - 要求仕様書 v3.0  RF-09 / RF-14
 *   - テスト仕様 v3.0  TC-UI-* / TC-A11Y-*
 *   - ADR-012 WCAG 2.1 AA 準拠
 *   - 議事録          P4-06 / P5-05 / BUG-10 / BUG-12
 *
 * 改訂履歴:
 *   v1.0  2026-04-15  Y.Toyoda  v2.x 初版
 *   v3.0  2026-05-04  Y.Toyoda  Toast 化 / WCAG 対応 / JSDoc 完全形
 *
 * @author  Y.Toyoda
 * @version v3.0
 * =============================================================================
 */
"use strict";

/* ----- 日付・ブラウザ表示 ----- */

/**
 * setToday
 * 概要 : data-today 属性を持つ要素に「今日」を YYYY-MM-DD で埋める。
 * @returns {void}
 * @spec    外部仕様 §10
 */
function setToday() {
  const d = new Date();
  const txt = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  document.querySelectorAll("[data-today]").forEach(el => { el.textContent = txt; });
}

/**
 * detectBrowser
 * 概要 : 現在のブラウザ種別を返す（簡易判定）。
 * @returns {string} "Edge"|"Chrome"|"Firefox"|"Safari"|"その他"
 * @spec    議事録 P4-19
 */
function detectBrowser() {
  const ua = (navigator && navigator.userAgent) || "";
  if (/Edg\//.test(ua))            return "Edge";
  if (/Chrome\/.*Safari/.test(ua)) return "Chrome";
  if (/Firefox\//.test(ua))        return "Firefox";
  if (/Safari\//.test(ua))         return "Safari";
  return "その他";
}

/**
 * fillBrowserFields
 * 概要 : data-browser-field 属性を持つ要素にブラウザ名を埋める。
 * @returns {void}
 */
function fillBrowserFields() {
  const name = detectBrowser();
  document.querySelectorAll("[data-browser-field]").forEach(el => {
    if ("value" in el) el.value = name; else el.textContent = name;
  });
}

/* ----- 共通メッセージ表示（外部仕様§10：色分け・aria-live）----- */

/**
 * showMessage
 * 概要 : メッセージを画面に表示する。data-message-host があればその場、
 *        無ければ Toast として右下に表示（v3.0 で alert を全廃 / BUG-10）。
 *
 * @param {("success"|"info"|"warn"|"error")} type
 * @param {string} text
 * @param {string} [selector] 既定: [data-message-host]
 * @returns {void}
 * @spec    外部仕様 §10 / 議事録 P4-06 / BUG-10
 */
function showMessage(type, text, selector) {
  const host = document.querySelector(selector || "[data-message-host]");
  if (host) {
    host.innerHTML = "";
    const div = document.createElement("div");
    div.className = "msg msg-" + (type || "info");
    div.setAttribute("role", type === "error" ? "alert" : "status");
    div.setAttribute("aria-live", type === "error" ? "assertive" : "polite");
    const icon = document.createElement("span");
    icon.className = "msg-icon"; icon.setAttribute("aria-hidden", "true");
    const txt = document.createElement("span");
    txt.className = "msg-text"; txt.textContent = text;
    div.appendChild(icon); div.appendChild(txt);
    host.appendChild(div);
    try { host.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch (_e) {}
    return;
  }
  // Host 無し → Toast
  _showToast(type, text);
}

/**
 * _showToast
 * 概要 : 画面右下に Toast を表示し、3秒後に自動消去する。
 * @param {string} type
 * @param {string} text
 * @returns {void}
 * @spec    議事録 P4-06 / BUG-10
 */
function _showToast(type, text) {
  let toast = document.getElementById("lib-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "lib-toast";
    toast.className = "lib-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }
  toast.className = "lib-toast lib-toast-" + (type || "info") + " is-visible";
  toast.textContent = text;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 3000);
}

/**
 * clearMessage
 * 概要 : メッセージ領域をクリアする。
 * @param {string} [selector]
 * @returns {void}
 */
function clearMessage(selector) {
  const host = document.querySelector(selector || "[data-message-host]");
  if (host) host.innerHTML = "";
}

/* ----- ヘッダの利用者表示・ログアウト ----- */

/**
 * applySessionHeader
 * 概要 : ヘッダに利用者名を反映し、ログアウトリンクを動作させる。
 * @returns {void}
 * @spec    外部仕様 §10
 */
function applySessionHeader() {
  const s = (typeof Service !== "undefined") ? Service.getSession() : null;
  document.querySelectorAll("[data-session-name]").forEach(el => {
    el.textContent = s ? `${s.userName} さん` : "未ログイン";
  });
  document.querySelectorAll("[data-logout]").forEach(el => {
    if (el._wired) return; // 重複バインド防止（議事録 P1-10）
    el._wired = true;
    el.addEventListener("click", e => {
      e.preventDefault();
      if (!confirm("ログアウトしてよろしいですか？")) return;
      Service.logout();
      Router.navigate("login");
    });
  });
}

/* ----- アクティブナビ ----- */

/**
 * setActiveNav
 * 概要 : 現在画面と一致するナビ要素に .is-active と aria-current="page" を付与。
 * @returns {void}
 * @spec    P5-11 / 外部仕様 §15
 */
function setActiveNav() {
  const page = (document.body.dataset.page || "").trim();
  document.querySelectorAll("[data-nav]").forEach(a => {
    if (a.dataset.nav === page) {
      a.classList.add("is-active");
      a.setAttribute("aria-current", "page");
    } else {
      a.classList.remove("is-active");
      a.removeAttribute("aria-current");
    }
  });
}

/* ----- テーブルのモバイル装飾 ----- */

/**
 * decorateResponsiveTables
 * 概要 : table.table の td に thead の見出しテキストを data-label として自動付与。
 *        モバイル幅で「ラベル: 値」形式に変形する CSS と連動。
 * @returns {void}
 * @spec    RF-14
 */
function decorateResponsiveTables() {
  document.querySelectorAll("table.table").forEach(table => {
    const headers = Array.from(table.querySelectorAll("thead th")).map(th => th.textContent.trim());
    table.querySelectorAll("tbody tr").forEach(tr => {
      Array.from(tr.children).forEach((td, i) => {
        if (headers[i] && !td.dataset.label) td.dataset.label = headers[i];
      });
    });
  });
}

/* ----- モバイル下部ナビ ----- */

/**
 * buildMobileBottomNav
 * 概要 : モバイル幅用のボトムナビを動的生成する。
 * @returns {void}
 * @spec    RF-14
 */
function buildMobileBottomNav() {
  const page = (document.body.dataset.page || "").trim();
  if (page === "login" || page === "index") return;
  if (document.querySelector(".bottom-nav")) return;
  const nav = document.createElement("nav");
  nav.className = "bottom-nav";
  nav.setAttribute("aria-label", "モバイル用メイン操作");
  nav.innerHTML = `
    <a href="#/reservation-status" data-nav="reservation-status">
      <span class="bn-i" aria-hidden="true">📋</span><span>予約状況</span></a>
    <a href="#/advanced-search" data-nav="advanced-search">
      <span class="bn-i" aria-hidden="true">🔍</span><span>検索</span></a>
    <a href="#/notification" data-nav="notification">
      <span class="bn-i" aria-hidden="true">🔔</span><span>通知</span></a>
    <a href="#/mypage" data-nav="mypage">
      <span class="bn-i" aria-hidden="true">👤</span><span>マイページ</span></a>
  `;
  document.body.appendChild(nav);
  nav.querySelectorAll("[data-nav]").forEach(a => {
    if (a.dataset.nav === page) {
      a.classList.add("is-active");
      a.setAttribute("aria-current", "page");
    }
  });
}

/* ----- PC/SP プレビュー切替 ----- */

/**
 * setupViewMode
 * 概要 : data-view-toggle ボタンで PC/スマホ表示プレビューを切替える。
 * @returns {void}
 * @spec    RF-14 / TC-UI-08
 */
/**
 * setupViewMode
 * 概要 : data-view-toggle ボタンで PC/スマホ表示プレビューを切替える。
 *        v6.0 追加: 利用環境に応じて、プレビュー機能自体を無効化する。
 *          - UA でスマホと判定された場合 → ボタンを DOM から削除
 *          - 画面幅が 768px 未満の場合   → ボタンを DOM から削除
 *          - それ以外（PC 想定）         → 「スマホ表示でプレビュー」は提供しない
 *            （UA + 幅併用の判定により、PC でも本ボタンは削除する）
 * @returns {void}
 * @spec    RF-14
 */
function setupViewMode() {
  const btn = document.querySelector("[data-view-toggle]");
  if (!btn) return;

  // ---- デバイス判定（UA + 画面幅の併用）----
  const ua = (navigator.userAgent || "").toLowerCase();
  const isMobileUA =
    /iphone|ipod|android.*mobile|windows phone|mobile safari/.test(ua);
  const isNarrow = window.innerWidth < 768;
  const isMobile = isMobileUA || isNarrow;

  // 仕様: PC / スマホのいずれの場合もプレビュー切替は提供しない。
  // → DOM から削除して操作不能化（残存している localStorage 値も初期化）。
  try { localStorage.removeItem("lib-view-mode"); } catch (_e) {}
  document.body.classList.remove("force-phone");
  btn.remove();
}

/**
 * applyViewMode
 * 概要 : 表示モードを body クラスに適用する。
 * @param {("auto"|"phone")} mode
 * @returns {void}
 */
function applyViewMode(mode) {
  document.body.classList.toggle("force-phone", mode === "phone");
  const btn = document.querySelector("[data-view-toggle]");
  if (btn) btn.textContent = mode === "phone" ? "🖥 PC表示に戻す" : "📱 スマホ表示でプレビュー";
}

/* ----- ブラウザ警告 ----- */

/**
 * checkBrowserWarning
 * 概要 : localStorage が使用可能か検証し、不可なら警告を表示する。
 * @returns {void}
 */
function checkBrowserWarning() {
  try {
    localStorage.setItem("__lib_test", "1");
    localStorage.removeItem("__lib_test");
  } catch (_e) {
    showMessage("error",
      "このブラウザは localStorage を利用できません。Chrome / Edge / Firefox の最新版でご利用ください。");
  }
}

/* ----- 未認証ガード ----- */

/**
 * requireSession
 * 概要 : セッションが無いか期限切れなら login にリダイレクトする。
 * @returns {Object|null} 有効セッション、無ければ null（リダイレクト済）
 * @spec    BUG-09 / 議事録 P4-12
 */
function requireSession() {
  const s = Service.getSession();
  if (!s) {
    sessionStorage.setItem("lib-redirect-reason", "E09");
    Router.navigate("login");
    return null;
  }
  return s;
}

/* ----- 日付整形 ----- */

/**
 * formatDate
 * 概要 : ISO日時文字列を YYYY/MM/DD に整形。
 * @param {string} s
 * @returns {string}
 */
function formatDate(s) {
  if (!s || typeof s !== "string") return "";
  return s.length >= 10 ? s.slice(0, 10).replaceAll("-", "/") : s;
}

/**
 * formatDateTime
 * 概要 : ISO日時文字列を YYYY/MM/DD HH:MM に整形。
 * @param {string} s
 * @returns {string}
 */
function formatDateTime(s) {
  if (!s || typeof s !== "string") return "";
  if (s.length < 16) return s;
  return s.slice(0, 10).replaceAll("-", "/") + " " + s.slice(11, 16);
}

/* ----- HTML エスケープ（XSS対策）----- */

/**
 * escapeHTML
 * 概要 : HTML 特殊文字をエスケープする。
 * @param {*} s
 * @returns {string}
 * @spec    議事録 P4-08 / OWASP A03
 */
function escapeHTML(s) {
  return String(s == null ? "" : s)
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

/* ----- actionState バッジ生成（外部仕様§7.2）----- */

/**
 * renderActionStateBadge
 * 概要 : actionState に応じたバッジ HTML を返す。
 * @param {string} actionState "AVAILABLE"|"ON_LOAN"|"RESERVED"|"DISABLED"
 * @param {string} statusText 表示用テキスト
 * @returns {string} HTML 文字列（呼出側で innerHTML に使用、escapeHTML 済み）
 * @spec    外部仕様 §7.2
 */
function renderActionStateBadge(actionState, statusText) {
  const map = {
    AVAILABLE: "badge-available",
    ON_LOAN:   "badge-onloan",
    RESERVED:  "badge-reserved",
    DISABLED:  "badge-disabled"
  };
  const cls = map[actionState] || "badge-disabled";
  const txt = escapeHTML(statusText || actionState || "");
  return `<span class="badge ${cls}">${txt}</span>`;
}

/* ----- グローバル公開 ----- */
Object.assign(window, {
  setToday, detectBrowser, fillBrowserFields,
  showMessage, clearMessage,
  applySessionHeader, setActiveNav,
  decorateResponsiveTables, buildMobileBottomNav,
  setupViewMode, applyViewMode, checkBrowserWarning,
  requireSession,
  formatDate, formatDateTime, escapeHTML,
  renderActionStateBadge
});
