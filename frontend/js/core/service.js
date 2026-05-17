/*
 * READABLE-CODE REVIEW NOTE
 * 対象ファイル: frontend/js/core/service.js
 * 責務: フロントエンド共通基盤。設定、ルーティング、サービス境界、ログ、UI共通処理を担当する。
 * 保守メモ: 画面層とデータソース層を結合しすぎないこと。非同期 API を導入する場合は Service 契約を先に揃える。
 */
/*
 * =============================================================================
 * ファイル名 : js/core/service.js
 * 概要       : 業務サービス層（Service）。Screen と Repository を仲介する。
 *              v3.0 で全関数 JSDoc 完全形 + トレーサビリティ + セッション期限化。
 *
 * 仕様書トレーサビリティ:
 *   - 外部仕様書 v3.0  §8 API一覧（API-01〜API-10）/ §8.2.1 四層構造
 *   - 内部仕様書 v3.0  AU01 / RV01〜RV03 / SR01〜SR04 / MP01 / LN01
 *   - 要求仕様書 v3.0  RF-01〜RF-14
 *   - テスト仕様 v3.0  TC-LOG-* / TC-STA-* / TC-SRH-* / TC-RES-* / TC-MYP-*
 *   - ADR-006 認証方式 / ADR-016 用語統一
 *   - 議事録          P4-05（API契約）/ P4-12（セッション期限）/ BUG-09
 *
 * 改訂履歴:
 *   v1.0  2026-04-15  Y.Toyoda  v2.x 初版
 *   v3.0  2026-05-04  Y.Toyoda  全面書き換え
 *                                - セッション期限 30 分実装（BUG-09）
 *                                - makeOk/makeErr ラッパー導入（P4-05）
 *                                - 全関数 JSDoc 完全形
 *                                - Logger 連携
 *
 * @author  Y.Toyoda
 * @version v3.0
 * =============================================================================
 */
"use strict";

