/*
 * =============================================================================
 * ファイル名 : js/core/ui-common.js
 * 概要       : 画面共通の UI ユーティリティ。
 *              メッセージ表示、ヘッダ反映、ブラウザ判定、レスポンシブ装飾、
 *              ナビ生成、PCモバイル切替、未認証ガード、日付整形、エスケープ。
 *
 * 仕様書トレーサビリティ:
 *   - 外部仕様書 §10 UI 共通仕様
 *   - 要求仕様書 RF-09 通知表示 / RF-14 レスポンシブUI
 *   - テスト仕様 TC-UI-01〜08
 * 作成日 : 2026-04-26
 * =============================================================================
 */
"use strict";

/* ----- 日付・ブラウザ表示 ----- */
function setToday() {
  const d = new Date();
  const txt = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  document.querySelectorAll("[data-today]").forEach(el => { el.textContent = txt; });
}
function detectBrowser() {
  const ua = (navigator && navigator.userAgent) || "";
  if (/Edg\//.test(ua))            return "Edge";
  if (/Chrome\/.*Safari/.test(ua)) return "Chrome";
  if (/Firefox\//.test(ua))        return "Firefox";
  if (/Safari\//.test(ua))         return "Safari";
  return "その他";
}
function fillBrowserFields() {
  const name = detectBrowser();
  document.querySelectorAll("[data-browser-field]").forEach(el => {
    if ("value" in el) el.value = name; else el.textContent = name;
  });
}

/* ----- 共通メッセージ表示（外部仕様§10：色分け）----- */
/**
 * showMessage : メッセージを差し込む。
 * @param {"success"|"info"|"warn"|"error"} type
 * @param {string} text
 * @param {string} [selector] - 既定: [data-message-host]
 */
function showMessage(type, text, selector) {
  const host = document.querySelector(selector || "[data-message-host]");
  if (!host) { alert(text); return; }
  host.innerHTML = "";
  const div = document.createElement("div");
  div.className = "msg msg-" + (type || "info");
  div.setAttribute("role", type === "error" ? "alert" : "status");
  div.innerHTML = `<span class="msg-icon" aria-hidden="true"></span><span class="msg-text"></span>`;
  div.querySelector(".msg-text").textContent = text;
  host.appendChild(div);
  // 重要メッセージは上部までスクロール
  try { host.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch (_e) {}
}
function clearMessage(selector) {
  const host = document.querySelector(selector || "[data-message-host]");
  if (host) host.innerHTML = "";
}

/* ----- ヘッダの利用者表示・ログアウト ----- */
function applySessionHeader() {
  const s = (typeof Service !== "undefined") ? Service.getSession() : null;
  document.querySelectorAll("[data-session-name]").forEach(el => {
    el.textContent = s ? `${s.userName} さん` : "未ログイン";
  });
  document.querySelectorAll("[data-logout]").forEach(el => {
    el.addEventListener("click", e => {
      e.preventDefault();
      Service.logout();
      window.location.href = "login.html";
    });
  });
}

/* ----- アクティブナビ ----- */
function setActiveNav() {
  const page = (document.body.dataset.page || "").trim();
  document.querySelectorAll("[data-nav]").forEach(a => {
    if (a.dataset.nav === page) a.classList.add("is-active");
  });
}

/* ----- テーブルのモバイル装飾（td に data-label を自動付与）----- */
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
function buildMobileBottomNav() {
  const page = (document.body.dataset.page || "").trim();
  if (page === "login" || page === "index") return;
  if (document.querySelector(".bottom-nav")) return;
  const nav = document.createElement("nav");
  nav.className = "bottom-nav";
  nav.setAttribute("aria-label", "モバイル用メイン操作");
  nav.innerHTML = `
    <a href="reservation-status.html" data-nav="reservation-status">
      <span class="bn-i" aria-hidden="true">📋</span><span>予約状況</span></a>
    <a href="advanced-search.html" data-nav="advanced-search">
      <span class="bn-i" aria-hidden="true">🔍</span><span>検索</span></a>
    <a href="notification.html" data-nav="notification">
      <span class="bn-i" aria-hidden="true">🔔</span><span>通知</span></a>
    <a href="mypage.html" data-nav="mypage">
      <span class="bn-i" aria-hidden="true">👤</span><span>マイページ</span></a>
  `;
  document.body.appendChild(nav);
  nav.querySelectorAll("[data-nav]").forEach(a => {
    if (a.dataset.nav === page) a.classList.add("is-active");
  });
}

/* ----- PC/SP プレビュー切替 ----- */
function setupViewMode() {
  const btn = document.querySelector("[data-view-toggle]");
  if (!btn) return;
  applyViewMode(localStorage.getItem("lib-view-mode") || "auto");
  btn.addEventListener("click", () => {
    const next = (localStorage.getItem("lib-view-mode") || "auto") === "auto" ? "phone" : "auto";
    localStorage.setItem("lib-view-mode", next);
    applyViewMode(next);
  });
}
function applyViewMode(mode) {
  document.body.classList.toggle("force-phone", mode === "phone");
  const btn = document.querySelector("[data-view-toggle]");
  if (btn) btn.textContent = mode === "phone" ? "🖥 PC表示に戻す" : "📱 スマホ表示でプレビュー";
}

/* ----- ブラウザ警告 ----- */
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
function requireSession() {
  const s = Service.getSession();
  if (!s) {
    sessionStorage.setItem("lib-redirect-reason", "E09");
    window.location.href = "login.html";
    return null;
  }
  return s;
}

/* ----- 日付整形 ----- */
function formatDate(s) {
  if (!s || typeof s !== "string") return "";
  return s.length >= 10 ? s.slice(0, 10).replaceAll("-", "/") : s;
}
function formatDateTime(s) {
  if (!s || typeof s !== "string") return "";
  if (s.length < 16) return s;
  return s.slice(0, 10).replaceAll("-", "/") + " " + s.slice(11, 16);
}

/* ----- HTML エスケープ（XSS対策）----- */
function escapeHTML(s) {
  return String(s == null ? "" : s)
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

/* ----- actionState バッジ生成（外部仕様§7.2）----- */
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

// グローバル公開
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
