/*
 * READABLE-CODE REVIEW NOTE
 * 対象ファイル: frontend/js/datasource/sqlite-stub-adapter.js
 * 責務: IRepository 契約の実装。Excel/localStorage、SQLite、HTTP API などの保存先差分を吸収する。
 * 保守メモ: 戻り値形式を画面が期待する ViewModel に正規化すること。特に actionState/canReserve は予約ボタン制御に直結する。
 */
/*
 * =============================================================================
 * ファイル名 : js/datasource/sqlite-stub-adapter.js
 * 概要       : SQLiteStubAdapter（RP01 SQLiteRepository のスタブ実装）。
 *              IRepository 契約を ExcelAdapter と完全一致させ、
 *              dbType=SQLite 切替時もアプリ層の改修を不要にする。
 *
 *              v3.0 では実体を ExcelAdapter に委譲するスタブ。
 *              将来的には server/ の Express + better-sqlite3 への HTTP 委譲、
 *              または WASM SQLite に置換することを想定。
 *
 * 仕様書トレーサビリティ:
 *   - 内部仕様書 v3.0  RP01 SQLiteRepository / CF03 createRepository
 *   - DB仕様書   v3.0  §10 トランザクション仕様（将来 BEGIN IMMEDIATE 実装）
 *   - 要求仕様書 v3.0  §11 将来拡張（SQLite 正式化）
 *   - テスト仕様 v3.0  TC-COM-02（Excel↔SQLite 切替）
 *   - ADR-002 ハイブリッド構成
 *
 * 改訂履歴:
 *   v1.0    2026-04-25  Y.Toyoda  v2.x 初版（ExcelAdapter 委譲方式）
 *   v3.0    2026-05-04  Y.Toyoda  全関数 JSDoc 完全形 / Logger 連携 / トレーサビリティ
 *   v3.0.3  2026-05-05  Y.Toyoda  起動時スタブ警告ログ・スタブモードバッジ追加（S-1）
 *
 * @author  Y.Toyoda
 * @version v3.0.3
 * =============================================================================
 */
"use strict";

const SQLiteStubAdapter = (() => {

  /**
   * _excel
   * 概要 : 委譲先 ExcelAdapter を取得する。未読込時は null。
   *        読込み順事故時に致命停止せず、警告ログのみで安全動作する。
   *
   * @returns {Object|null}
   */
  function _excel() {
    if (window.ExcelAdapter) return window.ExcelAdapter;
    if (window.Logger) {
      Logger.warn("SQLiteStubAdapter._excel",
        "ExcelAdapter 未読込。読込み順を確認してください。");
    }
    return null;
  }

  /**
   * _tag
   * 概要 : 書込系応答メッセージに「（SQLite スタブ経由）」を付与する。
   *        利用者が現在 SQLite モードで動作していることを直感的に確認できる。
   *
   * @param {Object} result
   * @returns {Object}
   * @spec    TC-COM-02
   */
  function _tag(result) {
    if (result && typeof result === "object" && typeof result.message === "string") {
      if (!result.message.includes("SQLite スタブ経由")) {
        result.message = result.message + "（SQLite スタブ経由）";
      }
    }
    return result;
  }

  /**
   * _errStubUnavailable
   * 概要 : ExcelAdapter 未読込時の共通エラー応答。
   * @returns {ServiceResult}
   */
  function _errStubUnavailable() {
    return { success: false, messageCode: "E10",
      message: "SQLite スタブ実体が利用できません。" };
  }

  /* =====================================================================
   * 公開 API（IRepository 契約 / ExcelAdapter と完全一致）
   * ===================================================================== */
  return Object.freeze({

    // ----- 認証 / 利用者 -----
    /** @spec RF-01 / AU01 */
    findUser(userId, userName) {
      const a = _excel(); return a ? a.findUser(userId, userName) : null;
    },

    // ----- 予約状況 -----
    /** @spec RF-03 / RV01 */
    getActiveReservations(userId) {
      const a = _excel(); return a ? a.getActiveReservations(userId) : [];
    },
    /** @spec RF-03 / RV01 */
    getReservationCount(userId) {
      const a = _excel(); return a ? a.getReservationCount(userId) : 0;
    },

    // ----- 検索 -----
    /** @spec RF-05/06 / SR02 */
    searchBooks(criteria) {
      const a = _excel(); return a ? a.searchBooks(criteria) : [];
    },
    getCategories() {
      const a = _excel(); return a && typeof a.getCategories === "function" ? a.getCategories() : [];
    },

    // ----- 予約 / 取消（書込系：スタブタグを付与） -----
    /** @spec RF-07 / RV03 */
    reserveBook(userId, bookId) {
      const a = _excel();
      if (!a) return _errStubUnavailable();
      return _tag(a.reserveBook(userId, bookId));
    },
    /** @spec RF-08 / RV02 */
    cancelReservation(userId, reservationId) {
      const a = _excel();
      if (!a) return _errStubUnavailable();
      return _tag(a.cancelReservation(userId, reservationId));
    },

    // ----- マイページ / 通知 / お気に入り -----
    /** @spec RF-10 / MP01 */
    getMyPageData(userId) {
      const a = _excel();
      if (a) return a.getMyPageData(userId);
      return { currentReservations: [], history: [], favorites: [], notifications: [],
        summary: { reservationCount: 0, historyCount: 0, favoritesCount: 0, unreadNotifCount: 0 } };
    },
    /** @spec RF-09 */
    getNotifications(userId) {
      const a = _excel(); return a ? a.getNotifications(userId) : [];
    },
    /** @spec RF-09 */
    markNotificationRead(userId, notificationId) {
      const a = _excel(); return a ? a.markNotificationRead(userId, notificationId) : false;
    },
    /** @spec RF-10 */
    addFavorite(userId, bookId) {
      const a = _excel(); return a ? a.addFavorite(userId, bookId) : false;
    },
    /** @spec RF-10 */
    removeFavorite(userId, bookId) {
      const a = _excel(); return a ? a.removeFavorite(userId, bookId) : false;
    },

    // ----- ブリッジ -----
    /** @spec RF-11 / API-08 */
    exportAll() {
      const a = _excel(); return a ? a.exportAll() : "{}";
    },
    /** @spec RF-11 / API-07 */
    importAll(jsonStr) {
      const a = _excel();
      if (!a) return _errStubUnavailable();
      return _tag(a.importAll(jsonStr));
    },
    /** @spec RF-11 / API-09 */
    resetToSeed() {
      const a = _excel(); if (a) a.resetToSeed();
    },

    // ----- 貸出連携 -----
    /** @spec RF-13 / LN01 / API-10 */
    handleLoanEvent(event) {
      const a = _excel();
      if (!a) return _errStubUnavailable();
      return _tag(a.handleLoanEvent(event));
    },

    // ----- 監査ログ -----
    /** @spec RF-12 / LG01 */
    writeAuditLog(eventType, level, userId, message, detail) {
      const a = _excel();
      if (a) a.writeAuditLog(eventType, level, userId, message, detail);
    }
  });
})();

