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

  /**
   * SESSION_KEY
   * セッション格納キー（sessionStorage）。
   * ※index.html の判定とも完全一致させること（変更時は両方更新）。
   */
  const SESSION_KEY = "lib-session";

  /**
   * _repo
   * 概要 : 現在の dbType に応じた Repository を取得する。
   *        毎呼出でファクトリから取得することで、実行時切替（setDbType）にも追従。
   *
   * @returns {Object} ExcelAdapter | SQLiteStubAdapter
   * @spec    内部仕様 CF03
   */
  function _repo() { return RepositoryFactory.create(); }

  /**
   * makeOk
   * 概要 : 成功 ServiceResult を生成するラッパー（議事録 P4-05）。
   *
   * @param {string} messageCode
   * @param {string} message
   * @param {Object} [payload]
   * @returns {ServiceResult}
   */
  function makeOk(messageCode, message, payload) {
    return { success: true, messageCode, message, payload: payload || {} };
  }

  /**
   * makeErr
   * 概要 : 失敗 ServiceResult を生成するラッパー（議事録 P4-05）。
   *
   * @param {string} messageCode
   * @param {string} message
   * @returns {ServiceResult}
   */
  function makeErr(messageCode, message) {
    return { success: false, messageCode, message };
  }

  /* ============== セッション管理（RF-01 / RF-02 / API-01） ============== */

  /**
   * authenticate（API-01: POST /api/v1/auth/login）
   * 概要 : 利用者IDと利用者名で認証する。成功時セッションを発行。
   *
   * @param {string} userId
   * @param {string} userName
   * @returns {ServiceResult & {user?: Object}}
   * @spec    AU01 / RF-01 / API-01
   *
   * @example
   *   const r = Service.authenticate("1", "佐藤翔太");
   *   if (r.success) navigate("reservation-status");
   */
  function authenticate(userId, userName) {
    const sUid = String(userId  || "").trim();
    const sNam = String(userName || "").trim();
    if (!sUid || !sNam) {
      return makeErr("E01", "利用者ID と利用者名を入力してください。");
    }
    const user = _repo().findUser(sUid, sNam);
    if (!user) {
      _repo().writeAuditLog("LOGIN_FAILED", "WARN", sUid, "認証失敗");
      return makeErr("W01", "利用者IDまたは利用者名が一致しません。");
    }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      userId:   String(user.userId),
      userName: user.userName,
      loginAt:  new Date().toISOString()
    }));
    _repo().writeAuditLog("LOGIN_SUCCESS", "INFO", user.userId, "ログイン成功");
    if (window.Logger) Logger.info("Service.authenticate", "ログイン成功", { userId: sUid });
    const r = makeOk("I01", "ログインしました。", { user });
    r.user = user;
    return r;
  }

  /**
   * getSession
   * 概要 : 現在のセッションを取得する。
   *        ★ BUG-09 / P4-12 反映 ★
   *        loginAt から sessionTimeoutMinutes を超過していたら null を返す。
   *
   * @returns {Object|null}
   * @spec    BUG-09 / 議事録 P4-12
   */
  function getSession() {
    try {
      const s = JSON.parse(sessionStorage.getItem(SESSION_KEY));
      if (!s || !s.userId) return null;

      // セッション期限チェック（30分）
      const timeoutMin = (window.ConfigManager && ConfigManager.get("sessionTimeoutMinutes")) || 30;
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

  /**
   * logout
   * 概要 : ログアウト処理。セッションと関連 sessionStorage をクリアする。
   *
   * @returns {void}
   * @spec    RF-02
   */
  function logout() {
    const s = getSession();
    if (s) _repo().writeAuditLog("LOGOUT", "INFO", s.userId, "ログアウト");
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem("lib-last-action");
    sessionStorage.removeItem("lib-search-criteria");
    if (window.Logger) Logger.info("Service.logout", "ログアウト完了");
  }

  /* ============== 予約状況（RV01 / API-02） ============== */

  /**
   * getDashboard
   * 概要 : 予約状況画面 G02 用の集計データを返す。
   *
   * @param {string} userId
   * @returns {{reservations:Array, count:number, maxRes:number, remaining:number,
   *            nextDeadline:string|null, reservedCount:number, waitingCount:number}}
   * @spec    RV01 / RF-03
   */
  function getDashboard(userId) {
    const maxRes = (window.ConfigManager && Number(ConfigManager.get("maxReservations"))) || 3;
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
   * normalizeSearchCriteria
   * 概要 : 入力検索条件を正規化する（trim, 既定値補完, viewer 注入）。
   *
   * @param {Object} raw 生入力
   * @returns {SearchCriteria}
   * @spec    SR01
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

  /**
   * _isAllEmpty
   * 概要 : 検索条件が全空（W16 判定用）。
   * @param {SearchCriteria} c
   * @returns {boolean}
   */
  function _isAllEmpty(c) { return !c.title && !c.author && !c.category; }

  /**
   * searchBooks（API-03）
   * 概要 : 書籍検索を実行し、外部仕様 §7.2 形式で結果を返す。
   *        全空検索（フラグも未指定）は W16（議事録 P1-09 / BUG-04 反映）。
   *
   * @param {Object} rawCriteria
   * @param {number} [page]
   * @param {number} [pageSize]
   * @returns {SearchResponse}
   * @spec    SR02 + SR03 / RF-05/06 / TC-SRH-04
   */
  function searchBooks(rawCriteria, page, pageSize) {
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

    const all = _repo().searchBooks(criteria);
    const count = all.length;
    const totalPages = Math.max(1, Math.ceil(count / pSize));
    const safePage = Math.max(0, Math.min(pNum, totalPages - 1));
    const books = all.slice(safePage * pSize, (safePage + 1) * pSize);

    _repo().writeAuditLog("SEARCH", "INFO", (getSession() || {}).userId || "(anon)",
      `count=${count} page=${safePage} title=${criteria.title} author=${criteria.author}`);

    return { result: "success", count, page: safePage, pageSize: pSize, totalPages, books };
  }

  /* ============== 予約 / 取消（API-04 / API-05） ============== */

  /**
   * reserveBook
   * @param {string} bookId
   * @returns {ReservationResult}
   * @spec    RV03 / RF-07
   */
  function reserveBook(bookId) {
    const s = getSession();
    if (!s) return makeErr("E09", "セッションが切れています。再ログインしてください。");
    return _repo().reserveBook(s.userId, bookId);
  }

  /**
   * cancelReservation
   * @param {string} reservationId
   * @returns {ServiceResult}
   * @spec    RV02 / RF-08
   */
  function cancelReservation(reservationId) {
    const s = getSession();
    if (!s) return makeErr("E09", "セッションが切れています。再ログインしてください。");
    return _repo().cancelReservation(s.userId, reservationId);
  }

  /* ============== マイページ / 通知 / お気に入り（API-06） ============== */

  /** @spec MP01 / RF-10 */
  function getMyPageData() {
    const s = getSession();
    if (!s) return { currentReservations: [], history: [], favorites: [], notifications: [],
      summary: { reservationCount: 0, historyCount: 0, favoritesCount: 0, unreadNotifCount: 0 } };
    return _repo().getMyPageData(s.userId);
  }

  /** @spec RF-09 */
  function getNotifications() {
    const s = getSession(); return s ? _repo().getNotifications(s.userId) : [];
  }

  /** @spec RF-09 / BUG-V2.0 */
  function markNotificationRead(notificationId) {
    const s = getSession(); return s ? _repo().markNotificationRead(s.userId, notificationId) : false;
  }

  /** @spec RF-10 */
  function addFavorite(bookId) {
    const s = getSession(); return s ? _repo().addFavorite(s.userId, bookId) : false;
  }

  /** @spec RF-10 */
  function removeFavorite(bookId) {
    const s = getSession(); return s ? _repo().removeFavorite(s.userId, bookId) : false;
  }

  /* ============== ブリッジ・貸出連携（API-07/08/09/10） ============== */

  /** @spec RF-11 / API-08 */
  function bridgeExport()        { return _repo().exportAll(); }
  /** @spec RF-11 / API-07 */
  function bridgeImport(jsonStr) { return _repo().importAll(jsonStr); }
  /** @spec RF-11 / API-09 */
  function bridgeReset() {
    _repo().resetToSeed();
    return makeOk("I09", "初期データに戻しました。");
  }
  /** @spec RF-13 / LN01 / API-10 */
  function handleLoanEvent(ev)   { return _repo().handleLoanEvent(ev); }

  /**
   * getBookById（v3.0.3 / B-9 新設）
   * 概要 : Repository 経由で書籍1件を取得する。
   *        画面層からの localStorage 直接参照を排除するためのアクセッサ。
   *        将来 SQLite/API 化時もこの関数の差し替えだけで対応可能。
   *
   * @param {string|number} bookId
   * @returns {Object|null}
   * @spec    RF-04 / SR02 / 改訂対象 B-9
   */
  function getBookById(bookId) {
    if (bookId === null || bookId === undefined) return null;
    const repo = _repo();
    if (repo && typeof repo.findBookById === "function") {
      return repo.findBookById(bookId);
    }
    // フォールバック（既存 ExcelAdapter は findBookById 未実装の可能性あり）
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
    normalizeSearchCriteria, searchBooks,
    reserveBook, cancelReservation,
    getMyPageData, getNotifications, markNotificationRead,
    addFavorite, removeFavorite,
    bridgeExport, bridgeImport, bridgeReset, handleLoanEvent,
    getBookById,            // v3.0.3 / B-9 新設
    makeOk, makeErr
  });
})();

window.Service = Service;
