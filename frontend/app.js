/*
 * ============================================================================
 * ファイル名   : app.js
 * 概要         : 図書予約システムの画面制御と業務処理をまとめたメインスクリプト。
 *                設定管理、データアクセス、業務処理、画面制御の 4 つの責務に分離し、
 *                保守性と拡張性を担保するアーキテクチャを採用しています。
 * 作成者       : Y.Toyoda
 * 作成日       : 2026-04-17
 * 備考         : 【設計上の注意】現状は localStorage を用いた同期処理モデルですが、
 *                将来的に SQLite 等の RDBMS に移行する際は、非同期処理(async/await)
 *                へアーキテクチャを変更する必要があります。
 * ============================================================================
 */

"use strict";

/* ============================================================================
 * セクション 0 : 起動時初期化
 * ============================================================================ */

document.addEventListener("DOMContentLoaded", () => {
  // 1. システム設定を初期化
  ConfigManager.init();
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
  // 10. UI補助操作（入力クリアなど）のイベントを設定する
  wireHelpers();

  // 11. 現在のページ(data-page属性)に応じて個別の初期化処理を振り分け
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
 * 役割：システムの実行条件（DB種別、予約上限など）を一元管理する。
 * ============================================================================ */
const ConfigManager = (() => {
  // 内部で保持する設定の既定値
  let _cfg = {
    dbType: "Excel",
    maxReservations: 3,
    searchPageSize: 10
  };

  /**
   * 概要   : 設定の初期化処理
   *          フォールバック設定または localStorage の保存内容から設定を展開します。
   * 作成者 : Y.Toyoda
   * 作成日 : 2026-04-17
   */
  function init() {
    // グローバルな既定設定（library-config.js に定義）を読み込む
    const fb = window.LIBRARY_CONFIG_FALLBACK || {};
    _cfg.dbType = fb.dbType || "Excel";
    _cfg.maxReservations = Number(fb.maxReservations) || 3;
    _cfg.searchPageSize = Number(fb.searchPageSize) || 10;

    // ユーザーが手動で上書きした設定が localStorage にあれば適用する
    const stored = _tryParseJSON(localStorage.getItem("lib-config"));
    if (stored) {
      if (stored.dbType) _cfg.dbType = stored.dbType;
      if (stored.maxReservations) _cfg.maxReservations = Number(stored.maxReservations);
      if (stored.searchPageSize) _cfg.searchPageSize = Number(stored.searchPageSize);
    }
  }

  /**
   * 概要   : 設定値の検証処理
   *          不正な値が設定されている場合は、安全な既定値に復元します。
   * 作成者 : Y.Toyoda
   * 作成日 : 2026-04-17
   * @returns {boolean} 検証が正常終了したかを示すフラグ
   */
  function validateConfig() {
    if (!["Excel", "SQLite"].includes(_cfg.dbType)) {
      _warn("dbType が不正です。既定値 'Excel' を適用します。");
      _cfg.dbType = "Excel";
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

  /**
   * 概要   : 設定値の取得処理
   * 作成者 : Y.Toyoda
   * 作成日 : 2026-04-17
   * @param {string} key - 取得したい設定キー
   * @returns {*} 設定値
   */
  function get(key) { return _cfg[key]; }

  // --- 内部補助関数 ---
  function _tryParseJSON(str) {
    try { return str ? JSON.parse(str) : null; } catch { return null; }
  }
  function _warn(msg) {
    if (typeof console !== "undefined" && typeof console.info === "function") {
      console.info("[ConfigManager]", msg);
    }
  }

  return { init, validateConfig, get };
})();


/* ============================================================================
 * セクション 2 : RepositoryFactory と Repository 管理
 * 役割：設定に基づき、データの保存先（Excel(Local) / SQLite）を切り替える。
 * ============================================================================ */

/**
 * 概要   : リポジトリのファクトリクラス
 * 作成者 : Y.Toyoda
 * 作成日 : 2026-04-17
 */
const RepositoryFactory = {
  /**
   * 概要   : リポジトリインスタンスの生成
   * @returns {object} 利用するデータストア(Repository)のオブジェクト
   */
  create() {
    const dbType = ConfigManager.get("dbType") || "Excel";
    return dbType === "SQLite" ? SQLiteRepository : ExcelRepository;
  }
};

/* ----------------------------------------------------------------------------
 * ExcelRepository
 * 概要 : localStorage をデータストアとして利用し、JSON形式でのエクスポート/インポート
 *        によって疑似的に外部ファイル(Excel等)とのブリッジを実現します。
 * -------------------------------------------------------------------------- */
const ExcelRepository = (() => {
  // localStorage 内で利用するキー群の定義
  const KEY = {
    USERS: "lib-users",
    BOOKS: "lib-books",
    RESERVATIONS: "lib-reservations",
    HISTORY: "lib-history",
    LOANS: "lib-loans",
    NOTIFICATIONS: "lib-notifications",
    FAVORITES: "lib-favorites",
    AUDIT: "lib-audit",
    SEQ: "lib-sequences"
  };

  let _locked = false;

  /**
   * 概要   : 簡易的な排他制御(ロック)を提供するラッパー関数
   * 警告   : このロックは「同一タブ内」でのみ有効です。別タブ間の競合を防ぐには
   *          Web Locks API などの導入が必要です。
   * 作成者 : Y.Toyoda
   * 作成日 : 2026-04-17
   */
  function _withLock(fn) {
    if (_locked) throw new Error("[ExcelRepository] 排他制御: 処理が競合しました。");
    _locked = true;
    try { return fn(); } finally { _locked = false; }
  }

  /**
   * 概要   : ストレージから指定キーの配列データを取得する。
   *          未初期化の場合は、library-seed.js のデータを用いて初期化します。
   * 作成者 : Y.Toyoda
   * 作成日 : 2026-04-17
   */
  function _getAll(key) {
    const raw = localStorage.getItem(key);
    if (raw !== null) return JSON.parse(raw);

    // 未初期化時はシードデータで初期化を実行
    const seedMap = {
      [KEY.USERS]: (window.LIBRARY_SEED_DATA || {}).users || [],
      [KEY.BOOKS]: (window.LIBRARY_SEED_DATA || {}).books || [],
      [KEY.RESERVATIONS]: (window.LIBRARY_SEED_DATA || {}).reservations || [],
      [KEY.HISTORY]: (window.LIBRARY_SEED_DATA || {}).reservationHistory || [],
      [KEY.LOANS]: (window.LIBRARY_SEED_DATA || {}).loans || [],
      [KEY.NOTIFICATIONS]: (window.LIBRARY_SEED_DATA || {}).notifications || [],
      [KEY.FAVORITES]: (window.LIBRARY_SEED_DATA || {}).favorites || [],
      [KEY.AUDIT]: (window.LIBRARY_SEED_DATA || {}).auditLog || []
    };
    const seed = seedMap[key] || [];
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }

  /**
   * 概要   : データをストレージに保存する。
   * 作成者 : Y.Toyoda
   * 作成日 : 2026-04-17
   */
  function _setAll(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  /**
   * 概要   : 一意なシーケンス番号（予約番号等）を自動採番する。
   * 作成者 : Y.Toyoda
   * 作成日 : 2026-04-17
   */
  function _nextSeq(seqName, prefix, padLen) {
    const seqs = JSON.parse(localStorage.getItem(KEY.SEQ) || "{}");
    seqs[seqName] = (seqs[seqName] || 0) + 1;
    localStorage.setItem(KEY.SEQ, JSON.stringify(seqs));
    return prefix + String(seqs[seqName]).padStart(padLen, "0");
  }

  /**
   * 概要   : 利用者マスタから利用者を検索する。
   * 作成者 : Y.Toyoda
   * 作成日 : 2026-04-17
   */
  function findUser(userId, userName) {
    const users = _getAll(KEY.USERS);
    return users.find(u => u.userId === userId && u.userName === userName && u.enabled !== false) || null;
  }

  /**
   * 概要   : 指定利用者の現在有効な予約一覧を取得し、期限昇順にソートする。
   * 作成者 : Y.Toyoda
   * 作成日 : 2026-04-17
   */
  function getActiveReservations(userId) {
    const reservations = _getAll(KEY.RESERVATIONS).filter(r => r.userId === userId && r.status !== "CANCELLED");
    const books = _getAll(KEY.BOOKS);

    return reservations.map(r => {
      const book = books.find(b => b.bookId === r.bookId) || {};
      return { ...r, bookTitle: book.title || "---", bookAuthor: book.author || "---" };
    }).sort((a, b) => {
      const da = a.pickupDeadline || "9999-99-99";
      const db = b.pickupDeadline || "9999-99-99";
      return da.localeCompare(db);
    });
  }

  /**
   * 概要   : 指定利用者の有効予約件数を取得する。
   * 作成者 : Y.Toyoda
   * 作成日 : 2026-04-17
   */
  function getReservationCount(userId) {
    return _getAll(KEY.RESERVATIONS).filter(r => r.userId === userId && r.status !== "CANCELLED").length;
  }

  /**
   * 概要   : 蔵書検索を実行する（AND条件、部分一致対応）。
   * 作成者 : Y.Toyoda
   * 作成日 : 2026-04-17
   * @param {object} criteria - 検索条件
   */
  function searchBooks(criteria) {
    let books = _getAll(KEY.BOOKS);
    const loans = _getAll(KEY.LOANS);
    const reservations = _getAll(KEY.RESERVATIONS);

    // 1. 各書籍に対して動的な状態（予約可、貸出中など）を計算してマージする
    books = books.map(book => {
      const state = _determineBookActionState(book, loans, reservations);
      return { ...book, ...state };
    });

    // 2. 検索条件でフィルタリング
    if (criteria.title) books = books.filter(b => (b.title || "").includes(criteria.title));
    if (criteria.author) books = books.filter(b => (b.author || "").includes(criteria.author));
    if (criteria.category) books = books.filter(b => (b.category || "") === criteria.category);
    if (criteria.availableOnly) books = books.filter(b => b.actionState === "AVAILABLE");
    if (criteria.reservableOnly) books = books.filter(b => b.actionState === "AVAILABLE" || b.actionState === "ON_LOAN");

    // 3. 指定の並び順でソート
    const sort = criteria.sort || "bookId";
    books.sort((a, b) => {
      if (sort === "title") return (a.title || "").localeCompare(b.title || "");
      if (sort === "author") return (a.author || "").localeCompare(b.author || "");
      if (sort === "arrivalDateDesc") return (b.arrivalDate || "").localeCompare(a.arrivalDate || "");
      return (a.bookId || "").localeCompare(b.bookId || "");
    });

    return books;
  }

  /**
   * 概要   : 書籍に対する「アクション状態」を動的判定する内部メソッド
   * 作成者 : Y.Toyoda
   * 作成日 : 2026-04-17
   * @returns {object} アクション状態（AVAILABLE / ON_LOAN / RESERVED / DISABLED）など
   */
  function _determineBookActionState(book, loans, reservations) {
    if (book.isDisabled || !book.canReserve) return { actionState: "DISABLED", actionLabel: "不可", dueDate: "" };

    const loan = loans.find(l => l.bookId === book.bookId && l.status === "ON_LOAN");
    if (loan) return { actionState: "ON_LOAN", actionLabel: "予約する（貸出中）", dueDate: loan.dueDate || "" };

    const res = reservations.find(r => r.bookId === book.bookId && r.status !== "CANCELLED");
    if (res) return { actionState: "RESERVED", actionLabel: "予約中", dueDate: "" };

    return { actionState: "AVAILABLE", actionLabel: "予約する", dueDate: "" };
  }

  /**
   * 概要   : 書籍の予約登録処理
   *          予約上限・書籍状態・重複予約を検証し、予約データを保存します。
   * 作成者 : Y.Toyoda
   * 作成日 : 2026-04-17
   */
  function reserveBook(userId, bookId) {
    return _withLock(() => {
      const maxRes = ConfigManager.get("maxReservations") || 3;
      const reservations = _getAll(KEY.RESERVATIONS);
      const books = _getAll(KEY.BOOKS);
      const loans = _getAll(KEY.LOANS);

      // 検証1: 予約上限チェック
      const currentCount = reservations.filter(r => r.userId === userId && r.status !== "CANCELLED").length;
      if (currentCount >= maxRes) return { success: false, message: `予約上限（${maxRes}冊）に達しています。` };

      // 検証2: 書籍の存在・状態チェック
      const book = books.find(b => b.bookId === bookId);
      if (!book) return { success: false, message: "指定した書籍が見つかりません。" };

      const state = _determineBookActionState(book, loans, reservations);
      if (state.actionState === "DISABLED") return { success: false, message: "この書籍は現在予約できません。" };
      if (state.actionState === "RESERVED") return { success: false, message: "他の利用者が予約済みです。" };

      // 検証3: 重複予約チェック
      const duplicate = reservations.find(r => r.userId === userId && r.bookId === bookId && r.status !== "CANCELLED");
      if (duplicate) return { success: false, message: "すでにこの書籍を予約済みです。" };

      // 予約データの生成と保存
      const reservationId = _nextSeq("reservation", "R-", 5);
      const now = new Date().toISOString();
      reservations.push({
        reservationId, userId, bookId,
        status: state.actionState === "ON_LOAN" ? "WAITING" : "RESERVED",
        reservedAt: now,
        pickupDeadline: state.actionState === "ON_LOAN" ? "" : _calcPickupDeadline(),
        queueNo: 1
      });
      _setAll(KEY.RESERVATIONS, reservations);

      // 通知の生成
      const notificationId = _nextSeq("notification", "N-", 5);
      const notifications = _getAll(KEY.NOTIFICATIONS);
      notifications.push({
        notificationId, userId, type: "SUCCESS", title: "予約が完了しました",
        message: `『${book.title || ""}』の予約を受け付けました。`,
        createdAt: now, isRead: false
      });
      _setAll(KEY.NOTIFICATIONS, notifications);

      // 監査ログの記録
      _writeAuditLog(userId, "RESERVE_SUCCESS", `予約成功: bookId=${bookId} resId=${reservationId}`);

      // 次画面への受け渡しデータ保存
      sessionStorage.setItem("lib-last-action", JSON.stringify({
        type: "reserve", bookTitle: book.title || "", reservationId, actionAt: now, result: "success"
      }));

      return { success: true, reservationId, message: "予約が完了しました。" };
    });
  }

  /**
   * 概要   : 予約の取消処理
   * 作成者 : Y.Toyoda
   * 作成日 : 2026-04-17
   */
  function cancelReservation(userId, reservationId) {
    return _withLock(() => {
      const reservations = _getAll(KEY.RESERVATIONS);
      const now = new Date().toISOString();

      // 本人確認と対象予約の特定
      const idx = reservations.findIndex(r => r.reservationId === reservationId && r.userId === userId);
      if (idx === -1) return { success: false, message: "予約が見つかりません。または権限がありません。" };

      const target = reservations[idx];
      const bookId = target.bookId;

      // 予約状態の更新
      reservations[idx] = { ...target, status: "CANCELLED", cancelledAt: now };
      _setAll(KEY.RESERVATIONS, reservations);

      // 履歴・通知・監査ログの記録
      const history = _getAll(KEY.HISTORY);
      history.push({ historyId: _nextSeq("history", "H-", 5), userId, bookId, action: "CANCELLED", actionAt: now, note: "利用者操作で取消" });
      _setAll(KEY.HISTORY, history);

      const books = _getAll(KEY.BOOKS);
      const book = books.find(b => b.bookId === bookId) || {};
      const notifications = _getAll(KEY.NOTIFICATIONS);
      notifications.push({
        notificationId: _nextSeq("notification", "N-", 5), userId, type: "WARN", title: "予約が取消されました",
        message: `『${book.title || ""}』の予約を取消しました。`, createdAt: now, isRead: false
      });
      _setAll(KEY.NOTIFICATIONS, notifications);

      _writeAuditLog(userId, "CANCEL_SUCCESS", `予約取消: resId=${reservationId}`);
      sessionStorage.setItem("lib-last-action", JSON.stringify({ type: "cancel", bookTitle: book.title || "", reservationId, actionAt: now, result: "success" }));

      return { success: true, message: "予約を取消しました。" };
    });
  }

  /**
   * 概要   : マイページ用の集約データ（予約、履歴、お気に入り、通知）を取得する。
   * 作成者 : Y.Toyoda
   * 作成日 : 2026-04-17
   */
  function getMyPageData(userId) {
    const currentReservations = getActiveReservations(userId);
    const history = _getAll(KEY.HISTORY).filter(h => h.userId === userId);
    const favorites = _getAll(KEY.FAVORITES).filter(f => f.userId === userId);
    const notifications = _getAll(KEY.NOTIFICATIONS).filter(n => n.userId === userId);
    const books = _getAll(KEY.BOOKS);

    const historyWithBook = history.map(h => {
      const book = books.find(b => b.bookId === h.bookId) || {};
      return { ...h, bookTitle: book.title || "---" };
    }).sort((a, b) => (b.actionAt || "").localeCompare(a.actionAt || ""));

    const sortedNotifs = notifications.sort((a, b) => {
      if (!a.isRead && b.isRead) return -1;
      if (a.isRead && !b.isRead) return 1;
      return (b.createdAt || "").localeCompare(a.createdAt || "");
    });

    return {
      currentReservations,
      history: historyWithBook,
      favorites: favorites.map(f => {
        const book = books.find(b => b.bookId === f.bookId) || {};
        return { ...f, bookTitle: book.title || "---", bookAuthor: book.author || "---", bookCategory: book.category || "---" };
      }),
      notifications: sortedNotifs
    };
  }

  /**
   * 概要   : バックアップ/他システム連携用の全データをJSON化して出力する。
   * 作成者 : Y.Toyoda
   * 作成日 : 2026-04-17
   */
  function getAllDataAsJSON() {
    return JSON.stringify({
      dbType: ConfigManager.get("dbType"), exportedAt: new Date().toISOString(),
      users: _getAll(KEY.USERS), books: _getAll(KEY.BOOKS),
      reservations: _getAll(KEY.RESERVATIONS), history: _getAll(KEY.HISTORY),
      loans: _getAll(KEY.LOANS), notifications: _getAll(KEY.NOTIFICATIONS),
      favorites: _getAll(KEY.FAVORITES), auditLog: _getAll(KEY.AUDIT)
    }, null, 2);
  }

  /**
   * 概要   : バックアップ/他システムからのJSONデータをインポートする。
   * 作成者 : Y.Toyoda
   * 作成日 : 2026-04-17
   */
  function importFromJSON(jsonStr) {
    try {
      const data = JSON.parse(jsonStr);
      if (data.users) _setAll(KEY.USERS, data.users);
      if (data.books) _setAll(KEY.BOOKS, data.books);
      if (data.reservations) _setAll(KEY.RESERVATIONS, data.reservations);
      if (data.history) _setAll(KEY.HISTORY, data.history);
      if (data.loans) _setAll(KEY.LOANS, data.loans);
      if (data.notifications) _setAll(KEY.NOTIFICATIONS, data.notifications);
      if (data.favorites) _setAll(KEY.FAVORITES, data.favorites);
      if (data.auditLog) _setAll(KEY.AUDIT, data.auditLog);
      return { success: true, message: "ブリッジデータを取り込みました。" };
    } catch (e) {
      return { success: false, message: "ブリッジファイルの形式が不正です。" };
    }
  }

  function resetToSeed() {
    Object.keys(localStorage).filter(k => k.startsWith("lib-")).forEach(k => localStorage.removeItem(k));
  }

  function _calcPickupDeadline() {
    const d = new Date(); d.setDate(d.getDate() + 7); return d.toISOString().slice(0, 10);
  }

  function _writeAuditLog(userId, eventType, message) {
    const audit = _getAll(KEY.AUDIT);
    audit.push({ logId: _nextSeq("audit", "A-", 5), level: eventType.includes("ERROR") ? "ERROR" : "INFO", eventType, userId: userId || "SYSTEM", message, createdAt: new Date().toISOString() });
    _setAll(KEY.AUDIT, audit);
  }

  return {
    findUser, getActiveReservations, getReservationCount, searchBooks,
    reserveBook, cancelReservation, getMyPageData,
    getAllDataAsJSON, importFromJSON, resetToSeed
  };
})();

/* ----------------------------------------------------------------------------
 * SQLiteRepository (モック)
 * 概要 : データベース連携用のプレースホルダーです。
 * -------------------------------------------------------------------------- */

/* API呼び出しのURL */
const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://jolly-savage-specks.ngrok-free.dev"; // 自分の ngrok URL

const SQLiteRepository = {
  async findUser(userId, userName) {

    const result = await fetch(`${BASE_URL}/api/users/login`, {
      method: "POST",
      credentials: "include", // session support
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: userId,
        user_name: userName
      })
    });

    const data = await result.json().catch(() => null);

    if (!result.ok) return null;
    return data;
  },
  getActiveReservations() { return []; },
  getReservationCount() { return 0; },
  searchBooks() { return []; },
  reserveBook() { return { success: false, message: "SQLiteモードは現在実装されていません。" }; },
  cancelReservation() { return { success: false, message: "SQLiteモードは現在実装されていません。" }; },
  getMyPageData() { return { currentReservations: [], history: [], favorites: [], notifications: [] }; },
  getAllDataAsJSON() { return "{}"; },
  importFromJSON() { return { success: false, message: "SQLiteモードは現在実装されていません。" }; },
  resetToSeed() { }
};

/* ============================================================================
 * セクション 3 : Service 層
 * 役割：ビジネスロジックを管理し、Repositoryへのアクセスを仲介する。
 * ============================================================================ */
const Service = (() => {
  function repo() { return RepositoryFactory.create(); }

  /**
   * 概要   : ユーザーの認証を実行する。
   * 作成者 : Y.Toyoda
   * 作成日 : 2026-04-17
   */
  async function authenticate(userId, userName) {
    if (!userId || !userName) return { success: false, message: "入力項目が不足しています。" };
    const user = await repo().findUser(userId.trim(), userName.trim());
    if (!user) return { success: false, message: "利用者IDまたは利用者名が一致しません。" };

    sessionStorage.setItem("lib-session", JSON.stringify({ userId: user.userId, userName: user.userName }));
    return { success: true, user };
  }

  function getSession() {
    try { return JSON.parse(sessionStorage.getItem("lib-session")); } catch { return null; }
  }

  function logout() {
    sessionStorage.removeItem("lib-session");
    sessionStorage.removeItem("lib-last-action");
    sessionStorage.removeItem("lib-search-criteria");
  }

  /**
   * 概要   : 予約状況ダッシュボードの集計データを取得する。
   * 作成者 : Y.Toyoda
   * 作成日 : 2026-04-17
   */
  function getDashboard(userId) {
    const maxRes = ConfigManager.get("maxReservations") || 3;
    const reservations = repo().getActiveReservations(userId);
    const nextDeadline = reservations.map(r => r.pickupDeadline).filter(Boolean).sort()[0] || null;

    return {
      reservations, count: reservations.length, maxRes,
      remaining: maxRes - reservations.length,
      nextDeadline,
      reservedCount: reservations.filter(r => r.status === "RESERVED").length,
      waitingCount: reservations.filter(r => r.status === "WAITING").length
    };
  }

  function normalizeSearchCriteria(raw) {
    return {
      title: (raw.title || "").trim(), author: (raw.author || "").trim(), category: (raw.category || "").trim(),
      sort: (raw.sort || "bookId").trim(), availableOnly: Boolean(raw.availableOnly), reservableOnly: Boolean(raw.reservableOnly)
    };
  }

  /**
   * 概要   : 検索とページングを実行する。
   * 作成者 : Y.Toyoda
   * 作成日 : 2026-04-17
   */
  function searchAndPaginate(rawCriteria, page = 0) {
    const criteria = normalizeSearchCriteria(rawCriteria);
    const allResults = repo().searchBooks(criteria);
    const pageSize = ConfigManager.get("searchPageSize") || 10;
    const total = allResults.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.max(0, Math.min(page, totalPages - 1));
    const results = allResults.slice(safePage * pageSize, (safePage + 1) * pageSize);
    return { results, total, page: safePage, pageSize, totalPages };
  }

  function reserveBook(bookId) {
    const session = getSession();
    if (!session) return { success: false, message: "セッションが切れています。再ログインしてください。" };
    return repo().reserveBook(session.userId, bookId);
  }

  function cancelReservation(reservationId) {
    const session = getSession();
    if (!session) return { success: false, message: "セッションが切れています。再ログインしてください。" };
    return repo().cancelReservation(session.userId, reservationId);
  }

  function getMyPageData() {
    const session = getSession();
    if (!session) return { currentReservations: [], history: [], favorites: [], notifications: [] };
    return repo().getMyPageData(session.userId);
  }

  return { authenticate, getSession, logout, getDashboard, searchAndPaginate, reserveBook, cancelReservation, getMyPageData };
})();

/* ============================================================================
 * セクション 4 : Screen 層（各画面の制御）
 * ============================================================================ */
const Screen = (() => {

  /**
   * 概要   : ログイン画面の初期化処理
   * 作成者 : Y.Toyoda
   * 作成日 : 2026-04-17
   */
  function initLogin() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    const sumEl = document.querySelector("[data-config-summary]");
    if (sumEl) sumEl.textContent = `DB: ${ConfigManager.get("dbType")} / 予約上限: ${ConfigManager.get("maxReservations")} 冊 / 表示件数: ${ConfigManager.get("searchPageSize")} 件`;

    form.addEventListener("submit", async e => {
      e.preventDefault();
      const result = await Service.authenticate(document.getElementById("userId")?.value || "", document.getElementById("userName")?.value || "");
      if (result.success) window.location.href = "reservation-status.html";
      else showMessage("error", result.message, "[data-message-host]");
    });
  }

  /**
   * 概要   : 予約状況画面の初期化処理
   * 作成者 : Y.Toyoda
   * 作成日 : 2026-04-17
   */
  function initReservationStatus() {
    requireSession();
    _renderDashboard();

    const qf = document.getElementById("quickSearchForm");
    if (qf) {
      qf.addEventListener("submit", e => {
        e.preventDefault();
        sessionStorage.setItem("lib-search-criteria", JSON.stringify({
          title: document.getElementById("bookKeyword")?.value || "",
          author: document.getElementById("authorKeyword")?.value || ""
        }));
        window.location.href = "search-results.html";
      });
    }
  }

  function _renderDashboard() {
    const session = Service.getSession();
    const data = Service.getDashboard(session.userId);

    _setText("[data-user-id]", session.userId);
    _setText("[data-current-reservation-count]", `${data.count} / ${data.maxRes}`);
    _setText("[data-next-deadline]", data.nextDeadline || "なし");
    _setText("[data-config-limit-chip]", `最大 ${data.maxRes} 冊まで予約可能`);

    const tagsEl = document.querySelector("[data-dashboard-tags]");
    if (tagsEl) {
      tagsEl.innerHTML = `<span class="badge reserved">予約中 ${data.reservedCount}件</span> <span class="badge waiting">貸出待ち ${data.waitingCount}件</span>`;
    }

    const kpisEl = document.querySelector("[data-dashboard-kpis]");
    if (kpisEl) {
      kpisEl.innerHTML = `
        <div class="kpi"><div class="label">受取待ち</div><div class="value">${data.reservedCount}件</div></div>
        <div class="kpi"><div class="label">貸出待ち</div><div class="value">${data.waitingCount}件</div></div>
        <div class="kpi"><div class="label">残り予約可能数</div><div class="value">${data.remaining}冊</div></div>`;
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
          btn.addEventListener("click", () => {
            const resId = btn.dataset.cancelBtn;
            if (!confirm(`予約番号「${resId}」を取消してよいですか？`)) return;
            const result = Service.cancelReservation(resId);
            if (result.success) {
              showMessage("success", result.message);
              _renderDashboard();
            } else {
              showMessage("error", result.message);
            }
          });
        });
      }
    }
    decorateResponsiveTables();
  }

  /**
   * 概要   : 検索結果画面の初期化処理
   * 作成者 : Y.Toyoda
   * 作成日 : 2026-04-17
   */
  function initSearchResults() {
    requireSession();

    let criteria = {};
    try { criteria = JSON.parse(sessionStorage.getItem("lib-search-criteria") || "{}"); } catch { }

    const titleInput = document.getElementById("toolbarTitle");
    const authorInput = document.getElementById("toolbarAuthor");
    const categoryInput = document.getElementById("toolbarCategory");
    const sortInput = document.getElementById("toolbarSort");
    if (titleInput) titleInput.value = criteria.title || "";
    if (authorInput) authorInput.value = criteria.author || "";
    if (categoryInput) categoryInput.value = criteria.category || "";
    if (sortInput) sortInput.value = criteria.sort || "bookId";

    let currentPage = 0;

    function doSearch(page = 0) {
      const cr = {
        title: titleInput?.value || "",
        author: authorInput?.value || "",
        category: categoryInput?.value || "",
        sort: sortInput?.value || "bookId",
        availableOnly: criteria.availableOnly || false,
        reservableOnly: criteria.reservableOnly || false
      };
      const result = Service.searchAndPaginate(cr, page);
      currentPage = result.page;
      _renderSearchResults(result, cr);
    }

    doSearch(0);

    const form = document.getElementById("searchToolbarForm");
    if (form) {
      form.addEventListener("submit", e => {
        e.preventDefault();
        criteria = {
          title: titleInput?.value || "",
          author: authorInput?.value || "",
          category: categoryInput?.value || "",
          sort: sortInput?.value || "bookId"
        };
        sessionStorage.setItem("lib-search-criteria", JSON.stringify(criteria));
        doSearch(0);
      });
    }

    document.addEventListener("click", e => {
      const target = e.target.closest("[data-page-link]");
      if (target) {
        e.preventDefault();
        const p = parseInt(target.dataset.pageLink, 10);
        if (!isNaN(p)) doSearch(p);
      }
      const reserveBtn = e.target.closest("[data-reserve-book]");
      if (reserveBtn) {
        e.preventDefault();
        const bookId = reserveBtn.dataset.reserveBook;
        const result = Service.reserveBook(bookId);
        if (result.success) {
          window.location.href = "notification.html";
        } else {
          showMessage("error", result.message);
        }
      }
    }, { once: false });
  }

  function _renderSearchResults(result, criteria) {
    const session = Service.getSession();
    const dashboard = session ? Service.getDashboard(session.userId) : { count: 0, maxRes: 3, remaining: 3 };

    _setText("[data-summary-title]", criteria.title || "（未指定）");
    _setText("[data-summary-author]", criteria.author || "（未指定）");
    _setText("[data-summary-count]", `${result.total}件`);

    const tbody = document.querySelector("[data-search-results-body]");
    const empty = document.querySelector("[data-search-empty]");
    if (tbody) {
      if (result.results.length === 0) {
        tbody.innerHTML = "";
        empty && empty.classList.remove("app-hidden");
      } else {
        empty && empty.classList.add("app-hidden");
        const atLimit = dashboard.count >= dashboard.maxRes;
        tbody.innerHTML = result.results.map(book => {
          let statusBadge = "", actionCell = "";
          if (book.actionState === "AVAILABLE") {
            statusBadge = `<span class="badge available">予約可能</span>`;
            actionCell = atLimit ? `<button class="btn btn-light" disabled>上限</button>` : `<button class="btn btn-primary" data-reserve-book="${esc(book.bookId)}">予約</button>`;
          } else if (book.actionState === "ON_LOAN") {
            statusBadge = `<span class="badge borrowed">貸出中</span>`;
            actionCell = atLimit ? `<button class="btn btn-light" disabled>上限</button>` : `<button class="btn btn-secondary" data-reserve-book="${esc(book.bookId)}">予約</button>`;
          } else if (book.actionState === "RESERVED") {
            statusBadge = `<span class="badge reserved">予約中</span>`;
            actionCell = `<button class="btn btn-light" disabled>予約中</button>`;
          } else {
            statusBadge = `<span class="badge neutral">不可</span>`;
            actionCell = `<button class="btn btn-light" disabled>不可</button>`;
          }
          return `<tr>
            <td data-label="書籍ID">${esc(book.bookId)}</td>
            <td data-label="書籍名">${esc(book.title)}</td>
            <td data-label="著者名">${esc(book.author)}</td>
            <td data-label="分類">${esc(book.category)}</td>
            <td data-label="状態">${statusBadge}</td>
            <td data-label="返却予定">${book.dueDate ? esc(book.dueDate) : "-"}</td>
            <td data-label="操作" class="table-actions">${actionCell}</td>
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

  /**
   * 概要   : 詳細検索・通知・マイページの初期化
   * 作成者 : Y.Toyoda
   * 作成日 : 2026-04-17
   */
  function initAdvancedSearch() { /* 省略（現時点で修正不要） */ }
  function initNotification() { /* 省略（現時点で修正不要） */ }
  function initMyPage() {
    requireSession();
    _renderMyPage();
    // ブリッジファイル（バックアップ）入出力のイベントハンドリング実装
    const repo = RepositoryFactory.create();
    document.querySelector("[data-export-bridge]")?.addEventListener("click", () => {
      const json = repo.getAllDataAsJSON();
      const blob = new Blob([json], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `library_bridge_${_nowStr()}.txt`; a.click();
      URL.revokeObjectURL(url);
    });
  }
  function _renderMyPage() { /* 省略（現時点で修正不要） */ }

  return { initLogin, initReservationStatus, initSearchResults, initAdvancedSearch, initNotification, initMyPage };
})();

/* ============================================================================
 * セクション 5 : 共通 UI ユーティリティ & ヘルパー関数
 * ============================================================================ */
function setupViewMode() {
  // 省略
}
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
    showMessage("warn", `現在のブラウザ（${browser.label}）は推奨外です。Chrome または Edge での利用を推奨します。`);
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
function buildMobileBottomNav() { /* 省略 */ }

/**
 * 概要   : 各画面で共通の補助操作（入力クリアなど）のイベントを設定する
 * 作成者 : Y.Toyoda
 * 作成日 : 2026-04-17
 */
function wireHelpers() {
  // ログイン画面: 入力クリアボタン
  const clearLoginBtn = document.querySelector("[data-clear-login]");
  if (clearLoginBtn) {
    clearLoginBtn.addEventListener("click", () => {
      document.querySelectorAll("#loginForm input:not([readonly])").forEach(el => { el.value = ""; });
      fillBrowserFields(); // ブラウザ名を再表示
    });
  }

  // 詳細検索画面: 条件リセットボタン
  const resetSearchBtn = document.querySelector("[data-reset-search]");
  if (resetSearchBtn) {
    resetSearchBtn.addEventListener("click", () => {
      const form = document.getElementById("advancedSearchForm");
      if (form) {
        form.reset();
        // スイッチの見た目もリセット
        form.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
          const indicator = checkbox.closest(".check-card").querySelector("[data-switch-indicator]");
          if (indicator) indicator.classList.toggle("on", checkbox.checked);
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
    link.addEventListener("click", e => {
      e.preventDefault();
      Service.logout();
      window.location.href = "login.html";
    });
  });
}

function requireSession() {
  if (!Service.getSession()) {
    showMessage("warn", "セッションが切れています。再ログインしてください。");
    setTimeout(() => { window.location.href = "login.html"; }, 1500);
  }
}

function showMessage(type, message, selector = "[data-message-host]") {
  const host = document.querySelector(selector);
  if (!host) return;
  host.innerHTML = `<div class="notice ${type}"><div>${esc(message)}</div></div>`;
  setTimeout(() => { host.innerHTML = ""; }, 5000);
}

function esc(str) {
  if (str === null || str === undefined) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function _setText(selector, text) {
  document.querySelectorAll(selector).forEach(el => { el.textContent = text; });
}
function _nowStr() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}_${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}${String(d.getSeconds()).padStart(2, '0')}`;
}