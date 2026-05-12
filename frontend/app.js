/*
 * ============================================================================
 * ファイル名   : app.js
 * 概要         : 図書予約システムの画面制御と業務処理をまとめたメインスクリプト。
 *                設定管理、データアクセス、業務処理、画面制御の 4 つの責務に分離し、
 *                保守性と拡張性を担保するアーキテクチャを採用する。
 *
 *                【2026-05-12 改訂】カゥン氏リポジトリ統合版
 *                - SQLiteRepository を実 API 連動に置換
 *                - シークレット機能(secretMode)で豊田 v3.0.6 拡張を有効化可能
 *                - ON 時はカゥン氏 API + localStorage ハイブリッドで動作
 *                - OFF 時はカゥン氏 API のみで純粋構成案B として動作
 *
 * 作成者       : Y.Toyoda
 * 作成日       : 2026-04-17
 * 最終改訂     : 2026-05-12
 * ============================================================================
 */

"use strict";

/* ============================================================================
 * セクション 0 : 起動時初期化
 * ============================================================================ */

document.addEventListener("DOMContentLoaded", async () => {
  // 1. システム設定を初期化(config ファイルを非同期で読み込む)
  await ConfigManager.init();
  // 2. 現在日付を全画面の対象要素(data-today)へ反映
  setToday();
  // 3. ブラウザ種別を判定してフォームへ反映
  fillBrowserFields();
  // 4. ナビゲーションのアクティブ状態を設定
  setActiveNav();
  // 5. テーブルをレスポンシブ対応に装飾
  decorateResponsiveTables();
  // 6. モバイル用下部ナビゲーションを生成
  buildMobileBottomNav();
  // 7. PC / モバイル切替ウィジェットを設置
  setupViewMode();
  // 8. 非推奨ブラウザ警告を確認し、必要に応じて表示
  checkBrowserWarning();
  // 9. ログインセッションの情報をヘッダーに反映
  applySessionHeader();
  // 10. UI補助操作(入力クリアなど)のイベントを設定する
  wireHelpers();
  // 11. シークレットモード時のインジケーターを描画
  SecretIndicator.render();

  // 12. 現在のページ(data-page属性)に応じて個別の初期化処理を振り分け
  const page = document.body.dataset.page || "";
  switch (page) {
    case "login": Screen.initLogin(); break;
    case "reservation-status": Screen.initReservationStatus(); break;
    case "search-results": Screen.initSearchResults(); break;
    case "advanced-search": Screen.initAdvancedSearch(); break;
    case "notification": Screen.initNotification(); break;
    case "mypage": Screen.initMyPage(); break;
    default: break;
  }
});


/* ============================================================================
 * セクション 1 : ConfigManager
 * 役割：システムの実行条件(DB種別、予約上限、シークレット機能)を一元管理する。
 *
 * 2026-05-12 改訂内容：
 *   - library-system-config.txt を fetch で読み込む非同期 init() に変更
 *   - secretMode と feature.* トグルを評価する isFeatureEnabled() を追加
 *   - 既定値は OFF(安全側)。config ファイルで明示的に ON 指定が必要
 * ============================================================================ */
const ConfigManager = (() => {
  // 内部で保持する設定の既定値
  let _cfg = {
    dbType: "SQLite",
    maxReservations: 3,
    searchPageSize: 10,
    secretMode: false,
    features: {
      favorites: true,
      notifications: true,
      history: true,
      auditLog: true,
      duplicateGuard: true,
      dashboardKpi: true,
      localExport: true
    },
    secretIndicator: true
  };

  /**
   * 概要   : 設定の初期化処理
   *          フォールバック既定値 → config ファイル → localStorage の順で
   *          設定を上書きしていく。config ファイル読込失敗時もフォールバック
   *          で起動可能な構造を維持する。
   * 作成者 : Y.Toyoda
   * 作成日 : 2026-04-17 / 改訂 2026-05-12
   */
  async function init() {
    // ステップ1: グローバルな既定設定(library-config.js)を読み込む
    const fb = window.LIBRARY_CONFIG_FALLBACK || {};
    _cfg.dbType = fb.dbType || "SQLite";
    _cfg.maxReservations = Number(fb.maxReservations) || 3;
    _cfg.searchPageSize = Number(fb.searchPageSize) || 10;
    _cfg.secretMode = Boolean(fb.secretMode);
    _cfg.features = Object.assign({}, _cfg.features, fb.features || {});
    _cfg.secretIndicator = fb.secretIndicator !== false;

    // ステップ2: library-system-config.txt を fetch して上書きする
    try {
      const fileName = fb.configFileName || "library-system-config.txt";
      const res = await fetch(fileName, { cache: "no-store" });
      if (res.ok) {
        const text = await res.text();
        _applyConfigText(text);
        _info(`設定ファイル ${fileName} を読み込みました。`);
      }
    } catch (e) {
      _warn("設定ファイルの読込に失敗しました。フォールバック既定値を使用します。");
    }

    // ステップ3: localStorage の上書き設定を最終適用(開発者向け一時上書き)
    const stored = _tryParseJSON(localStorage.getItem("lib-config"));
    if (stored) {
      if (stored.dbType) _cfg.dbType = stored.dbType;
      if (stored.maxReservations) _cfg.maxReservations = Number(stored.maxReservations);
      if (stored.searchPageSize) _cfg.searchPageSize = Number(stored.searchPageSize);
    }

    validateConfig();
    _info(`起動完了 dbType=${_cfg.dbType} secretMode=${_cfg.secretMode}`);
  }

  /**
   * 概要   : library-system-config.txt の本文を解析して _cfg に反映する。
   *          各行 "キー,値" 形式。# で始まる行はコメント扱い。
   * 作成者 : Y.Toyoda
   * 作成日 : 2026-05-12
   */
  function _applyConfigText(text) {
    text.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;

      const idx = trimmed.indexOf(",");
      if (idx === -1) return;

      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();

      switch (key) {
        case "データベース":
          _cfg.dbType = val;
          break;
        case "予約最大可能冊数":
          _cfg.maxReservations = Number(val) || _cfg.maxReservations;
          break;
        case "検索結果の表示数":
          _cfg.searchPageSize = Number(val) || _cfg.searchPageSize;
          break;
        case "secretMode":
          _cfg.secretMode = (val.toUpperCase() === "ON");
          break;
        case "secretIndicator":
          _cfg.secretIndicator = (val.toUpperCase() === "ON");
          break;
        default:
          // feature.xxx 形式のトグルを処理
          if (key.startsWith("feature.")) {
            const featureName = key.slice("feature.".length);
            _cfg.features[featureName] = (val.toUpperCase() === "ON");
          }
          break;
      }
    });
  }

  /**
   * 概要   : 設定値の検証処理。不正値は安全な既定値に復元する。
   */
  function validateConfig() {
    if (!["Excel", "SQLite"].includes(_cfg.dbType)) {
      _warn("dbType が不正です。既定値 'SQLite' を適用します。");
      _cfg.dbType = "SQLite";
    }
    if (!Number.isInteger(_cfg.maxReservations) || _cfg.maxReservations < 1) {
      _warn("maxReservations が不正です。既定値 '3' を適用します。");
      _cfg.maxReservations = 3;
    }
    if (!Number.isInteger(_cfg.searchPageSize) || _cfg.searchPageSize < 1) {
      _warn("searchPageSize が不正です。既定値 '10' を適用します。");
      _cfg.searchPageSize = 10;
    }
    return true;
  }

  function get(key) { return _cfg[key]; }

  /**
   * 概要   : シークレット機能のトグル評価。
   *          secretMode が OFF の場合は常に false を返す(強い無効化)。
   *          ON の場合のみ個別 feature の値を返す。
   * 作成者 : Y.Toyoda
   * 作成日 : 2026-05-12
   * @param {string} featureName - feature 名(例: "favorites")
   * @returns {boolean}
   */
  function isFeatureEnabled(featureName) {
    if (!_cfg.secretMode) return false;
    return Boolean(_cfg.features[featureName]);
  }

  function isSecretMode() { return _cfg.secretMode; }

  // --- 内部補助関数 ---
  function _tryParseJSON(str) {
    try { return str ? JSON.parse(str) : null; } catch { return null; }
  }
  function _info(msg) {
    if (typeof console !== "undefined") console.info("[ConfigManager]", msg);
  }
  function _warn(msg) {
    if (typeof console !== "undefined") console.warn("[ConfigManager]", msg);
  }

  return { init, validateConfig, get, isFeatureEnabled, isSecretMode };
})();