window.SQLiteStubAdapter = SQLiteStubAdapter;

/* =============================================================================
 * v3.0.3 追加（S-1）: dbType=SQLite 選択時に「スタブ動作中」を明示的に通知
 * - コンソールに警告
 * - 画面右下にスタブモードバッジを表示
 * =============================================================================
 */
(function notifyStubMode() {
  "use strict";
  // ConfigManager の解決完了を待ってから判定する
  function check() {
    var dbType = (window.ConfigManager && typeof ConfigManager.get === "function")
      ? ConfigManager.get("dbType") : null;
    if (dbType !== "SQLite") return;

    // v3.0.4: SQLiteAdapter（本実装）が ready なら Stub は使われないのでバッジは出さない
    if (window.SQLiteAdapter && typeof SQLiteAdapter.isReady === "function" && SQLiteAdapter.isReady()) {
      return;
    }
    // ApiAdapter（HTTP 委譲）が available ならそれが使われるのでバッジは出さない
    if (window.ApiAdapter && typeof ApiAdapter.isAvailable === "function" && ApiAdapter.isAvailable()) {
      return;
    }

    // (1) コンソール警告
    if (window.Logger && typeof Logger.warn === "function") {
      Logger.warn("SQLiteStubAdapter",
        "dbType=SQLite ですが、ブラウザ単体動作モードでは ExcelAdapter に委譲するスタブで動作します。" +
        " 実DB接続には sql.js のロード成功 または server/ モード（Express + better-sqlite3）の起動が必要です。");
    } else if (typeof console !== "undefined") {
      console.warn("[SQLiteStubAdapter] スタブ動作中（実体は ExcelAdapter）。実DB接続には sql.js または server/ モードが必要です。");
    }

    // (2) 画面バッジ表示
    if (typeof document !== "undefined" && document.body) {
      if (document.querySelector(".stub-mode-badge")) return;
      var badge = document.createElement("div");
      badge.className = "stub-mode-badge";
      badge.setAttribute("role", "status");
      badge.setAttribute("aria-live", "polite");
      badge.textContent = "⚠ SQLite スタブモード（デモ）";
      badge.title = "sql.js がロードできず、server/ モードも未起動のためスタブで動作中です。";
      document.body.appendChild(badge);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      // ConfigManager.init は非同期 + SQLiteAdapter.init も非同期。
      // sql.js の WASM ロード完了を待つため 1.5 秒遅延。
      setTimeout(check, 1500);
    });
  } else {
    setTimeout(check, 1500);
  }
})();
