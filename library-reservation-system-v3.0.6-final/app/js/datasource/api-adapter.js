/*
 * =============================================================================
 * ファイル名 : app/js/datasource/api-adapter.js
 * 概要       : ApiAdapter（HTTP 委譲アダプタ）。
 *              server/ の Express + better-sqlite3 に HTTP で委譲し、
 *              本物の SQLite を利用するためのアダプタ。
 *
 *              ApiClient（CSRF 自動付与 fetch wrapper）を経由する。
 *              IRepository 契約は ExcelAdapter / SQLiteAdapter と同一。
 *              ただし HTTP は本来非同期だが、Service 層が同期前提のため
 *              v3.0.4 では同期 XHR / 簡易同期化 は採用せず、
 *              「server/ 起動が確認できる場合のみ使用される」ハイブリッド戦略とする。
 *
 *              本アダプタは将来 v3.1 で Service 層の async 化と同時に正式採用。
 *              v3.0.4 では「初期 ping で疎通確認」に用い、結果を
 *              RepositoryFactory に渡してフォールバック判定の素材とする。
 *
 * 仕様書トレーサビリティ:
 *   - 外部仕様書 v4.0  §8 API一覧 / §8.2 共通応答形式
 *   - 内部仕様書 v4.0  RP01 / CF03
 *   - 改訂対象        S-1（SQLite 非実体化）
 *
 * 改訂履歴:
 *   v3.0.4  2026-05-05  Y.Toyoda  新規作成（HTTP 委譲、疎通確認）
 *   v3.0.5  2026-05-10  Y.Toyoda  API-06 パスを /users/:userId/reservations/:reservationId に修正
 *   v3.0.6  2026-05-11  Y.Toyoda  v4.0a-rev3 反映：listFavorites/addFavorite/removeFavorite/
 *                                 markNotificationRead を本実装化（プレースホルダ撤廃、
 *                                 API-11/12/13/14 に対応）
 *
 * @author  Y.Toyoda
 * @version v3.0.6
 * =============================================================================
 */
"use strict";

