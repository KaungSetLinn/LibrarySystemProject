/*
 * =============================================================================
 * ファイル名 : js/screens/screen-mypage.js
 * 概要       : G06 マイページ画面のコントローラ。
 *              現在予約・予約履歴・お気に入り・通知サマリ・JSONブリッジ
 *              （取込・出力・初期化）の操作を提供する。
 *
 * 仕様書トレーサビリティ:
 *   - 外部仕様書 G06 マイページ / §4 画面遷移 / API-06 / API-07 / API-08 / API-09
 *   - 要求仕様書 RF-10 マイページ / RF-11 ブリッジ入出力
 *   - 内部仕様書 MP01 getMyPageData
 *   - DB仕様書   §5.4 reservation_history / §5.7 favorites / §5.8 audit_log
 *   - テスト仕様 TC-MYP-01〜08
 *
 * 設計ポイント:
 *   - タブ切替方式（予約 / 履歴 / お気に入り / 通知 / データ管理）。
 *   - JSONブリッジは破壊的操作を含むため、初期化時には強い確認ダイアログを表示。
 *   - 出力時は YYYYMMDD-HHMMSS 形式のファイル名で download トリガする。
 * 作成日 : 2026-04-26
 * =============================================================================
 */
"use strict";

(function () {
  window.Screen = window.Screen || {};

  /**
   * G06 - initMyPage
   * 概要 : 認証ガード → サマリ描画 → タブ機能組立 → 各リスト描画 → ブリッジUI。
   */
  function initMyPage() {
    if (!requireSession()) return;

    const data = Service.getMyPageData();
    _renderSummary(data.summary);
    _renderReservations(data.currentReservations);
    _renderHistory(data.history);
    _renderFavorites(data.favorites);
    _renderNotificationsPreview(data.notifications);

    _setupTabs();
    _setupBridge();
  }

  /* =====================================================================
   * サマリ
   * ===================================================================== */
  function _renderSummary(s) {
    _set("[data-mp-reservations]", s.reservationCount);
    _set("[data-mp-history]",      s.historyCount);
    _set("[data-mp-favorites]",    s.favoritesCount);
    _set("[data-mp-unread]",       s.unreadNotifCount);
  }

  /* =====================================================================
   * タブ切替
   * ===================================================================== */
  function _setupTabs() {
    const tabs = document.querySelectorAll("[data-tab]");
    const panels = document.querySelectorAll("[data-tab-panel]");
    if (!tabs.length || !panels.length) return;

    function activate(name) {
      tabs.forEach(t => {
        const on = (t.dataset.tab === name);
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
      panels.forEach(p => {
        p.style.display = (p.dataset.tabPanel === name) ? "" : "none";
      });
      // localStorage に最後のタブを保存（操作回数を減らす）
      try { localStorage.setItem("lib-mp-last-tab", name); } catch (_e) {}
    }

    tabs.forEach(t => t.addEventListener("click", () => activate(t.dataset.tab)));
    // 初期タブ
    const last = localStorage.getItem("lib-mp-last-tab") || "reservations";
    activate(last);
  }

  /* =====================================================================
   * 予約一覧
   * ===================================================================== */
  function _renderReservations(reservations) {
    const tbody = document.querySelector("[data-mp-reservations-tbody]");
    const empty = document.querySelector("[data-mp-reservations-empty]");
    if (!tbody) return;
    tbody.innerHTML = "";
    if (!reservations.length) {
      if (empty) empty.style.display = "";
      return;
    }
    if (empty) empty.style.display = "none";

    reservations.forEach(r => {
      const tr = document.createElement("tr");
      const statusBadge = r.status === "WAITING"
        ? `<span class="badge badge-waiting">待機中</span>`
        : `<span class="badge badge-reserved">予約中</span>`;
      tr.innerHTML = `
        <td>${escapeHTML(r.reservationId)}</td>
        <td>${escapeHTML(r.bookTitle)}</td>
        <td>${escapeHTML(r.bookAuthor)}</td>
        <td>${statusBadge}</td>
        <td>${escapeHTML(r.pickupDeadline ? formatDate(r.pickupDeadline) : "貸出後に確定")}</td>
      `;
      tbody.appendChild(tr);
    });
    decorateResponsiveTables();
  }

  /* =====================================================================
   * 予約履歴
   * ===================================================================== */
  function _renderHistory(history) {
    const tbody = document.querySelector("[data-mp-history-tbody]");
    const empty = document.querySelector("[data-mp-history-empty]");
    if (!tbody) return;
    tbody.innerHTML = "";
    if (!history.length) {
      if (empty) empty.style.display = "";
      return;
    }
    if (empty) empty.style.display = "none";

    history.forEach(h => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHTML(formatDateTime(h.actionAt))}</td>
        <td>${_actionBadge(h.action)}</td>
        <td>${escapeHTML(h.bookTitle)}</td>
        <td>${escapeHTML(h.note || "")}</td>
        <td><code style="font-size:12px;">${escapeHTML(h.reservationId || "")}</code></td>
      `;
      tbody.appendChild(tr);
    });
    decorateResponsiveTables();
  }

  /** _actionBadge : 履歴 action（RESERVED/CANCELLED）バッジ */
  function _actionBadge(action) {
    if (action === "RESERVED")  return `<span class="badge badge-reserved">予約</span>`;
    if (action === "CANCELLED") return `<span class="badge badge-onloan">取消</span>`;
    return `<span class="badge badge-disabled">${escapeHTML(action || "")}</span>`;
  }

  /* =====================================================================
   * お気に入り
   * ===================================================================== */
  function _renderFavorites(favorites) {
    const tbody = document.querySelector("[data-mp-favorites-tbody]");
    const empty = document.querySelector("[data-mp-favorites-empty]");
    if (!tbody) return;
    tbody.innerHTML = "";
    if (!favorites.length) {
      if (empty) empty.style.display = "";
      return;
    }
    if (empty) empty.style.display = "none";

    favorites.forEach(f => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHTML(f.bookId)}</td>
        <td>${escapeHTML(f.bookTitle)}</td>
        <td>${escapeHTML(f.bookAuthor)}</td>
        <td>${escapeHTML(f.bookCategory)}</td>
        <td>${escapeHTML(formatDate(f.createdAt))}</td>
        <td>
          <button type="button" class="btn btn-warn btn-sm"
                  data-fav-remove="${escapeHTML(f.bookId)}">外す</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll("[data-fav-remove]").forEach(btn => {
      btn.addEventListener("click", () => {
        const bid = btn.dataset.favRemove;
        if (!confirm("お気に入りから外します。よろしいですか？")) return;
        if (Service.removeFavorite(bid)) {
          showMessage("success", "お気に入りから外しました。");
          // 再読込
          const data = Service.getMyPageData();
          _renderSummary(data.summary);
          _renderFavorites(data.favorites);
        } else {
          showMessage("error", "お気に入り解除に失敗しました。");
        }
      });
    });
    decorateResponsiveTables();
  }

  /* =====================================================================
   * 通知プレビュー（最新数件のみ。詳細は G05 通知画面で）
   * ===================================================================== */
  function _renderNotificationsPreview(notifications) {
    const host = document.querySelector("[data-mp-notif-list]");
    const empty = document.querySelector("[data-mp-notif-empty]");
    if (!host) return;
    host.innerHTML = "";
    const top = notifications.slice(0, 5); // 上位5件
    if (!top.length) {
      if (empty) empty.style.display = "";
      return;
    }
    if (empty) empty.style.display = "none";

    top.forEach(n => {
      const div = document.createElement("div");
      div.className = "notif-item" + (n.isRead ? " is-read" : "");
      div.innerHTML = `
        <div class="notif-head">
          ${_severityBadge(n.severity)}
          <h4 class="notif-title" style="font-size:15px;">${escapeHTML(n.title || "")}</h4>
          ${n.isRead ? '<span class="notif-flag">既読</span>' : '<span class="notif-flag is-unread">未読</span>'}
        </div>
        <div class="notif-body">${escapeHTML(n.body || "")}</div>
        <div class="notif-meta">
          <span>${escapeHTML(formatDateTime(n.createdAt))}</span>
        </div>
      `;
      host.appendChild(div);
    });
  }

  function _severityBadge(sev) {
    const map = {
      SUCCESS: { cls: "badge-available", text: "完了" },
      INFO:    { cls: "badge-reserved",  text: "情報" },
      WARN:    { cls: "badge-onloan",    text: "注意" },
      ERROR:   { cls: "badge-disabled",  text: "エラー" }
    };
    const m = map[sev] || map.INFO;
    return `<span class="badge ${m.cls}">${m.text}</span>`;
  }

  /* =====================================================================
   * JSON ブリッジ（取込・出力・初期化） RF-11
   * ===================================================================== */
  function _setupBridge() {
    // 出力（API-08）
    document.querySelector("[data-bridge-export]")?.addEventListener("click", () => {
      const json = Service.bridgeExport();
      _downloadAsFile(json, _exportFilename(), "application/json");
      showMessage("success", "現在のデータを JSON で出力しました。");
    });

    // 取込（API-07）：textarea 経由
    document.querySelector("[data-bridge-import]")?.addEventListener("click", () => {
      const ta = document.querySelector("[data-bridge-input]");
      const text = ta && ta.value ? ta.value.trim() : "";
      if (!text) {
        showMessage("warn", "取込用の JSON を貼り付けてください。");
        ta?.focus();
        return;
      }
      if (!confirm("ブリッジJSONで現在のデータを上書きします。よろしいですか？")) return;
      const result = Service.bridgeImport(text);
      if (result.success) {
        showMessage("success", result.message);
        // 全体を再描画
        const data = Service.getMyPageData();
        _renderSummary(data.summary);
        _renderReservations(data.currentReservations);
        _renderHistory(data.history);
        _renderFavorites(data.favorites);
        _renderNotificationsPreview(data.notifications);
        if (ta) ta.value = "";
      } else {
        showMessage("error", result.message);
      }
    });

    // ファイル選択での取込（操作回数の少なさ）
    document.querySelector("[data-bridge-file]")?.addEventListener("change", e => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const ta = document.querySelector("[data-bridge-input]");
        if (ta) ta.value = String(reader.result || "");
        showMessage("info", "ファイルを読み込みました。内容を確認して「取込実行」を押してください。");
      };
      reader.onerror = () => showMessage("error", "ファイル読み込みに失敗しました。");
      reader.readAsText(file, "utf-8");
    });

    // 初期化（API-09 / 破壊的操作）
    document.querySelector("[data-bridge-reset]")?.addEventListener("click", () => {
      if (!confirm("現在のデータをすべて初期データに戻します。\nこの操作は取り消せません。本当に初期化しますか？")) return;
      // 二重確認
      const ans = prompt("確認のため『初期化』と入力してください：");
      if (ans !== "初期化") {
        showMessage("warn", "確認文字列が一致しないため中止しました。");
        return;
      }
      Service.bridgeReset();
      showMessage("success", "初期データに戻しました。ページを再読込します…");
      setTimeout(() => window.location.reload(), 800);
    });
  }

  /** _exportFilename : YYYYMMDD-HHMMSS 形式のファイル名 */
  function _exportFilename() {
    const d = new Date();
    const p = n => String(n).padStart(2, "0");
    return `library-bridge-${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}.json`;
  }

  /**
   * _downloadAsFile
   * 概要 : 文字列を Blob 化し、a[download] でダウンロードを開始する。
   *        Blob URL は使用後に revokeObjectURL してリーク防止する。
   */
  function _downloadAsFile(text, filename, mime) {
    try {
      const blob = new Blob([text], { type: mime || "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // 次のtickで解放
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      showMessage("error", "ダウンロードに失敗しました: " + (e && e.message || ""));
    }
  }

  function _set(selector, value) {
    document.querySelectorAll(selector).forEach(el => { el.textContent = value; });
  }

  Screen.initMyPage = initMyPage;
})();