const Service = (() => {

  const SESSION_KEY = "lib-session";

  function _repo() {
    return (window.RepositoryFactory && RepositoryFactory.create()) || null;
  }

  function makeOk(messageCode, message, payload) {
    return { success: true, messageCode, message, payload: payload || {} };
  }

  function makeErr(messageCode, message) {
    return { success: false, messageCode, message };
  }

  function _isPromiseLike(value) {
    return value && typeof value.then === "function";
  }

  async function _callRepo(methodName, args, fallbackValue) {
    const repo = _repo();
    if (!repo || typeof repo[methodName] !== "function") return fallbackValue;
    try {
      return await repo[methodName].apply(repo, args || []);
    } catch (e) {
      if (window.Logger) Logger.error("Service." + methodName, e.message, { stack: e.stack });
      return fallbackValue;
    }
  }

  function _toServiceResult(raw, okMessage, errMessage) {
    if (!raw) return makeErr("E10", errMessage || "処理に失敗しました。");
    if (raw.success === true) {
      return raw;
    }
    if (raw.success === false) {
      return makeErr(raw.messageCode || "E10", raw.message || errMessage || "処理に失敗しました。");
    }
    if (raw.ok === true) {
      return makeOk(raw.messageCode || "I00", raw.message || okMessage || "処理しました。", raw.data || raw.payload || {});
    }
    if (raw.ok === false) {
      return makeErr(raw.messageCode || "E10", raw.message || errMessage || "処理に失敗しました。");
    }
    if (raw.result === "success") {
      return makeOk(raw.messageCode || "I00", raw.message || okMessage || "処理しました。", raw.data || {});
    }
    if (raw.result === "error") {
      return makeErr(raw.messageCode || "E10", raw.message || errMessage || "処理に失敗しました。");
    }
    return makeOk(raw.messageCode || "I00", raw.message || okMessage || "処理しました。", raw.data || raw.payload || raw);
  }

  function _asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function _buildMyPageSummary(data) {
    const currentReservations = _asArray(data.currentReservations);
    const history = _asArray(data.history);
    const favorites = _asArray(data.favorites);
    const notifications = _asArray(data.notifications);
    const summary = data.summary || {};
    return Object.assign({}, data, {
      currentReservations,
      history,
      favorites,
      notifications,
      summary: {
        reservationCount: Number.isFinite(Number(summary.reservationCount))
          ? Number(summary.reservationCount) : currentReservations.length,
        historyCount: Number.isFinite(Number(summary.historyCount))
          ? Number(summary.historyCount) : history.length,
        favoritesCount: Number.isFinite(Number(summary.favoritesCount))
          ? Number(summary.favoritesCount) : favorites.length,
        unreadNotifCount: Number.isFinite(Number(summary.unreadNotifCount))
          ? Number(summary.unreadNotifCount) : notifications.filter(n => !n.isRead).length
      }
    });
  }

  /* ============== セッション管理（RF-01 / RF-02 / API-01） ============== */

  async function authenticate(userId, userName) {
    const sUid = String(userId  || "").trim();
    const sNam = String(userName || "").trim();
    if (!sUid || !sNam) {
      return makeErr("E01", "利用者ID と利用者名を入力してください。");
    }

    const user = await _callRepo("findUser", [sUid, sNam], null);
    if (!user) {
      await _callRepo("writeAuditLog", ["LOGIN_FAILED", "WARN", sUid, "認証失敗"], undefined);
      return makeErr("W01", "利用者IDまたは利用者名が一致しません。");
    }

    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      userId:   String(user.userId),
      userName: user.userName,
      loginAt:  new Date().toISOString()
    }));
    await _callRepo("writeAuditLog", ["LOGIN_SUCCESS", "INFO", user.userId, "ログイン成功"], undefined);
    if (window.Logger) Logger.info("Service.authenticate", "ログイン成功", { userId: sUid });
    const r = makeOk("I01", "ログインしました。", { user });
    r.user = user;
    return r;
  }

  function getSession() {
    try {
      const s = JSON.parse(sessionStorage.getItem(SESSION_KEY));
      if (!s || !s.userId) return null;
      const timeoutMin = (window.ConfigManager && Number(ConfigManager.get("sessionTimeoutMinutes"))) || 30;
      const loginAt = new Date(s.loginAt).getTime();
      const ageMin = (Date.now() - loginAt) / 60000;
      if (ageMin > timeoutMin) {
        sessionStorage.removeItem(SESSION_KEY);
        if (window.Logger) Logger.warn("Service.getSession", "セッション期限切れ", { ageMin });
        return null;
      }
      return s;
    } catch { return null; }
  }

  async function logout() {
    const s = getSession();

    // 呼び出し側が await しない場合でも、画面上のログアウト状態は即時に反映する。
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem("lib-last-action");
    sessionStorage.removeItem("lib-search-criteria");

    if (s) await _callRepo("writeAuditLog", ["LOGOUT", "INFO", s.userId, "ログアウト"], undefined);
    if (window.Logger) Logger.info("Service.logout", "ログアウト完了");
  }

  /* ============== 予約状況（RV01 / API-02） ============== */

  async function getDashboard(userId) {
    const maxRes = (window.ConfigManager && Number(ConfigManager.get("maxReservations"))) || 3;
    const reservations = _asArray(await _callRepo("getActiveReservations", [userId], []));
    const count = reservations.length;
    const remaining = Math.max(0, maxRes - count);
    const nextDeadline = reservations
      .filter(r => r.pickupDeadline)
      .map(r => r.pickupDeadline).sort()[0] || null;
    const reservedCount = reservations.filter(r => r.status === "RESERVED").length;
    const waitingCount  = reservations.filter(r => r.status === "WAITING").length;
    return { reservations, count, maxRes, remaining, nextDeadline, reservedCount, waitingCount };
  }

  /* ============== 検索（SR01〜SR04 / API-03） ============== */

  function normalizeSearchCriteria(raw) {
    return {
      title:          String(raw.title    || "").trim(),
      author:         String(raw.author   || "").trim(),
      category:       String(raw.category || "").trim(),
      sort:           String(raw.sort     || "bookId").trim(),
      availableOnly:  Boolean(raw.availableOnly),
      reservableOnly: Boolean(raw.reservableOnly),
      viewerUserId:   (getSession() || {}).userId || ""
    };
  }

  function _isAllEmpty(c) { return !c.title && !c.author && !c.category; }

  function _applyClientSideResultFilters(books, criteria) {
    let result = _asArray(books);
    if (criteria.availableOnly)  result = result.filter(v => v.actionState === "AVAILABLE");
    if (criteria.reservableOnly) result = result.filter(v => v.canReserve === true);
    return result;
  }

  async function searchBooks(rawCriteria, page, pageSize) {
    const criteria = normalizeSearchCriteria(rawCriteria || {});
    const cfgPageSize = (window.ConfigManager && Number(ConfigManager.get("searchPageSize"))) || 10;
    const pSize = Number.isFinite(Number(pageSize)) && Number(pageSize) > 0
      ? Number(pageSize) : cfgPageSize;
    const pNum = Number.isFinite(Number(page)) && Number(page) >= 0
      ? Number(page) : 0;

    if (_isAllEmpty(criteria) && !criteria.availableOnly && !criteria.reservableOnly) {
      return {
        result: "error", messageCode: "W16",
        message: "検索条件を 1 つ以上入力してください。",
        count: 0, page: 0, pageSize: pSize, totalPages: 1, books: []
      };
    }

    const repoCriteria = Object.assign({}, criteria, { page: pNum, pageSize: pSize });
    const raw = await _callRepo("searchBooks", [repoCriteria], []);

    if (raw && raw.result === "error") {
      return {
        result: "error",
        messageCode: raw.messageCode || "E10",
        message: raw.message || "検索に失敗しました。",
        count: 0, page: 0, pageSize: pSize, totalPages: 1, books: []
      };
    }

    // HTTP API アダプタはサーバ側ページング済み SearchResponse を返す。
    if (raw && !Array.isArray(raw) && Array.isArray(raw.books)) {
      const books = raw.books;
      const count = Number.isFinite(Number(raw.count)) ? Number(raw.count) : books.length;
      const totalPages = Number.isFinite(Number(raw.totalPages)) && Number(raw.totalPages) > 0
        ? Number(raw.totalPages) : Math.max(1, Math.ceil(count / pSize));
      const safePage = Math.max(0, Math.min(Number(raw.page) || 0, totalPages - 1));
      await _callRepo("writeAuditLog", ["SEARCH", "INFO", (getSession() || {}).userId || "(anon)",
        `count=${count} page=${safePage} title=${criteria.title} author=${criteria.author}`], undefined);
      return { result: "success", count, page: safePage,
               pageSize: Number(raw.pageSize) || pSize, totalPages, books };
    }

    const all = _applyClientSideResultFilters(raw, criteria);
    const count = all.length;
    const totalPages = Math.max(1, Math.ceil(count / pSize));
    const safePage = Math.max(0, Math.min(pNum, totalPages - 1));
    const books = all.slice(safePage * pSize, (safePage + 1) * pSize);

    await _callRepo("writeAuditLog", ["SEARCH", "INFO", (getSession() || {}).userId || "(anon)",
      `count=${count} page=${safePage} title=${criteria.title} author=${criteria.author}`], undefined);

    return { result: "success", count, page: safePage, pageSize: pSize, totalPages, books };
  }

  async function getCategories() {
    const categories = await _callRepo("getCategories", [], null);
    if (Array.isArray(categories) && categories.length) return categories;
    // リポジトリが未対応の場合でも詳細検索が機能するよう、seed/DB で使う分類値を既定値にする。
    return ["文芸", "情報科学", "生活", "法律", "学術", "福祉"];
  }

  /* ============== 予約 / 取消（API-04 / API-05） ============== */

  async function reserveBook(bookId) {
    const s = getSession();
    if (!s) return makeErr("E09", "セッションが切れています。再ログインしてください。");
    const raw = await _callRepo("reserveBook", [s.userId, bookId], null);
    return _toServiceResult(raw, "予約しました。", "予約処理に失敗しました。");
  }

  async function cancelReservation(reservationId) {
    const s = getSession();
    if (!s) return makeErr("E09", "セッションが切れています。再ログインしてください。");
    const raw = await _callRepo("cancelReservation", [s.userId, reservationId], null);
    return _toServiceResult(raw, "予約をキャンセルしました。", "取消処理に失敗しました。");
  }

  /* ============== マイページ / 通知 / お気に入り（API-06） ============== */

  async function getMyPageData() {
    const s = getSession();
    if (!s) {
      return _buildMyPageSummary({ currentReservations: [], history: [], favorites: [], notifications: [] });
    }
    const data = await _callRepo("getMyPageData", [s.userId],
      { currentReservations: [], history: [], favorites: [], notifications: [] });
    return _buildMyPageSummary(data || {});
  }

  async function getNotifications() {
    const s = getSession();
    return s ? _asArray(await _callRepo("getNotifications", [s.userId], [])) : [];
  }

  async function markNotificationRead(notificationId) {
    const s = getSession();
    if (!s) return false;
    const raw = await _callRepo("markNotificationRead", [s.userId, notificationId], false);
    if (raw === true || raw === false) return raw;
    return raw && (raw.success === true || raw.ok === true || raw.result === "success");
  }

  async function addFavorite(bookId) {
    const s = getSession();
    if (!s) return false;
    const raw = await _callRepo("addFavorite", [s.userId, bookId], false);
    if (raw === true || raw === false) return raw;
    return raw && (raw.success === true || raw.ok === true || raw.result === "success");
  }

  async function removeFavorite(bookId) {
    const s = getSession();
    if (!s) return false;
    const raw = await _callRepo("removeFavorite", [s.userId, bookId], false);
    if (raw === true || raw === false) return raw;
    return raw && (raw.success === true || raw.ok === true || raw.result === "success");
  }

  /* ============== ブリッジ・貸出連携（API-07/08/09/10） ============== */

  async function bridgeExport()        { return await _callRepo("exportAll", [], "{}"); }
  async function bridgeImport(jsonStr) {
    const raw = await _callRepo("importAll", [jsonStr], null);
    return _toServiceResult(raw, "取込が完了しました。", "取込に失敗しました。");
  }
  async function bridgeReset() {
    await _callRepo("resetToSeed", [], undefined);
    return makeOk("I09", "初期データに戻しました。");
  }
  async function handleLoanEvent(ev) {
    const raw = await _callRepo("handleLoanEvent", [ev], null);
    return _toServiceResult(raw, "OK", "貸出連携に失敗しました。");
  }

  async function getBookById(bookId) {
    if (bookId === null || bookId === undefined) return null;
    const repo = _repo();
    if (repo && typeof repo.findBookById === "function") {
      const found = await repo.findBookById(bookId);
      if (found) return found;
    }
    try {
      const list = JSON.parse(localStorage.getItem("lib-books") || "[]");
      return list.find(b => String(b.bookId) === String(bookId)) || null;
    } catch (_) {
      return null;
    }
  }

  return Object.freeze({
    authenticate, getSession, logout,
    getDashboard,
    normalizeSearchCriteria, searchBooks, getCategories,
    reserveBook, cancelReservation,
    getMyPageData, getNotifications, markNotificationRead,
    addFavorite, removeFavorite,
    bridgeExport, bridgeImport, bridgeReset, handleLoanEvent,
    getBookById,
    makeOk, makeErr
  });
})();

window.Service = Service;