/* ============================================================================
 * セクション 2 : Repository 層
 * 役割：データアクセスを抽象化する。
 *   - SQLiteRepository : カゥン氏のバックエンド API を呼び出す(本番)
 *   - LocalRepository  : シークレット機能用に localStorage を使う拡張ストア
 *   - HybridRepository : 上記2つを結合し、未実装API部分のみ localStorage で補完
 *   - RepositoryFactory: secretMode により Hybrid / SQLite を切替
 * ============================================================================ */

// API ベース URL(同一オリジン配信なので相対パスで OK)
const API_BASE = "";

/* ----------------------------------------------------------------------------
 * SQLiteRepository
 *   カゥン氏の Sequelize ベース API を fetch で呼び出す本番リポジトリ。
 * -------------------------------------------------------------------------- */
const SQLiteRepository = (() => {

  async function findUser(userId, userName) {
    try {
      const res = await fetch(`${API_BASE}/api/users/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, userName })
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) { _logErr("findUser", e); return null; }
  }

  async function logout() {
    try {
      await fetch(`${API_BASE}/api/users/logout`, {
        method: "POST",
        credentials: "include"
      });
    } catch (e) { _logErr("logout", e); }
  }

  async function getActiveReservations(userId) {
    try {
      const res = await fetch(
        `${API_BASE}/api/users/${encodeURIComponent(userId)}/reservations/active`,
        { credentials: "include" }
      );
      if (!res.ok) return [];
      const data = await res.json();
      return (data.reservations || []).map(r => ({
        reservationId: r.reservationId,
        userId: r.userId,
        bookId: r.bookId,
        bookTitle: r.title || "---",
        bookAuthor: r.author || "---",
        status: r.status,
        reservedAt: r.reservedAt,
        pickupDeadline: r.pickupDeadline,
        queueNo: r.queueNo,
        cancelledAt: r.cancelledAt
      }));
    } catch (e) { _logErr("getActiveReservations", e); return []; }
  }

  async function getReservationCount(userId) {
    const list = await getActiveReservations(userId);
    return list.length;
  }

  async function searchBooks(criteria, page = 0) {
    const params = new URLSearchParams();
    if (criteria.title)    params.set("title",    criteria.title);
    if (criteria.author)   params.set("author",   criteria.author);
    if (criteria.category) params.set("category", criteria.category);
    if (criteria.sort)     params.set("sort",     criteria.sort);
    params.set("page", String(page));

    try {
      const res = await fetch(
        `${API_BASE}/api/books/search?${params.toString()}`,
        { credentials: "include" }
      );
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        return { books: [], total: 0, page: 0, totalPages: 1, error: errData };
      }
      const data = await res.json();
      let books = data.books || [];
      if (criteria.availableOnly)  books = books.filter(b => b.actionState === "AVAILABLE");
      if (criteria.reservableOnly) books = books.filter(b => b.actionState === "AVAILABLE" || b.actionState === "ON_LOAN");
      return {
        books,
        total: data.count || 0,
        page: data.page || 0,
        pageSize: data.pageSize || 10,
        totalPages: data.totalPages || 1
      };
    } catch (e) {
      _logErr("searchBooks", e);
      return { books: [], total: 0, page: 0, totalPages: 1 };
    }
  }

  // 予約 CRUD はカゥン氏 backend に未実装。secretMode に関わらず "未実装" を返す。
  function reserveBook() {
    return Promise.resolve({
      success: false,
      message: "予約登録APIはバックエンド未実装です。カゥン氏 backend での実装をお待ちください。"
    });
  }
  function cancelReservation() {
    return Promise.resolve({
      success: false,
      message: "予約取消APIはバックエンド未実装です。カゥン氏 backend での実装をお待ちください。"
    });
  }

  function _logErr(method, e) {
    if (typeof console !== "undefined") console.error(`[SQLiteRepository.${method}]`, e);
  }

  return {
    findUser, logout, getActiveReservations, getReservationCount,
    searchBooks, reserveBook, cancelReservation
  };
})();


/* ----------------------------------------------------------------------------
 * LocalRepository
 *   シークレット機能専用。豊田 v3.0.6 由来のお気に入り/通知/履歴/監査を
 *   ブラウザ localStorage で実装する。バックエンド未実装機能の補完用。
 * -------------------------------------------------------------------------- */
const LocalRepository = (() => {
  const KEY = {
    FAVORITES:     "lib-favorites",
    NOTIFICATIONS: "lib-notifications",
    HISTORY:       "lib-history",
    AUDIT:         "lib-audit",
    SEQ:           "lib-sequences",
    LAST_ACTION:   "lib-last-action"
  };

  function _getAll(key) {
    const raw = localStorage.getItem(key);
    if (raw === null) return [];
    try { return JSON.parse(raw); } catch { return []; }
  }
  function _setAll(key, data) { localStorage.setItem(key, JSON.stringify(data)); }
  function _nextSeq(name, prefix, padLen) {
    const seqs = JSON.parse(localStorage.getItem(KEY.SEQ) || "{}");
    seqs[name] = (seqs[name] || 0) + 1;
    localStorage.setItem(KEY.SEQ, JSON.stringify(seqs));
    return prefix + String(seqs[name]).padStart(padLen, "0");
  }

  // ============================================================
  // お気に入り CRUD
  // ============================================================
  function getFavorites(userId) {
    return _getAll(KEY.FAVORITES).filter(f => String(f.userId) === String(userId));
  }
  function addFavorite(userId, bookId, bookMeta) {
    if (!ConfigManager.isFeatureEnabled("favorites")) {
      return { success: false, message: "お気に入り機能は無効です。" };
    }
    const all = _getAll(KEY.FAVORITES);

    // W19: 重複ガード(duplicateGuard が有効な場合のみ)
    if (ConfigManager.isFeatureEnabled("duplicateGuard")) {
      const dup = all.find(f =>
        String(f.userId) === String(userId) && String(f.bookId) === String(bookId));
      if (dup) {
        writeAuditLog(userId, "FAVORITE_DUPLICATE", `重複検出 bookId=${bookId}`);
        return { success: false, code: "W19", message: "すでにお気に入り登録済みです。" };
      }
    }

    const fav = {
      favoriteId: _nextSeq("favorite", "F-", 5),
      userId, bookId,
      bookTitle:    bookMeta?.title    || "---",
      bookAuthor:   bookMeta?.author   || "---",
      bookCategory: bookMeta?.category || "---",
      addedAt: new Date().toISOString()
    };
    all.push(fav);
    _setAll(KEY.FAVORITES, all);
    writeAuditLog(userId, "FAVORITE_ADD", `bookId=${bookId}`);
    addNotification(userId, "SUCCESS", "お気に入り登録",
      `『${fav.bookTitle}』をお気に入りに追加しました。`);
    addHistory(userId, bookId, "FAVORITE_ADD", "お気に入り追加");
    return { success: true, favoriteId: fav.favoriteId, message: "お気に入りに追加しました。" };
  }
  function removeFavorite(userId, favoriteId) {
    if (!ConfigManager.isFeatureEnabled("favorites")) {
      return { success: false, message: "お気に入り機能は無効です。" };
    }
    const all = _getAll(KEY.FAVORITES);
    const idx = all.findIndex(f =>
      String(f.userId) === String(userId) && f.favoriteId === favoriteId);
    if (idx === -1) return { success: false, message: "対象が見つかりません。" };
    const removed = all.splice(idx, 1)[0];
    _setAll(KEY.FAVORITES, all);
    writeAuditLog(userId, "FAVORITE_REMOVE", `favoriteId=${favoriteId}`);
    addHistory(userId, removed.bookId, "FAVORITE_REMOVE", "お気に入り削除");
    return { success: true, message: `『${removed.bookTitle}』をお気に入りから削除しました。` };
  }

  // ============================================================
  // 通知(既読化機能含む)
  // ============================================================
  function addNotification(userId, type, title, message) {
    if (!ConfigManager.isFeatureEnabled("notifications")) return null;
    const all = _getAll(KEY.NOTIFICATIONS);
    const notif = {
      notificationId: _nextSeq("notification", "N-", 5),
      userId, type, title, message,
      createdAt: new Date().toISOString(),
      isRead: false,
      readAt: null
    };
    all.push(notif);
    _setAll(KEY.NOTIFICATIONS, all);
    return notif;
  }
  function getNotifications(userId) {
    return _getAll(KEY.NOTIFICATIONS)
      .filter(n => String(n.userId) === String(userId))
      .sort((a, b) => {
        if (!a.isRead && b.isRead) return -1;
        if (a.isRead && !b.isRead) return 1;
        return (b.createdAt || "").localeCompare(a.createdAt || "");
      });
  }
  function markNotificationRead(userId, notificationId) {
    if (!ConfigManager.isFeatureEnabled("notifications")) {
      return { success: false, message: "通知機能は無効です。" };
    }
    const all = _getAll(KEY.NOTIFICATIONS);
    const idx = all.findIndex(n =>
      String(n.userId) === String(userId) && n.notificationId === notificationId);
    if (idx === -1) return { success: false, message: "通知が見つかりません。" };
    all[idx].isRead = true;
    all[idx].readAt = new Date().toISOString();
    _setAll(KEY.NOTIFICATIONS, all);
    return { success: true };
  }
  function markAllNotificationsRead(userId) {
    if (!ConfigManager.isFeatureEnabled("notifications")) {
      return { success: false, message: "通知機能は無効です。" };
    }
    const all = _getAll(KEY.NOTIFICATIONS);
    const now = new Date().toISOString();
    let count = 0;
    all.forEach(n => {
      if (String(n.userId) === String(userId) && !n.isRead) {
        n.isRead = true; n.readAt = now; count++;
      }
    });
    _setAll(KEY.NOTIFICATIONS, all);
    return { success: true, count };
  }

  // ============================================================
  // 履歴
  // ============================================================
  function addHistory(userId, bookId, action, note) {
    if (!ConfigManager.isFeatureEnabled("history")) return null;
    const all = _getAll(KEY.HISTORY);
    const h = {
      historyId: _nextSeq("history", "H-", 5),
      userId, bookId, action,
      actionAt: new Date().toISOString(),
      note: note || ""
    };
    all.push(h);
    _setAll(KEY.HISTORY, all);
    return h;
  }
  function getHistory(userId) {
    return _getAll(KEY.HISTORY)
      .filter(h => String(h.userId) === String(userId))
      .sort((a, b) => (b.actionAt || "").localeCompare(a.actionAt || ""));
  }

  // ============================================================
  // 監査ログ
  // ============================================================
  function writeAuditLog(userId, eventType, message) {
    if (!ConfigManager.isFeatureEnabled("auditLog")) return null;
    const all = _getAll(KEY.AUDIT);
    all.push({
      logId: _nextSeq("audit", "A-", 5),
      level: eventType.includes("ERROR") ? "ERROR" : "INFO",
      eventType, userId: userId || "SYSTEM", message,
      createdAt: new Date().toISOString()
    });
    _setAll(KEY.AUDIT, all);
    return true;
  }
  function getAuditLog() {
    return _getAll(KEY.AUDIT)
      .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  }

  // ============================================================
  // 全データ JSON エクスポート / インポート
  // ============================================================
  function exportAll() {
    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      favorites:     _getAll(KEY.FAVORITES),
      notifications: _getAll(KEY.NOTIFICATIONS),
      history:       _getAll(KEY.HISTORY),
      auditLog:      _getAll(KEY.AUDIT)
    }, null, 2);
  }
  function importAll(jsonStr) {
    try {
      const data = JSON.parse(jsonStr);
      if (data.favorites)     _setAll(KEY.FAVORITES, data.favorites);
      if (data.notifications) _setAll(KEY.NOTIFICATIONS, data.notifications);
      if (data.history)       _setAll(KEY.HISTORY, data.history);
      if (data.auditLog)      _setAll(KEY.AUDIT, data.auditLog);
      return { success: true, message: "ローカルデータを取り込みました。" };
    } catch {
      return { success: false, message: "ファイル形式が不正です。" };
    }
  }
  function resetAll() {
    Object.values(KEY).forEach(k => localStorage.removeItem(k));
  }

  return {
    getFavorites, addFavorite, removeFavorite,
    addNotification, getNotifications, markNotificationRead, markAllNotificationsRead,
    addHistory, getHistory,
    writeAuditLog, getAuditLog,
    exportAll, importAll, resetAll
  };
})();


/* ----------------------------------------------------------------------------
 * HybridRepository
 *   SQLiteRepository(カゥン氏 API)を主、LocalRepository を従として結合する
 *   ファサード。secretMode=ON の時に Service 層から利用される。
 * -------------------------------------------------------------------------- */
const HybridRepository = (() => {
  // SQLite 側の同名メソッドをそのまま委譲
  const findUser = SQLiteRepository.findUser;
  const logout = SQLiteRepository.logout;
  const getActiveReservations = SQLiteRepository.getActiveReservations;
  const getReservationCount = SQLiteRepository.getReservationCount;
  const searchBooks = SQLiteRepository.searchBooks;
  const reserveBook = SQLiteRepository.reserveBook;
  const cancelReservation = SQLiteRepository.cancelReservation;

  // Local 側を機能トグル経由で公開
  const favorites = {
    list:   (userId) =>
      ConfigManager.isFeatureEnabled("favorites") ? LocalRepository.getFavorites(userId) : [],
    add:    (userId, bookId, bookMeta) => LocalRepository.addFavorite(userId, bookId, bookMeta),
    remove: (userId, favoriteId) => LocalRepository.removeFavorite(userId, favoriteId)
  };
  const notifications = {
    list:        (userId) =>
      ConfigManager.isFeatureEnabled("notifications") ? LocalRepository.getNotifications(userId) : [],
    markRead:    (userId, notificationId) => LocalRepository.markNotificationRead(userId, notificationId),
    markAllRead: (userId) => LocalRepository.markAllNotificationsRead(userId)
  };
  const history = {
    list: (userId) =>
      ConfigManager.isFeatureEnabled("history") ? LocalRepository.getHistory(userId) : []
  };
  const audit = {
    list: () =>
      ConfigManager.isFeatureEnabled("auditLog") ? LocalRepository.getAuditLog() : []
  };

  return {
    findUser, logout, getActiveReservations, getReservationCount,
    searchBooks, reserveBook, cancelReservation,
    favorites, notifications, history, audit,
    exportLocal: LocalRepository.exportAll,
    importLocal: LocalRepository.importAll,
    resetLocal:  LocalRepository.resetAll
  };
})();


/* ----------------------------------------------------------------------------
 * RepositoryFactory
 *   secretMode を確認し、Hybrid(拡張版)または SQLite(純粋版)を返す。
 * -------------------------------------------------------------------------- */
const RepositoryFactory = {
  create() {
    return ConfigManager.isSecretMode() ? HybridRepository : SQLiteRepository;
  }
};


/* ============================================================================
 * セクション 3 : Service 層
 * 役割：ビジネスロジックを管理し、Repository へのアクセスを仲介する。
 *       Service 層は async/await ベースで API 連動を前提に再構築。
 * ============================================================================ */
const Service = (() => {

  function repo() { return RepositoryFactory.create(); }

  /**
   * 利用者認証(POST /api/users/login)
   */
  async function authenticate(userId, userName) {
    if (!userId || !userName) {
      return { success: false, message: "入力項目が不足しています。" };
    }
    const user = await repo().findUser(String(userId).trim(), String(userName).trim());
    if (!user) return { success: false, message: "利用者IDまたは利用者名が一致しません。" };

    sessionStorage.setItem("lib-session", JSON.stringify({
      userId: user.userId, userName: user.userName
    }));

    // シークレットモード時:監査ログとログイン通知を記録
    if (ConfigManager.isSecretMode()) {
      LocalRepository.writeAuditLog(user.userId, "LOGIN_SUCCESS", `userName=${user.userName}`);
      LocalRepository.addNotification(user.userId, "INFO", "ログイン", "ログインしました。");
    }
    return { success: true, user };
  }

  function getSession() {
    try { return JSON.parse(sessionStorage.getItem("lib-session")); } catch { return null; }
  }

  async function logout() {
    const session = getSession();
    if (session && ConfigManager.isSecretMode()) {
      LocalRepository.writeAuditLog(session.userId, "LOGOUT", "利用者操作");
    }
    await repo().logout();
    sessionStorage.removeItem("lib-session");
    sessionStorage.removeItem("lib-last-action");
    sessionStorage.removeItem("lib-search-criteria");
  }

  /**
   * 予約状況ダッシュボード用のデータ集約。
   */
  async function getDashboard(userId) {
    const maxRes = ConfigManager.get("maxReservations") || 3;
    const reservations = await repo().getActiveReservations(userId);
    const nextDeadline = reservations
      .map(r => r.pickupDeadline)
      .filter(Boolean)
      .sort()[0] || null;

    return {
      reservations,
      count: reservations.length,
      maxRes,
      remaining: Math.max(0, maxRes - reservations.length),
      nextDeadline,
      reservedCount: reservations.filter(r => r.status === "RESERVED").length,
      waitingCount:  reservations.filter(r => r.status === "WAITING").length
    };
  }

  function normalizeSearchCriteria(raw) {
    return {
      title:    (raw.title    || "").trim(),
      author:   (raw.author   || "").trim(),
      category: (raw.category || "").trim(),
      sort:     (raw.sort     || "bookId").trim(),
      availableOnly:  Boolean(raw.availableOnly),
      reservableOnly: Boolean(raw.reservableOnly)
    };
  }

  async function searchAndPaginate(rawCriteria, page = 0) {
    const criteria = normalizeSearchCriteria(rawCriteria);
    const result = await repo().searchBooks(criteria, page);
    return {
      results: result.books || [],
      total: result.total || 0,
      page: result.page || 0,
      pageSize: result.pageSize || 10,
      totalPages: result.totalPages || 1,
      error: result.error || null
    };
  }

  async function reserveBook(bookId) {
    const session = getSession();
    if (!session) return { success: false, message: "セッションが切れています。再ログインしてください。" };
    return await repo().reserveBook(session.userId, bookId);
  }

  async function cancelReservation(reservationId) {
    const session = getSession();
    if (!session) return { success: false, message: "セッションが切れています。再ログインしてください。" };
    return await repo().cancelReservation(session.userId, reservationId);
  }

  /**
   * マイページ用集約データ。
   * favorites/notifications/history はシークレット機能 ON 時のみ非空。
   */
  async function getMyPageData() {
    const session = getSession();
    if (!session) return { currentReservations: [], history: [], favorites: [], notifications: [] };

    const currentReservations = await repo().getActiveReservations(session.userId);

    if (ConfigManager.isSecretMode()) {
      return {
        currentReservations,
        favorites:     HybridRepository.favorites.list(session.userId),
        notifications: HybridRepository.notifications.list(session.userId),
        history:       HybridRepository.history.list(session.userId)
      };
    }
    return { currentReservations, favorites: [], notifications: [], history: [] };
  }

  /**
   * シークレット機能:お気に入りトグル
   */
  function toggleFavorite(bookId, bookMeta) {
    if (!ConfigManager.isFeatureEnabled("favorites")) {
      return { success: false, message: "お気に入り機能は無効です。" };
    }
    const session = getSession();
    if (!session) return { success: false, message: "再ログインが必要です。" };

    const list = LocalRepository.getFavorites(session.userId);
    const existing = list.find(f => String(f.bookId) === String(bookId));
    if (existing) {
      return LocalRepository.removeFavorite(session.userId, existing.favoriteId);
    }
    return LocalRepository.addFavorite(session.userId, bookId, bookMeta);
  }

  function markNotificationRead(notificationId) {
    const session = getSession();
    if (!session) return { success: false, message: "再ログインが必要です。" };
    return LocalRepository.markNotificationRead(session.userId, notificationId);
  }

  function markAllNotificationsRead() {
    const session = getSession();
    if (!session) return { success: false, message: "再ログインが必要です。" };
    return LocalRepository.markAllNotificationsRead(session.userId);
  }

  return {
    authenticate, getSession, logout,
    getDashboard, searchAndPaginate,
    reserveBook, cancelReservation,
    getMyPageData,
    toggleFavorite, markNotificationRead, markAllNotificationsRead
  };
})();


/* ============================================================================
 * セクション 4 : Screen 層(各画面の制御)
 * ============================================================================ */
const Screen = (() => {

  /* ----------------------- ログイン画面 ----------------------- */
  function initLogin() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    const sumEl = document.querySelector("[data-config-summary]");
    if (sumEl) {
      const mode = ConfigManager.isSecretMode() ? "(シークレット拡張ON)" : "";
      sumEl.textContent =
        `DB: ${ConfigManager.get("dbType")} / ` +
        `予約上限: ${ConfigManager.get("maxReservations")} 冊 / ` +
        `表示件数: ${ConfigManager.get("searchPageSize")} 件 ${mode}`;
    }

    form.addEventListener("submit", async e => {
      e.preventDefault();
      const result = await Service.authenticate(
        document.getElementById("userId")?.value || "",
        document.getElementById("userName")?.value || ""
      );
      if (result.success) window.location.href = "reservation-status.html";
      else showMessage("error", result.message, "[data-message-host]");
    });
  }

  /* ----------------------- 予約状況画面 ----------------------- */
  async function initReservationStatus() {
    if (!requireSession()) return;
    await _renderDashboard();

    const qf = document.getElementById("quickSearchForm");
    if (qf) {
      qf.addEventListener("submit", e => {
        e.preventDefault();
        sessionStorage.setItem("lib-search-criteria", JSON.stringify({
          title:  document.getElementById("bookKeyword")?.value || "",
          author: document.getElementById("authorKeyword")?.value || ""
        }));
        window.location.href = "search-results.html";
      });
    }
  }

  async function _renderDashboard() {
    const session = Service.getSession();
    const data = await Service.getDashboard(session.userId);

    _setText("[data-user-id]", session.userId);
    _setText("[data-current-reservation-count]", `${data.count} / ${data.maxRes}`);
    _setText("[data-next-deadline]", data.nextDeadline || "なし");
    _setText("[data-config-limit-chip]", `最大 ${data.maxRes} 冊まで予約可能`);

    const tagsEl = document.querySelector("[data-dashboard-tags]");
    if (tagsEl) {
      tagsEl.innerHTML =
        `<span class="badge reserved">予約中 ${data.reservedCount}件</span> ` +
        `<span class="badge waiting">貸出待ち ${data.waitingCount}件</span>`;
    }

    const kpisEl = document.querySelector("[data-dashboard-kpis]");
    if (kpisEl) {
      let extraKpi = "";
      if (ConfigManager.isFeatureEnabled("dashboardKpi")) {
        const favCount = LocalRepository.getFavorites(session.userId).length;
        const unreadCount = LocalRepository.getNotifications(session.userId)
          .filter(n => !n.isRead).length;
        extraKpi =
          `<div class="kpi"><div class="label">お気に入り</div><div class="value">${favCount}冊</div></div>` +
          `<div class="kpi"><div class="label">未読通知</div><div class="value">${unreadCount}件</div></div>`;
      }
      kpisEl.innerHTML = `
        <div class="kpi"><div class="label">受取待ち</div><div class="value">${data.reservedCount}件</div></div>
        <div class="kpi"><div class="label">貸出待ち</div><div class="value">${data.waitingCount}件</div></div>
        <div class="kpi"><div class="label">残り予約可能数</div><div class="value">${data.remaining}冊</div></div>
        ${extraKpi}`;
    }

    const tbody = document.querySelector("[data-reservation-table-body]");
    const empty = document.querySelector("[data-reservation-empty]");
    if (tbody) {
      if (data.reservations.length === 0) {
        tbody.innerHTML = "";
        empty && empty.classList.remove("app-hidden");
      } else {
        empty && empty.classList.add("app-hidden");
        tbody.innerHTML = data.reservations.map(r => `
          <tr>
            <td data-label="予約番号">${esc(r.reservationId)}</td>
            <td data-label="書籍名">${esc(r.bookTitle)}</td>
            <td data-label="著者名">${esc(r.bookAuthor)}</td>
            <td data-label="状態"><span class="badge ${r.status === 'RESERVED' ? 'reserved' : 'waiting'}">${r.status === 'RESERVED' ? '予約中' : '貸出待ち'}</span></td>
            <td data-label="取置期限">${esc(r.pickupDeadline || '返却後に通知')}</td>
            <td data-label="操作" class="table-actions">
              <button class="btn btn-danger" type="button" data-cancel-btn="${esc(r.reservationId)}">予約取消</button>
            </td>
          </tr>
        `).join("");

        tbody.querySelectorAll("[data-cancel-btn]").forEach(btn => {
          btn.addEventListener("click", async () => {
            const resId = btn.dataset.cancelBtn;
            if (!confirm(`予約番号「${resId}」を取消してよいですか?`)) return;
            const result = await Service.cancelReservation(resId);
            if (result.success) {
              showMessage("success", result.message);
              await _renderDashboard();
            } else {
              showMessage("error", result.message);
            }
          });
        });
      }
    }
    decorateResponsiveTables();
  }

  /* ----------------------- 検索結果画面 ----------------------- */
  async function initSearchResults() {
    if (!requireSession()) return;

    let criteria = {};
    try { criteria = JSON.parse(sessionStorage.getItem("lib-search-criteria") || "{}"); } catch {}

    const titleInput    = document.getElementById("toolbarTitle");
    const authorInput   = document.getElementById("toolbarAuthor");
    const categoryInput = document.getElementById("toolbarCategory");
    const sortInput     = document.getElementById("toolbarSort");
    if (titleInput)    titleInput.value    = criteria.title    || "";
    if (authorInput)   authorInput.value   = criteria.author   || "";
    if (categoryInput) categoryInput.value = criteria.category || "";
    if (sortInput)     sortInput.value     = criteria.sort     || "bookId";

    async function doSearch(page = 0) {
      const cr = {
        title:    titleInput?.value || "",
        author:   authorInput?.value || "",
        category: categoryInput?.value || "",
        sort:     sortInput?.value || "bookId",
        availableOnly:  criteria.availableOnly || false,
        reservableOnly: criteria.reservableOnly || false
      };
      const result = await Service.searchAndPaginate(cr, page);
      _renderSearchResults(result, cr);
    }

    await doSearch(0);

    const form = document.getElementById("searchToolbarForm");
    if (form) {
      form.addEventListener("submit", async e => {
        e.preventDefault();
        criteria = {
          title:    titleInput?.value || "",
          author:   authorInput?.value || "",
          category: categoryInput?.value || "",
          sort:     sortInput?.value || "bookId"
        };
        sessionStorage.setItem("lib-search-criteria", JSON.stringify(criteria));
        await doSearch(0);
      });
    }

    document.addEventListener("click", async e => {
      const pageLink = e.target.closest("[data-page-link]");
      if (pageLink) {
        e.preventDefault();
        const p = parseInt(pageLink.dataset.pageLink, 10);
        if (!isNaN(p)) await doSearch(p);
      }
      const reserveBtn = e.target.closest("[data-reserve-book]");
      if (reserveBtn) {
        e.preventDefault();
        const bookId = reserveBtn.dataset.reserveBook;
        const result = await Service.reserveBook(bookId);
        if (result.success) {
          window.location.href = "notification.html";
        } else {
          showMessage("error", result.message);
        }
      }
      // シークレット機能: お気に入りトグル
      const favBtn = e.target.closest("[data-fav-toggle]");
      if (favBtn) {
        e.preventDefault();
        if (!ConfigManager.isFeatureEnabled("favorites")) {
          showMessage("warn", "お気に入り機能は現在無効です(secretMode を有効化してください)。");
          return;
        }
        const meta = {
          title:    favBtn.dataset.bookTitle,
          author:   favBtn.dataset.bookAuthor,
          category: favBtn.dataset.bookCategory
        };
        const result = Service.toggleFavorite(favBtn.dataset.favToggle, meta);
        showMessage(result.success ? "success" : (result.code === "W19" ? "warn" : "error"), result.message);
        await doSearch(0); // ボタン表示を更新
      }
    });
  }

  function _renderSearchResults(result, criteria) {
    const session = Service.getSession();

    _setText("[data-summary-title]",  criteria.title  || "(未指定)");
    _setText("[data-summary-author]", criteria.author || "(未指定)");
    _setText("[data-summary-count]", `${result.total}件`);

    if (result.error && result.error.messageCode) {
      showMessage("error", result.error.message || "検索条件エラー");
    }

    const tbody = document.querySelector("[data-search-results-body]");
    const empty = document.querySelector("[data-search-empty]");
    if (tbody) {
      if (result.results.length === 0) {
        tbody.innerHTML = "";
        empty && empty.classList.remove("app-hidden");
      } else {
        empty && empty.classList.add("app-hidden");
        const favs = (session && ConfigManager.isFeatureEnabled("favorites"))
          ? LocalRepository.getFavorites(session.userId) : [];
        const favIds = new Set(favs.map(f => String(f.bookId)));

        tbody.innerHTML = result.results.map(book => {
          let statusBadge = "", actionCell = "";
          if (book.actionState === "AVAILABLE") {
            statusBadge = `<span class="badge available">予約可能</span>`;
            actionCell  = `<button class="btn btn-primary" data-reserve-book="${esc(book.bookId)}">予約</button>`;
          } else if (book.actionState === "ON_LOAN") {
            statusBadge = `<span class="badge borrowed">貸出中</span>`;
            actionCell  = `<button class="btn btn-secondary" data-reserve-book="${esc(book.bookId)}">予約</button>`;
          } else if (book.actionState === "RESERVED") {
            statusBadge = `<span class="badge reserved">予約中</span>`;
            actionCell  = `<button class="btn btn-light" disabled>予約中</button>`;
          } else {
            statusBadge = `<span class="badge neutral">不可</span>`;
            actionCell  = `<button class="btn btn-light" disabled>不可</button>`;
          }
          // お気に入りボタン(シークレット機能 ON 時のみ表示)
          const favBtn = ConfigManager.isFeatureEnabled("favorites")
            ? `<button class="btn btn-light btn-fav" data-fav-toggle="${esc(book.bookId)}"
                 data-book-title="${esc(book.title)}"
                 data-book-author="${esc(book.author)}"
                 data-book-category="${esc(book.category)}">
                 ${favIds.has(String(book.bookId)) ? "★" : "☆"}
               </button>` : "";
          return `<tr>
            <td data-label="書籍ID">${esc(book.bookId)}</td>
            <td data-label="書籍名">${esc(book.title)}</td>
            <td data-label="著者名">${esc(book.author)}</td>
            <td data-label="分類">${esc(book.category)}</td>
            <td data-label="状態">${statusBadge}</td>
            <td data-label="返却予定">${book.dueDate ? esc(book.dueDate) : "-"}</td>
            <td data-label="操作" class="table-actions">${actionCell} ${favBtn}</td>
          </tr>`;
        }).join("");
      }
    }
    _renderPagination(result);
    decorateResponsiveTables();
  }

  function _renderPagination(result) {
    const pEl = document.querySelector("[data-pagination]");
    if (!pEl) return;
    if (result.totalPages <= 1) { pEl.innerHTML = ""; return; }
    let pages = "";
    for (let i = 0; i < result.totalPages; i++) {
      pages += `<a class="page-link ${i === result.page ? "active" : ""}" href="#" data-page-link="${i}">${i + 1}</a>`;
    }
    pEl.innerHTML = `
      <div class="muted">${result.page * result.pageSize + 1} - ${Math.min((result.page + 1) * result.pageSize, result.total)} / ${result.total}件</div>
      <div class="page-links">
        <a class="page-link ${result.page === 0 ? "disabled" : ""}" href="#" data-page-link="${result.page - 1}">◀</a>
        ${pages}
        <a class="page-link ${result.page >= result.totalPages - 1 ? "disabled" : ""}" href="#" data-page-link="${result.page + 1}">▶</a>
      </div>
    `;
  }

  /* ----------------------- 詳細検索画面 ----------------------- */
  async function initAdvancedSearch() {
    if (!requireSession()) return;
    const form = document.getElementById("advancedSearchForm");
    if (!form) return;
    form.addEventListener("submit", e => {
      e.preventDefault();
      const fd = new FormData(form);
      sessionStorage.setItem("lib-search-criteria", JSON.stringify({
        title:    fd.get("title")    || "",
        author:   fd.get("author")   || "",
        category: fd.get("category") || "",
        sort:     fd.get("sort")     || "bookId",
        availableOnly:  fd.get("availableOnly")  === "on",
        reservableOnly: fd.get("reservableOnly") === "on"
      }));
      window.location.href = "search-results.html";
    });
  }

  /* ----------------------- 通知一覧画面 ----------------------- */
  function initNotification() {
    if (!requireSession()) return;
    const session = Service.getSession();
    const host  = document.querySelector("[data-notification-list]");
    const empty = document.querySelector("[data-notification-empty]");

    if (!ConfigManager.isFeatureEnabled("notifications")) {
      if (host) host.innerHTML =
        `<div class="notice info">通知機能は無効です。secretMode を有効化してください。</div>`;
      return;
    }

    function render() {
      const list = LocalRepository.getNotifications(session.userId);
      if (!host) return;
      if (list.length === 0) {
        host.innerHTML = "";
        empty && empty.classList.remove("app-hidden");
        return;
      }
      empty && empty.classList.add("app-hidden");
      host.innerHTML = list.map(n => `
        <article class="notification-item ${n.isRead ? "read" : "unread"}">
          <div class="notification-head">
            <span class="badge ${n.type === 'SUCCESS' ? 'available' : (n.type === 'WARN' ? 'waiting' : 'neutral')}">${esc(n.type)}</span>
            <strong>${esc(n.title)}</strong>
            <span class="muted">${esc(n.createdAt)}</span>
          </div>
          <p>${esc(n.message)}</p>
          ${!n.isRead ? `<button class="btn btn-light btn-sm" data-mark-read="${esc(n.notificationId)}">既読にする</button>` : ""}
        </article>
      `).join("");
      host.querySelectorAll("[data-mark-read]").forEach(btn => {
        btn.addEventListener("click", () => {
          Service.markNotificationRead(btn.dataset.markRead);
          render();
        });
      });
    }
    render();

    document.querySelector("[data-mark-all-read]")?.addEventListener("click", () => {
      const r = Service.markAllNotificationsRead();
      showMessage("success", `${r.count || 0} 件を既読にしました。`);
      render();
    });
  }

  /* ----------------------- マイページ画面 ----------------------- */
  async function initMyPage() {
    if (!requireSession()) return;
    const data = await Service.getMyPageData();
    _renderMyPage(data);

    // ローカルデータ出力(シークレット機能 ON+localExport ON 時のみ)
    document.querySelector("[data-export-bridge]")?.addEventListener("click", () => {
      if (!ConfigManager.isFeatureEnabled("localExport")) {
        showMessage("warn", "ローカル出力機能は無効です(secretMode と feature.localExport を ON にしてください)。");
        return;
      }
      const json = LocalRepository.exportAll();
      const blob = new Blob([json], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `library_local_${_nowStr()}.json`; a.click();
      URL.revokeObjectURL(url);
    });
  }

  function _renderMyPage(data) {
    // 現在予約
    const resBody = document.querySelector("[data-mypage-reservations]");
    if (resBody) {
      resBody.innerHTML = data.currentReservations.length === 0
        ? `<div class="muted">予約はありません。</div>`
        : data.currentReservations.map(r =>
            `<div class="card-line">${esc(r.bookTitle)} / ${esc(r.status)} / ${esc(r.pickupDeadline || "")}</div>`
          ).join("");
    }
    // お気に入り
    const favBody = document.querySelector("[data-mypage-favorites]");
    if (favBody) {
      if (!ConfigManager.isFeatureEnabled("favorites")) {
        favBody.innerHTML = `<div class="muted">お気に入り機能は無効です。</div>`;
      } else if (data.favorites.length === 0) {
        favBody.innerHTML = `<div class="muted">お気に入りはありません。</div>`;
      } else {
        favBody.innerHTML = data.favorites.map(f =>
          `<div class="card-line">★ ${esc(f.bookTitle)} <small>${esc(f.bookAuthor)}</small></div>`
        ).join("");
      }
    }
    // 履歴
    const histBody = document.querySelector("[data-mypage-history]");
    if (histBody) {
      if (!ConfigManager.isFeatureEnabled("history")) {
        histBody.innerHTML = `<div class="muted">履歴機能は無効です。</div>`;
      } else if (data.history.length === 0) {
        histBody.innerHTML = `<div class="muted">履歴はありません。</div>`;
      } else {
        histBody.innerHTML = data.history.slice(0, 20).map(h =>
          `<div class="card-line">${esc(h.actionAt)} / ${esc(h.action)} / bookId=${esc(h.bookId)}</div>`
        ).join("");
      }
    }
  }

  return {
    initLogin, initReservationStatus, initSearchResults,
    initAdvancedSearch, initNotification, initMyPage
  };
})();


/* ============================================================================
 * セクション 5 : SecretIndicator
 *   画面右下に小さなインジケーターを表示し、現在のシークレットモードを明示する。
 *   secretIndicator=ON かつ secretMode=ON の時のみ表示。
 * ============================================================================ */
const SecretIndicator = (() => {
  function render() {
    if (!ConfigManager.isSecretMode()) return;
    if (!ConfigManager.get("secretIndicator")) return;

    const featureNames = [
      "favorites","notifications","history","auditLog",
      "duplicateGuard","dashboardKpi","localExport"
    ];
    const enabled = featureNames.filter(f => ConfigManager.isFeatureEnabled(f));

    const el = document.createElement("div");
    el.id = "secret-indicator";
    el.style.cssText = [
      "position:fixed", "right:12px", "bottom:12px", "z-index:9999",
      "background:rgba(33,33,33,0.86)", "color:#fff",
      "padding:6px 10px", "border-radius:6px",
      "font-size:11px", "font-family:monospace",
      "box-shadow:0 2px 6px rgba(0,0,0,0.2)",
      "max-width:280px", "line-height:1.4"
    ].join(";");
    el.innerHTML = `🔒 SECRET MODE ON<br>` +
      `<span style="opacity:0.75">features: ${enabled.join(", ") || "(none)"}</span>`;
    document.body.appendChild(el);
  }
  return { render };
})();


/* ============================================================================
 * セクション 6 : 共通 UI ユーティリティ
 * ============================================================================ */
function setupViewMode() { /* 既存ロジックを温存(必要に応じて拡張) */ }

function setToday() {
  const jp = new Intl.DateTimeFormat("ja-JP", {
    year: "numeric", month: "2-digit", day: "2-digit", weekday: "short"
  }).format(new Date());
  document.querySelectorAll("[data-today]").forEach(el => { el.textContent = jp; });
}

function fillBrowserFields() {
  const browser = detectBrowser().label;
  document.querySelectorAll("[data-browser-field]").forEach(el => { el.value = browser; });
}

function detectBrowser() {
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return { label: "Microsoft Edge", isRecommended: true };
  if (/OPR\//.test(ua)) return { label: "Opera", isRecommended: false };
  if (/Chrome\//.test(ua) && !/Edg\//.test(ua) && !/OPR\//.test(ua)) return { label: "Google Chrome", isRecommended: true };
  if (/Firefox\//.test(ua)) return { label: "Mozilla Firefox", isRecommended: false };
  if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) return { label: "Safari", isRecommended: false };
  return { label: "その他のブラウザ", isRecommended: false };
}

function checkBrowserWarning() {
  const browser = detectBrowser();
  if (!browser.isRecommended) {
    showMessage("warn", `現在のブラウザ(${browser.label})は推奨外です。Chrome または Edge での利用を推奨します。`);
  }
}

function setActiveNav() {
  const path = location.pathname.split("/").pop() || "login.html";
  document.querySelectorAll("[data-nav]").forEach(el => {
    el.classList.toggle("active", el.getAttribute("href") === path);
  });
}

function decorateResponsiveTables() {
  document.querySelectorAll("table").forEach(table => {
    const headers = Array.from(table.querySelectorAll("thead th")).map(th => th.textContent.trim());
    table.querySelectorAll("tbody tr").forEach(row => {
      Array.from(row.children).forEach((cell, idx) => {
        if (headers[idx]) cell.setAttribute("data-label", headers[idx]);
      });
    });
  });
}

function buildMobileBottomNav() { /* 既存ロジックを温存 */ }

function wireHelpers() {
  const clearLoginBtn = document.querySelector("[data-clear-login]");
  if (clearLoginBtn) {
    clearLoginBtn.addEventListener("click", () => {
      document.querySelectorAll("#loginForm input:not([readonly])").forEach(el => { el.value = ""; });
      fillBrowserFields();
    });
  }
  const resetSearchBtn = document.querySelector("[data-reset-search]");
  if (resetSearchBtn) {
    resetSearchBtn.addEventListener("click", () => {
      const form = document.getElementById("advancedSearchForm");
      if (form) {
        form.reset();
        form.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
          const card = checkbox.closest(".check-card");
          if (card) {
            const indicator = card.querySelector("[data-switch-indicator]");
            if (indicator) indicator.classList.toggle("on", checkbox.checked);
          }
        });
      }
    });
  }
}

function applySessionHeader() {
  const session = Service.getSession();
  document.querySelectorAll("[data-user-name]").forEach(el => {
    el.textContent = session ? session.userName : "未ログイン";
  });
  document.querySelectorAll("[data-user-id]").forEach(el => {
    el.textContent = session ? session.userId : "---";
  });
  document.querySelectorAll("[data-logout-link]").forEach(link => {
    link.addEventListener("click", async e => {
      e.preventDefault();
      await Service.logout();
      window.location.href = "login.html";
    });
  });
}

function requireSession() {
  if (!Service.getSession()) {
    showMessage("warn", "セッションが切れています。再ログインしてください。");
    setTimeout(() => { window.location.href = "login.html"; }, 1500);
    return false;
  }
  return true;
}

function showMessage(type, message, selector = "[data-message-host]") {
  const host = document.querySelector(selector);
  if (!host) return;
  host.innerHTML = `<div class="notice ${type}"><div>${esc(message)}</div></div>`;
  setTimeout(() => { host.innerHTML = ""; }, 5000);
}

function esc(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function _setText(selector, text) {
  document.querySelectorAll(selector).forEach(el => { el.textContent = text; });
}

function _nowStr() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}_${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}${String(d.getSeconds()).padStart(2, '0')}`;
}
