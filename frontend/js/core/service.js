/*
 * =============================================================================
 * ファイル名 : js/core/service.js
 * 概要       : 業務サービス層（Service）。Screen と Repository を仲介する。
 *
 * 仕様書トレーサビリティ:
 *   - 外部仕様書 §8 API一覧（API-01〜API-10）
 *   - 内部仕様書 AU01 / RV01〜RV03 / SR01〜SR04 / MP01 / LN01
 *   - 要求仕様書 RF-01〜RF-14
 *   - テスト仕様 TC-LOG-* / TC-STA-* / TC-SRH-* / TC-RES-* / TC-MYP-*
 *
 * 重要設計ポイント:
 *   - searchBooks の戻り値は外部仕様§7.2 の正式形式
 *     { result, count, page, pageSize, totalPages, books[] }
 *   - 全空検索（title/author/category がすべて空）は E04（TC-SRH-04）。
 *   - actionState による画面制御を維持（status 値変更で挙動が崩れない）。
 * 作成日 : 2026-04-26
 * =============================================================================
 */
"use strict";

const Service = (() => {

  /** _repo : 現在の dbType に応じた Repository を取得（CF03）。 */
  function _repo() { return RepositoryFactory.create(); }

  /* ============== セッション管理（RF-01 / RF-02 / API-01） ============== */

  /**
   * AU01 - authenticate（API-01: POST /api/auth/login）
   * 概要 : 利用者ID + 利用者名で認証する。
   * 入力 : userId, userName ※trimは内部で実施
   * 出力 : ServiceResult { success, user?, messageCode, message }
   */
  function authenticate(userId, userName) {
    const sUid = String(userId  || "").trim();
    const sNam = String(userName || "").trim();
    if (!sUid || !sNam) {
      return { success: false, messageCode: "E01",
               message: "利用者ID と利用者名を入力してください。" };
    }
    const user = _repo().findUser(sUid, sNam);
    if (!user) {
      _repo().writeAuditLog("LOGIN_FAILED", "WARN", sUid, "認証失敗");
      return { success: false, messageCode: "E01",
               message: "利用者IDまたは利用者名が一致しません。(E01)" };
    }
    sessionStorage.setItem("lib-session", JSON.stringify({
      userId:   String(user.userId),
      userName: user.userName,
      loginAt:  new Date().toISOString()
    }));
    _repo().writeAuditLog("LOGIN_SUCCESS", "INFO", user.userId, "ログイン成功");
    return { success: true, user, messageCode: "I01", message: "ログインしました。" };
  }

  function getSession() {
    try { return JSON.parse(sessionStorage.getItem("lib-session")); }
    catch { return null; }
  }

  function logout() {
    const s = getSession();
    if (s) _repo().writeAuditLog("LOGOUT", "INFO", s.userId, "ログアウト");
    sessionStorage.removeItem("lib-session");
    sessionStorage.removeItem("lib-last-action");
    sessionStorage.removeItem("lib-search-criteria");
  }

  /* ============== 予約状況（RV01 / API-02） ============== */

  /**
   * RV01 - getDashboard
   * 概要 : 予約状況画面 G02 用の集計データ。
   */
  function getDashboard(userId) {
    const maxRes = ConfigManager.get("maxReservations") || 3;
    const reservations = _repo().getActiveReservations(userId);
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

  /**
   * SR01 - normalizeSearchCriteria
   * 概要 : trim・既定値補完・viewer 注入。
   */
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

  /**
   * SR02 + SR03 - searchBooks（API-03）
   * 戻り値（外部仕様§7.2 正式形式）:
   *   { result, messageCode?, message?, count, page, pageSize, totalPages, books[] }
   * 注意 : 全空検索（フラグも未指定）は E04（TC-SRH-04）。
   */
  function searchBooks(rawCriteria, page, pageSize) {
    const criteria = normalizeSearchCriteria(rawCriteria || {});
    const pSize = Number.isInteger(Number(pageSize)) && Number(pageSize) > 0
      ? Number(pageSize)
      : (ConfigManager.get("searchPageSize") || 10);
    const pNum = Number.isInteger(Number(page)) && Number(page) >= 0
      ? Number(page) : 0;

    if (_isAllEmpty(criteria) && !criteria.availableOnly && !criteria.reservableOnly) {
      return {
        result: "error", messageCode: "E04",
        message: "検索条件を 1 つ以上入力してください。",
        count: 0, page: 0, pageSize: pSize, totalPages: 1, books: []
      };
    }

    const all = _repo().searchBooks(criteria);
    const count = all.length;
    const totalPages = Math.max(1, Math.ceil(count / pSize));
    const safePage = Math.max(0, Math.min(pNum, totalPages - 1));
    const books = all.slice(safePage * pSize, (safePage + 1) * pSize);

    _repo().writeAuditLog("SEARCH", "INFO", (getSession() || {}).userId,
      `count=${count} page=${safePage} title=${criteria.title} author=${criteria.author}`);

    return { result: "success", count, page: safePage, pageSize: pSize, totalPages, books };
  }

  /* ============== 予約 / 取消（RV02 / RV03 / API-04 / API-05） ============== */

  function reserveBook(bookId) {
    const s = getSession();
    if (!s) return { success: false, messageCode: "E09",
                     message: "セッションが切れています。再ログインしてください。" };
    return _repo().reserveBook(s.userId, bookId);
  }
  function cancelReservation(reservationId) {
    const s = getSession();
    if (!s) return { success: false, messageCode: "E09",
                     message: "セッションが切れています。再ログインしてください。" };
    return _repo().cancelReservation(s.userId, reservationId);
  }

  /* ============== 通知 / マイページ / お気に入り（API-06） ============== */

  function getMyPageData() {
    const s = getSession();
    if (!s) return { currentReservations: [], history: [], favorites: [], notifications: [],
      summary: { reservationCount: 0, historyCount: 0, favoritesCount: 0, unreadNotifCount: 0 } };
    return _repo().getMyPageData(s.userId);
  }
  function getNotifications() {
    const s = getSession(); return s ? _repo().getNotifications(s.userId) : [];
  }
  function markNotificationRead(notificationId) {
    const s = getSession(); return s ? _repo().markNotificationRead(s.userId, notificationId) : false;
  }
  function addFavorite(bookId) {
    const s = getSession(); return s ? _repo().addFavorite(s.userId, bookId) : false;
  }
  function removeFavorite(bookId) {
    const s = getSession(); return s ? _repo().removeFavorite(s.userId, bookId) : false;
  }

  /* ============== ブリッジ・貸出連携（API-07/08/09/10） ============== */

  function bridgeExport()        { return _repo().exportAll(); }
  function bridgeImport(jsonStr) { return _repo().importAll(jsonStr); }
  function bridgeReset()         { _repo().resetToSeed();
                                   return { success: true, message: "初期データに戻しました。" }; }
  function handleLoanEvent(ev)   { return _repo().handleLoanEvent(ev); }

  return {
    authenticate, getSession, logout,
    getDashboard,
    normalizeSearchCriteria, searchBooks,
    reserveBook, cancelReservation,
    getMyPageData, getNotifications, markNotificationRead,
    addFavorite, removeFavorite,
    bridgeExport, bridgeImport, bridgeReset, handleLoanEvent
  };
})();

window.Service = Service;