const ApiAdapter = (() => {

  let _available = false;
  let _pingPromise = null;

  function _log(level, where, msg) {
    if (window.Logger && typeof Logger[level] === "function") {
      Logger[level](where, msg);
    }
  }

  /**
   * ping
   * 概要 : /api/v1/health に GET して server/ の存在を確認する。
   *        2秒以内に応答が返れば available=true。
   *
   * @returns {Promise<boolean>}
   * @spec    外部仕様 §8 API-10 health
   */
  function ping() {
    if (_pingPromise) return _pingPromise;
    _pingPromise = new Promise(resolve => {
      const controller = (typeof AbortController !== "undefined") ? new AbortController() : null;
      const timer = setTimeout(() => {
        if (controller) controller.abort();
        resolve(false);
      }, 2000);
      const opts = { method: "GET", credentials: "same-origin" };
      if (controller) opts.signal = controller.signal;

      fetch("/api/v1/health", opts)
        .then(r => r.ok ? r.json() : null)
        .then(j => {
          clearTimeout(timer);
          const ok = !!(j && j.data && j.data.dbConnected);
          _available = ok;
          _log("info", "ApiAdapter.ping", "server/ available=" + ok);
          resolve(ok);
        })
        .catch(() => {
          clearTimeout(timer);
          _available = false;
          resolve(false);
        });
    });
    return _pingPromise;
  }

  function isAvailable() { return _available; }

  /* ============================================================
   *  IRepository 契約（最小実装）
   *
   *  ※ 注意：fetch は Promise を返すため、Service 層の同期 API と
   *           完全互換ではない。v3.0.4 では「Promise を返す版」と
   *           して提供し、画面側で await 可能なメソッドのみ使用する。
   *           v3.1 で Service 層全体を async 化する際に正式統合。
   * ============================================================ */

  /** GET /api/v1/users/:userId/dashboard → reservations/notifications 等 */
  async function getActiveReservations(userId) {
    const r = await ApiClient.get("/api/v1/users/" + encodeURIComponent(userId) + "/dashboard");
    return (r && r.data && r.data.reservations) || [];
  }
  async function getReservationCount(userId) {
    const r = await ApiClient.get("/api/v1/users/" + encodeURIComponent(userId) + "/dashboard");
    return (r && r.data && r.data.reservationCount) || 0;
  }

  /** POST /api/v1/auth/login */
  async function findUser(userCode, userName) {
    const r = await ApiClient.post("/api/v1/auth/login", { userCode, userName });
    if (r && r.result === "success") {
      return { userId: r.data.user.userId, userName: r.data.user.userName, role: "STUDENT" };
    }
    return null;
  }

  /** GET /api/v1/books/search */
  async function searchBooks(criteria) {
    const c = criteria || {};
    const params = new URLSearchParams();
    if (c.title)    params.set("title", c.title);
    if (c.author)   params.set("author", c.author);
    if (c.category) params.set("category", c.category);
    if (c.sort)     params.set("sort", c.sort);
    if (c.page !== undefined)     params.set("page", c.page);
    if (c.pageSize !== undefined) params.set("pageSize", c.pageSize);
    const r = await ApiClient.get("/api/v1/books/search?" + params.toString());
    return (r && r.data && r.data.books) || [];
  }

  /** POST /api/v1/reservations */
  async function reserveBook(userId, bookId) {
    const r = await ApiClient.post("/api/v1/reservations", { bookId: Number(bookId) });
    return r;
  }

  /** DELETE /api/v1/users/:userId/reservations/:reservationId （v3.0.5: パス修正） */
  async function cancelReservation(userId, reservationId) {
    const r = await ApiClient.delete(
      "/api/v1/users/" + encodeURIComponent(userId) +
      "/reservations/" + encodeURIComponent(reservationId)
    );
    return r;
  }

  /** GET /api/v1/users/:userId/mypage */
  async function getMyPageData(userId) {
    const r = await ApiClient.get("/api/v1/users/" + encodeURIComponent(userId) + "/mypage");
    return (r && r.data) || { currentReservations: [], history: [], favorites: [], notifications: [] };
  }

  async function getNotifications(userId) {
    const r = await ApiClient.get("/api/v1/users/" + encodeURIComponent(userId) + "/notifications");
    return (r && r.data && r.data.notifications) || [];
  }

  /** POST /api/v1/users/:userId/notifications/:notificationId/read （v3.0.6 / API-14） */
  async function markNotificationRead(userId, notificationId) {
    const r = await ApiClient.post(
      "/api/v1/users/" + encodeURIComponent(userId) +
      "/notifications/" + encodeURIComponent(notificationId) + "/read",
      {}
    );
    return r;
  }
  /** GET /api/v1/users/:userId/favorites （v3.0.6 / API-11） */
  async function listFavorites(userId, opts) {
    const o = opts || {};
    const qs = new URLSearchParams();
    if (o.page !== undefined)     qs.set("page", o.page);
    if (o.pageSize !== undefined) qs.set("pageSize", o.pageSize);
    const url = "/api/v1/users/" + encodeURIComponent(userId) + "/favorites" +
                (qs.toString() ? "?" + qs.toString() : "");
    const r = await ApiClient.get(url);
    return r;
  }
  /** POST /api/v1/users/:userId/favorites （v3.0.6 / API-12） */
  async function addFavorite(userId, bookId) {
    const r = await ApiClient.post(
      "/api/v1/users/" + encodeURIComponent(userId) + "/favorites",
      { bookId: Number(bookId) }
    );
    return r;
  }
  /** DELETE /api/v1/users/:userId/favorites/:favoriteId （v3.0.6 / API-13） */
  async function removeFavorite(userId, favoriteId) {
    const r = await ApiClient.delete(
      "/api/v1/users/" + encodeURIComponent(userId) +
      "/favorites/" + encodeURIComponent(favoriteId)
    );
    return r;
  }
  async function exportAll()              { return "{}"; }
  async function importAll()              { return { success: false, messageCode: "E10", message: "v3.0.4 未対応。" }; }
  async function resetToSeed()            { /* 管理者のみ。v3.1 */ }
  async function handleLoanEvent(event)   {
    return await ApiClient.post("/api/v1/loans/events", event);
  }
  async function writeAuditLog()          { /* server 側で自動記録 */ }
  async function findBookById(bookId) {
    const r = await ApiClient.get("/api/v1/books/" + encodeURIComponent(bookId));
    return (r && r.data) || null;
  }

  return Object.freeze({
    ping, isAvailable,
    findUser,
    getActiveReservations, getReservationCount,
    searchBooks,
    reserveBook, cancelReservation,
    getMyPageData, getNotifications, markNotificationRead,
    listFavorites, addFavorite, removeFavorite,
    exportAll, importAll, resetToSeed,
    handleLoanEvent, writeAuditLog,
    findBookById
  });
})();

window.ApiAdapter = ApiAdapter;

/* =============================================================================
 * 起動時：dbType=SQLite かつ ブラウザ側 sql.js 不可時のみ ping を試みる
 * ============================================================================= */
(function autoPing() {
  "use strict";
  function start() {
    var dbType = (window.ConfigManager && typeof ConfigManager.get === "function")
      ? ConfigManager.get("dbType") : null;
    if (dbType !== "SQLite") return;
    setTimeout(() => {
      ApiAdapter.ping().then(ok => {
        if (ok && window.Logger) Logger.info("ApiAdapter", "server/ 疎通確認 OK");
      });
    }, 500);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
