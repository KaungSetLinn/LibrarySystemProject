/*
 * =============================================================================
 * ファイル名 : js/screens/screen-reservation-status.js
 * 概要       : G02 予約状況画面（一覧画面）のコントローラ。
 *              現在予約・残枠・受取期限・取消・クイック検索を提供する。
 *
 * 仕様書トレーサビリティ:
 *   - 外部仕様書 G02 予約状況 / §4 画面遷移 / API-02 dashboard
 *   - 要求仕様書 RF-03 予約状況表示 / RF-04 クイック検索 / RF-08 予約取消
 *   - 内部仕様書 RV01 / RV02
 *   - テスト仕様 TC-STA-01〜06
 * 作成日 : 2026-04-26
 * =============================================================================
 */
"use strict";

(function () {
  window.Screen = window.Screen || {};

  /**
   * G02 - initReservationStatus
   * 概要 : 未認証ガード → ダッシュボード描画 → 取消／クイック検索のイベント設定。
   */
  function initReservationStatus() {
    if (!requireSession()) return;
    _renderDashboard();

    // クイック検索（RF-04）
    const qf = document.getElementById("quickSearchForm");
    if (qf) {
      qf.addEventListener("submit", e => {
        e.preventDefault();
        const criteria = {
          title:  (document.getElementById("bookKeyword")?.value  || "").trim(),
          author: (document.getElementById("authorKeyword")?.value || "").trim()
        };
        if (!criteria.title && !criteria.author) {
          showMessage("warn", "書名または著者名のいずれかを入力してください。");
          return;
        }
        sessionStorage.setItem("lib-search-criteria", JSON.stringify(criteria));
        window.location.href = "search-results.html";
      });
    }
  }

  /**
   * _renderDashboard : Service.getDashboard の結果を画面に描画する。
   */
  function _renderDashboard() {
    const session = Service.getSession();
    const dash = Service.getDashboard(session.userId);

    // サマリ
    _set("[data-stat-count]",     dash.count);
    _set("[data-stat-remaining]", dash.remaining);
    _set("[data-stat-max]",       dash.maxRes);
    _set("[data-stat-deadline]",  dash.nextDeadline ? formatDate(dash.nextDeadline) : "—");
    _set("[data-stat-reserved]",  dash.reservedCount);
    _set("[data-stat-waiting]",   dash.waitingCount);

    // 残枠カード強調
    document.querySelectorAll("[data-stat-remaining-card]").forEach(el => {
      el.classList.toggle("is-warn", dash.remaining === 0);
    });

    // 上限到達バナー
    const banner = document.querySelector("[data-limit-banner]");
    if (banner) {
      if (dash.remaining === 0) {
        banner.style.display = "";
        banner.innerHTML =
          `<div class="msg msg-warn"><span class="msg-icon" aria-hidden="true"></span>` +
          `<span class="msg-text">予約は上限の ${escapeHTML(dash.maxRes)} 冊に達しています。新しく予約するには、まずいずれかを取消してください。</span></div>`;
      } else {
        banner.style.display = "none"; banner.innerHTML = "";
      }
    }

    // 一覧テーブル
    const tbody = document.querySelector("[data-reservation-tbody]");
    const empty = document.querySelector("[data-reservation-empty]");
    if (!tbody) return;
    tbody.innerHTML = "";
    if (!dash.reservations.length) {
      if (empty) empty.style.display = "";
      return;
    }
    if (empty) empty.style.display = "none";

    dash.reservations.forEach(r => {
      const tr = document.createElement("tr");
      const statusBadge = _statusBadge(r.status);
      tr.innerHTML = `
        <td>${escapeHTML(r.reservationId)}</td>
        <td>${escapeHTML(r.bookTitle)}</td>
        <td>${escapeHTML(r.bookAuthor)}</td>
        <td>${statusBadge}</td>
        <td>${escapeHTML(r.pickupDeadline ? formatDate(r.pickupDeadline) : "貸出後に確定")}</td>
        <td><button type="button" class="btn btn-warn btn-sm" data-cancel-id="${escapeHTML(r.reservationId)}">取消する</button></td>
      `;
      tbody.appendChild(tr);
    });

    // 取消ボタン（誤操作防止 confirm）
    tbody.querySelectorAll("[data-cancel-id]").forEach(btn => {
      btn.addEventListener("click", () => {
        const rid = btn.dataset.cancelId;
        if (!confirm("この予約を取消します。よろしいですか？")) return;
        btn.disabled = true; btn.textContent = "取消中…";
        const result = Service.cancelReservation(rid);
        if (result.success) {
          showMessage("success", result.message);
          _renderDashboard();
          decorateResponsiveTables();
        } else {
          showMessage("error", result.message);
          btn.disabled = false; btn.textContent = "取消する";
        }
      });
    });

    decorateResponsiveTables();
  }

  /** 予約ステータス（RESERVED/WAITING）バッジ */
  function _statusBadge(status) {
    if (status === "WAITING")  return `<span class="badge badge-waiting">待機中</span>`;
    if (status === "RESERVED") return `<span class="badge badge-reserved">予約中</span>`;
    return `<span class="badge badge-disabled">${escapeHTML(status || "")}</span>`;
  }

  function _set(selector, value) {
    document.querySelectorAll(selector).forEach(el => { el.textContent = value; });
  }

  Screen.initReservationStatus = initReservationStatus;
})();
