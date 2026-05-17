/*
 * READABLE-CODE REVIEW NOTE
 * 対象ファイル: frontend/js/datasource/api-adapter.js
 * 責務: IRepository 契約の実装。Excel/localStorage、SQLite、HTTP API などの保存先差分を吸収する。
 * 保守メモ: 戻り値形式を画面が期待する ViewModel に正規化すること。特に actionState/canReserve は予約ボタン制御に直結する。
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
 *                MAIN ⇒ library-backend (正本)       /api/v1/*
 *                TEST ⇒ library-Tbackend (テスト)   /api/users/* /api/books/*
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

  function _mode() {
    if (window.ConfigManager && typeof ConfigManager.getBackendMode === "function") {
      return ConfigManager.getBackendMode();
    }
    return "MAIN";
  }

  function _isMain() { return _mode() === "MAIN"; }

  function _apiPrefix() {
    return _isMain() ? "/api/v1" : "/api";
  }

  /**
   * _path
   * MAIN は library-backend の /api/v1/*、TEST は library-Tbackend の
   * /api/users・/api/books 系を使用する。パス差分をここに閉じ込め、
   * 画面・Service 層に backendMode の分岐を漏らさない。
   */
  function _path(name, params) {
    const p = params || {};
    const prefix = _apiPrefix();
    switch (name) {
      case "login":
        return _isMain() ? prefix + "/auth/login" : prefix + "/users/login";
      case "logout":
        return _isMain() ? prefix + "/auth/logout" : prefix + "/users/logout";
      case "activeReservations":
        return prefix + "/users/" + encodeURIComponent(p.userId) + "/reservations/active";
      case "booksSearch":
        return prefix + "/books/search";
      case "bookById":
        return prefix + "/books/" + encodeURIComponent(p.bookId);
      case "bookCategories":
        return prefix + "/books/categories";
      case "reserveBook":
        return prefix + "/reservations";
      case "cancelReservation":
        return prefix + "/users/" + encodeURIComponent(p.userId) +
               "/reservations/" + encodeURIComponent(p.reservationId);
      case "userById":
        return prefix + "/users/" + encodeURIComponent(p.userId);
      case "favoritesList":
      case "favoritesAdd":
        return prefix + "/users/" + encodeURIComponent(p.userId) + "/favorites";
      case "favoritesRemove":
        return prefix + "/users/" + encodeURIComponent(p.userId) +
               "/favorites/" + encodeURIComponent(p.favoriteId);
      case "notifList":
        return prefix + "/users/" + encodeURIComponent(p.userId) + "/notifications";
      case "notifMarkRead":
        return prefix + "/users/" + encodeURIComponent(p.userId) +
               "/notifications/" + encodeURIComponent(p.notificationId) + "/read";
      case "notifMarkAllRead":
        return prefix + "/users/" + encodeURIComponent(p.userId) + "/notifications/read-all";
      case "mypage":
        return prefix + "/users/" + encodeURIComponent(p.userId) + "/mypage";
      case "health":
        return "/api/v1/health";
      default:
        return "/";
    }
  }

  function _payload(response) {
    return (response && response.data && typeof response.data === "object")
      ? response.data
      : (response || {});
  }

  function _normalizeBook(raw) {
    const book = raw || {};
    const actionState = book.actionState || (book.isDisabled ? "DISABLED" : "AVAILABLE");
    const canReserve = book.canReserve !== undefined
      ? Boolean(book.canReserve)
      : (actionState === "AVAILABLE" || actionState === "ON_LOAN");
    const status = book.status || ({
      AVAILABLE: "在庫あり",
      ON_LOAN: "貸出中",
      RESERVED: "予約中",
      DISABLED: "利用不可"
    })[actionState] || "不明";
    const actionLabel = book.actionLabel || (canReserve ? "予約する" : status);

    return Object.assign({}, book, {
      bookId: String(book.bookId),
      status,
      actionState,
      actionLabel,
      canReserve,
      dueDate: book.dueDate || null
    });
  }

  function _normalizeReservation(raw) {
    const r = raw || {};
    return Object.assign({}, r, {
      reservationId: r.reservationId !== undefined ? String(r.reservationId) : r.reservationId,
      bookId: r.bookId !== undefined ? String(r.bookId) : r.bookId
    });
  }

  function _serviceResult(response, fallbackOk, fallbackError) {
    if (!response) {
      return { success: false, messageCode: "E10", message: fallbackError || "処理に失敗しました。" };
    }
    if (response.result === "success") {
      return {
        success: true,
        messageCode: response.messageCode || "I00",
        message: response.message || fallbackOk || "処理しました。",
        payload: response.data || {}
      };
    }
    if (response.success === true || response.ok === true) {
      return response;
    }
    return {
      success: false,
      messageCode: response.messageCode || "E10",
      message: response.message || response.error || fallbackError || "処理に失敗しました。"
    };
  }

  /** /api/v1/health が 2xx を返す場合のみ API 利用可能と判定する。 */
  function ping() {
    if (_pingPromise) return _pingPromise;
    _pingPromise = new Promise(resolve => {
      const controller = (typeof AbortController !== "undefined") ? new AbortController() : null;
      const timer = setTimeout(() => {
        if (controller) controller.abort();
        _available = false;
        resolve(false);
      }, 2000);
      const opts = { method: "GET", credentials: "same-origin" };
      if (controller) opts.signal = controller.signal;

      fetch(_path("health"), opts)
        .then(r => {
          clearTimeout(timer);
          _available = !!(r && r.ok);
          _log(_available ? "info" : "warn", "ApiAdapter.ping",
               "health status=" + (r && r.status) + " mode=" + _mode());
          resolve(_available);
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

  async function findUser(userCode, userName) {
    const r = await ApiClient.post(_path("login"), { userId: userCode, userName: userName });
    const data = _payload(r);
    if (data && data.userId !== undefined) {
      return { userId: data.userId, userName: data.userName, role: data.role || "STUDENT" };
    }
    if (data && data.user && data.user.userId !== undefined) {
      return { userId: data.user.userId, userName: data.user.userName, role: data.user.role || "STUDENT" };
    }
    return null;
  }

  async function getActiveReservations(userId) {
    const r = await ApiClient.get(_path("activeReservations", { userId }));
    const data = _payload(r);
    return (data.reservations || []).map(_normalizeReservation);
  }

  async function getReservationCount(userId) {
    const list = await getActiveReservations(userId);
    return Array.isArray(list) ? list.length : 0;
  }

  async function searchBooks(criteria) {
    const c = criteria || {};
    const params = new URLSearchParams();
    if (c.title)    params.set("title", c.title);
    if (c.author)   params.set("author", c.author);
    if (c.category) params.set("category", c.category);
    if (c.sort)     params.set("sort", c.sort);
    if (c.page !== undefined)     params.set("page", c.page);
    if (c.pageSize !== undefined) params.set("pageSize", c.pageSize);
    if (c.availableOnly)  params.set("availableOnly", "true");
    if (c.reservableOnly) params.set("reservableOnly", "true");

    const r = await ApiClient.get(_path("booksSearch") + "?" + params.toString());
    if (!r || r.result === "error") return r || [];

    const data = _payload(r);
    let books = (data.books || []).map(_normalizeBook);
    if (c.availableOnly)  books = books.filter(b => b.actionState === "AVAILABLE");
    if (c.reservableOnly) books = books.filter(b => b.canReserve === true);

    const count = (c.availableOnly || c.reservableOnly)
      ? books.length
      : (Number.isFinite(Number(data.count)) ? Number(data.count) : books.length);
    const pageSize = Number(data.pageSize || c.pageSize || books.length || 1);
    const totalPages = (c.availableOnly || c.reservableOnly)
      ? Math.max(1, Math.ceil(count / pageSize))
      : (Number(data.totalPages) || Math.max(1, Math.ceil(count / pageSize)));

    return {
      result: "success",
      count,
      page: Number(data.page || c.page || 0),
      pageSize,
      totalPages,
      books
    };
  }

  async function getCategories() {
    const r = await ApiClient.get(_path("bookCategories"));
    if (!r || r.result === "error") return [];
    const data = _payload(r);
    return data.categories || r.categories || [];
  }

  async function reserveBook(userId, bookId) {
    const r = await ApiClient.post(_path("reserveBook", { userId }), { bookId: Number(bookId) || bookId });
    return _serviceResult(r, "予約しました。", "予約処理に失敗しました。");
  }

  async function cancelReservation(userId, reservationId) {
    const r = await ApiClient.delete(_path("cancelReservation", { userId, reservationId }));
    return _serviceResult(r, "予約をキャンセルしました。", "取消処理に失敗しました。");
  }

  async function getMyPageData(userId) {
    if (_isMain()) {
      const r = await ApiClient.get(_path("mypage", { userId }));
      const data = _payload(r);
      if (data && (data.currentReservations || data.history || data.favorites || data.notifications)) {
        return data;
      }
    }
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

  async function getNotifications(userId) {
    const r = await ApiClient.get(_path("notifList", { userId }));
    if (!r || r.result === "error") return [];
    const data = _payload(r);
    return data.notifications || r.notifications || [];
  }

  async function markNotificationRead(userId, notificationId) {
    const r = await ApiClient.post(_path("notifMarkRead", { userId, notificationId }), {});
    return _serviceResult(r, "通知を既読にしました。", "既読化に失敗しました。");
  }

  async function listFavoritesArray(userId) {
    const r = await ApiClient.get(_path("favoritesList", { userId }));
    if (!r || r.result === "error") return [];
    const data = _payload(r);
    return data.favorites || r.favorites || [];
  }

  async function listFavorites(userId, opts) {
    const r = await ApiClient.get(_path("favoritesList", { userId }));
    return r || { result: "success", count: 0, favorites: [] };
  }

  async function addFavorite(userId, bookId) {
    const r = await ApiClient.post(_path("favoritesAdd", { userId }), { bookId: Number(bookId) || bookId });
    return _serviceResult(r, "お気に入りに追加しました。", "お気に入り追加に失敗しました。");
  }

  async function removeFavorite(userId, favoriteId) {
    const r = await ApiClient.delete(_path("favoritesRemove", { userId, favoriteId }));
    return _serviceResult(r, "お気に入りから削除しました。", "お気に入り削除に失敗しました。");
  }

  async function exportAll()              { return "{}"; }
  async function importAll()              { return { success: false, messageCode: "E10", message: "未対応。" }; }
  async function resetToSeed()            { /* 管理者専用、未実装 */ }
  async function handleLoanEvent()        { return { result: "error", messageCode: "E10", message: "未実装。" }; }
  async function writeAuditLog()          { /* server 側で自動記録される想定 */ }
  async function findBookById(bookId)     {
    const r = await ApiClient.get(_path("bookById", { bookId }));
    if (r && r.result !== "error") {
      const data = _payload(r);
      const book = data.book || data;
      if (book && book.bookId !== undefined) return _normalizeBook(book);
    }
    const list = await searchBooks({ title: "", page: 0, pageSize: 100 });
    return (list.books || list || []).find(b => String(b.bookId) === String(bookId)) || null;
  }

  return Object.freeze({
    ping, isAvailable,
    findUser,
    getActiveReservations, getReservationCount,
    searchBooks, getCategories,
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
 * 起動時: dbType=SQLite の場合は health check を試みる。
 * ConfigManager.init() 完了後の確実な初期化は app.js 側でも行う。
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
