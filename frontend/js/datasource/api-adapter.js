/*
 * Readable-code review note:
 * - Role: HTTP repository adapter. It must normalize backend responses into the same contract as local repositories.
 * - Keep behavior unchanged unless a specification or bug-fix task explicitly requires it.
 * - Comments in this file should explain intent, data contracts, and edge cases rather than repeat the code.
 */
/*
 * =============================================================================
 * ファイル名 : app/js/datasource/api-adapter.js
 * 概要       : ApiAdapter(HTTP 委譲アダプタ)。
 *              server/ の Express + better-sqlite3 に HTTP で委譲し、
 *              本物の SQLite を利用するためのアダプタ。
 *
 *              ★ 統合パッケージ改訂(v3.0.6+integration) ★
 *              ConfigManager.getBackendMode() を参照して MAIN / TEST を切替:
 *                MAIN ⇒ library-backend (カゥン氏正本) /api/users/* /api/books/*
 *                TEST ⇒ library-Tbackend (豊田テスト)  /api/v1/*
 *              UI 本体には一切影響しない(同じメソッド名・戻り値形式を維持)。
 *
 * 仕様書トレーサビリティ:
 *   - 外部仕様書 v4.0  §8 API一覧 / §8.2 共通応答形式
 *   - 内部仕様書 v4.0  RP01 / CF03
 *   - 改訂対象        S-1(SQLite 非実体化) + 統合パッケージ要件
 *
 * 改訂履歴:
 *   v3.0.4   2026-05-05  Y.Toyoda  新規作成(HTTP 委譲、疎通確認)
 *   v3.0.5   2026-05-10  Y.Toyoda  API-06 パスを修正
 *   v3.0.6   2026-05-11  Y.Toyoda  v4.0a-rev3 反映:listFavorites 等を本実装化
 *   v3.0.6+  2026-05-12  Y.Toyoda  ★統合パッケージ★ backendMode で MAIN/TEST 切替
 *
 * @author  Y.Toyoda
 * @version v3.0.6+integration
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

  /* ============================================================
   *  backendMode 判定とパス選択
   *
   *  MAIN モード(カゥン氏 library-backend):
   *    /api/users/login
   *    /api/users/logout
   *    /api/users/:userId
   *    /api/users/:userId/reservations/active
   *    /api/books/search
   *    /api/users/:userId/favorites           (Tbackend にもあり)
   *    ※ MAIN は favorites/notifications 未実装。fetch 失敗時は空配列で返す。
   *
   *  TEST モード(豊田 library-Tbackend):
   *    /api/users/login        (互換)
   *    /api/users/logout       (互換)
   *    /api/users/:userId/reservations/active
   *    /api/books/search
   *    /api/users/:userId/favorites
   *    /api/users/:userId/favorites/:fid
   *    /api/users/:userId/notifications
   *    /api/users/:userId/notifications/read-all
   *    /api/users/:userId/notifications/:nid/read
   *    /api/v1/health
   * ============================================================ */

  function _mode() {
    if (window.ConfigManager && typeof ConfigManager.getBackendMode === "function") {
      return ConfigManager.getBackendMode();
    }
    return "MAIN";
  }

  /**
   * _path
   * MAIN/TEST どちらも実 backend は /api/users/* と /api/books/* を提供する。
   * (v2 で作成した library-Tbackend は MAIN 互換 + 拡張 API)
   * よって基本は同一パスでよく、health のみ TEST 専用となる。
   */
  function _path(name, params) {
    const p = params || {};
    switch (name) {
      case "login":             return "/api/users/login";
      case "logout":            return "/api/users/logout";
      case "activeReservations":
        return "/api/users/" + encodeURIComponent(p.userId) + "/reservations/active";
      case "booksSearch":       return "/api/books/search";
      case "userById":          return "/api/users/" + encodeURIComponent(p.userId);
      // favorites(TEST のみ実装、MAIN は 404 になる想定)
      case "favoritesList":
        return "/api/users/" + encodeURIComponent(p.userId) + "/favorites";
      case "favoritesAdd":
        return "/api/users/" + encodeURIComponent(p.userId) + "/favorites";
      case "favoritesRemove":
        return "/api/users/" + encodeURIComponent(p.userId) +
               "/favorites/" + encodeURIComponent(p.favoriteId);
      // notifications(TEST のみ実装)
      case "notifList":
        return "/api/users/" + encodeURIComponent(p.userId) + "/notifications";
      case "notifMarkRead":
        return "/api/users/" + encodeURIComponent(p.userId) +
               "/notifications/" + encodeURIComponent(p.notificationId) + "/read";
      case "notifMarkAllRead":
        return "/api/users/" + encodeURIComponent(p.userId) + "/notifications/read-all";
      case "health":            return "/api/v1/health";
      default: return "/";
    }
  }

  /**
   * ping
   * /api/v1/health に GET して server/ の存在を確認する。
   * TEST モード では Tbackend が応答、MAIN モードでは 404 を返すが
   * fetch 自体は成功するため、available は両モードで true 扱いする。
   *
   * @returns {Promise<boolean>}
   */
  function ping() {
    if (_pingPromise) return _pingPromise;
    _pingPromise = new Promise(resolve => {
      const controller = (typeof AbortController !== "undefined") ? new AbortController() : null;
      const timer = setTimeout(() => {
        if (controller) controller.abort();
        // タイムアウト時はサーバが居ない=利用不可
        _available = false;
        resolve(false);
      }, 2000);
      const opts = { method: "GET", credentials: "same-origin" };
      if (controller) opts.signal = controller.signal;

      // health は TEST 専用。MAIN モードでは login エンドポイントの GET で
      // 405 や 404 が返ることでサーバ存在を確認する。
      const target = _mode() === "TEST" ? "/api/v1/health" : "/api/users/login";

      fetch(target, opts)
        .then(r => {
          clearTimeout(timer);
          // 404/405 でも「サーバ自体は応答した」とみなす
          _available = true;
          _log("info", "ApiAdapter.ping",
               "server reachable (mode=" + _mode() + ", status=" + r.status + ")");
          resolve(true);
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
   *  IRepository 契約実装
   *  MAIN/TEST 両方で同じレスポンス形式を返すよう正規化する。
   * ============================================================ */

  /** ログイン (POST /api/users/login) */
  async function findUser(userCode, userName) {
    const body = { userId: userCode, userName: userName };
    const r = await ApiClient.post(_path("login"), body);
    // MAIN: { userId, userName } を直接返す
    // TEST: { userId, userName } を直接返す(MAIN 互換実装)
    if (r && (r.userId !== undefined || (r.result === "success" && r.data))) {
      const data = r.userId !== undefined ? r : (r.data && r.data.user) || r.data;
      if (data && data.userId !== undefined) {
        return { userId: data.userId, userName: data.userName, role: "STUDENT" };
      }
    }
    return null;
  }

  /** 有効予約一覧 (GET /api/users/:userId/reservations/active) */
  async function getActiveReservations(userId) {
    const r = await ApiClient.get(_path("activeReservations", { userId }));
    if (!r) return [];
    // 共通: { count, reservations: [...] }
    return r.reservations || (r.data && r.data.reservations) || [];
  }

  async function getReservationCount(userId) {
    const list = await getActiveReservations(userId);
    return Array.isArray(list) ? list.length : 0;
  }

  /** 書籍検索 (GET /api/books/search) */
  async function searchBooks(criteria) {
    const c = criteria || {};
    const params = new URLSearchParams();
    if (c.title)    params.set("title", c.title);
    if (c.author)   params.set("author", c.author);
    if (c.category) params.set("category", c.category);
    if (c.sort)     params.set("sort", c.sort);
    if (c.page !== undefined)     params.set("page", c.page);
    if (c.pageSize !== undefined) params.set("pageSize", c.pageSize);
    const r = await ApiClient.get(_path("booksSearch") + "?" + params.toString());
    if (!r) return [];
    return r.books || (r.data && r.data.books) || [];
  }

  /** 予約登録(両 backend で未実装) */
  async function reserveBook(userId, bookId) {
    return {
      result: "error", messageCode: "E10",
      message: "予約登録 API は現在 backend に未実装です。"
    };
  }

  /** 予約取消(両 backend で未実装) */
  async function cancelReservation(userId, reservationId) {
    return {
      result: "error", messageCode: "E10",
      message: "予約取消 API は現在 backend に未実装です。"
    };
  }

  /** マイページ集約(両 backend で個別取得して合成) */
  async function getMyPageData(userId) {
    try {
      const [reservations, favorites, notifications] = await Promise.all([
        getActiveReservations(userId),
        listFavoritesArray(userId),
        getNotifications(userId)
      ]);
      return {
        currentReservations: reservations,
        history: [],
        favorites: favorites,
        notifications: notifications
      };
    } catch (e) {
      _log("warn", "ApiAdapter.getMyPageData", "fallback empty: " + e.message);
      return { currentReservations: [], history: [], favorites: [], notifications: [] };
    }
  }

  /** 通知一覧(MAIN は未実装→空配列で返す、TEST は実装) */
  async function getNotifications(userId) {
    if (_mode() !== "TEST") return [];
    const r = await ApiClient.get(_path("notifList", { userId }));
    if (!r) return [];
    return r.notifications || (r.data && r.data.notifications) || [];
  }

  /** 通知既読化(TEST のみ動作) */
  async function markNotificationRead(userId, notificationId) {
    if (_mode() !== "TEST") {
      return { result: "error", messageCode: "E10", message: "MAIN モードでは未実装。" };
    }
    const r = await ApiClient.post(
      _path("notifMarkRead", { userId, notificationId }), {});
    return r;
  }

  /** お気に入り一覧(配列で返す内部 helper) */
  async function listFavoritesArray(userId) {
    if (_mode() !== "TEST") return [];
    const r = await ApiClient.get(_path("favoritesList", { userId }));
    if (!r) return [];
    return r.favorites || (r.data && r.data.favorites) || [];
  }

  /** お気に入り一覧(オリジナル API 互換、レスポンス全体を返す) */
  async function listFavorites(userId, opts) {
    if (_mode() !== "TEST") {
      return { result: "success", count: 0, favorites: [] };
    }
    const r = await ApiClient.get(_path("favoritesList", { userId }));
    return r || { result: "success", count: 0, favorites: [] };
  }

  /** お気に入り追加(TEST のみ動作。W19 重複は code:W19 で返る) */
  async function addFavorite(userId, bookId) {
    if (_mode() !== "TEST") {
      return { result: "error", messageCode: "E10", message: "MAIN モードでは未実装。" };
    }
    const r = await ApiClient.post(
      _path("favoritesAdd", { userId }), { bookId: Number(bookId) });
    return r;
  }

  /** お気に入り削除(TEST のみ動作) */
  async function removeFavorite(userId, favoriteId) {
    if (_mode() !== "TEST") {
      return { result: "error", messageCode: "E10", message: "MAIN モードでは未実装。" };
    }
    const r = await ApiClient.delete(_path("favoritesRemove", { userId, favoriteId }));
    return r;
  }

  /** 以下、未対応メソッドの簡易スタブ(契約遵守用) */
  async function exportAll()              { return "{}"; }
  async function importAll()              { return { success: false, messageCode: "E10", message: "未対応。" }; }
  async function resetToSeed()            { /* 管理者専用、未実装 */ }
  async function handleLoanEvent()        { return { result: "error", messageCode: "E10", message: "未実装。" }; }
  async function writeAuditLog()          { /* server 側で自動記録される想定 */ }
  async function findBookById(bookId)     {
    // どちらの backend も /api/books/:id を実装していないため検索で代替
    const list = await searchBooks({ title: "", page: 0, pageSize: 100 });
    return (list || []).find(b => String(b.bookId) === String(bookId)) || null;
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
 * 起動時:dbType=SQLite なら ping を試みる(MAIN/TEST 問わず)
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
