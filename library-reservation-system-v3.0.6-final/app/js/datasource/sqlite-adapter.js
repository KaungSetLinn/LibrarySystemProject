/*
 * =============================================================================
 * ファイル名 : app/js/datasource/sqlite-adapter.js
 * 概要       : SQLiteAdapter（RP01 SQLiteRepository 本実装）。
 *              sql.js（WASM SQLite）でブラウザ単体動作モードでも実 SQLite を動かす。
 *              IndexedDB に DB バイナリを永続化し、リロード後もデータ保持。
 *
 *              v3.0.3 までは ExcelAdapter に委譲する Stub だったが、
 *              v3.0.4 で本実装化（S-1 対応の最終形）。
 *
 *              優先順:
 *                1) sql.js が読み込めれば本実装で動作
 *                2) sql.js 不可 + server/ 起動済みなら ApiAdapter にフォールバック
 *                3) いずれも不可なら ExcelAdapter にフォールバック
 *
 * 仕様書トレーサビリティ:
 *   - 内部仕様書 v4.0  RP01 SQLiteRepository / CF03 createDataSource
 *   - DB仕様書   v4.0  §3 PRAGMA / §5 全テーブル / §10 トランザクション
 *   - 要求仕様書 v4.0  §11 将来拡張 / §5.2 設定SSOT
 *   - 改訂対象        S-1（SQLite 非実体化の解消）
 *
 * 改訂履歴:
 *   v3.0.4  2026-05-05  Y.Toyoda  新規作成（sql.js 本実装、IndexedDB 永続化）
 *
 * @author  Y.Toyoda
 * @version v3.0.4
 * =============================================================================
 */
"use strict";

const SQLiteAdapter = (() => {

  // ===== 内部状態 =====
  let _SQL = null;          // sql.js Module
  let _db  = null;          // sql.js Database インスタンス
  let _ready = false;       // 初期化完了フラグ
  let _initPromise = null;  // 並行初期化を防ぐ Promise キャッシュ
  const IDB_NAME = "lib-sqlite-db";
  const IDB_STORE = "binaries";
  const IDB_KEY = "library.db";

  /**
   * _log
   * 概要 : Logger があれば使用、無ければ console。
   */
  function _log(level, where, msg) {
    if (window.Logger && typeof Logger[level] === "function") {
      Logger[level](where, msg);
    } else if (typeof console !== "undefined") {
      const fn = console[level === "warn" ? "warn"
               : level === "error" ? "error"
               : level === "info"  ? "info" : "log"];
      fn("[" + where + "] " + msg);
    }
  }

  /* =====================================================================
   * 1. 永続化層（IndexedDB）
   * ===================================================================== */

  /**
   * _idbOpen
   * 概要 : IndexedDB を開く（必要なら作成）。
   * @returns {Promise<IDBDatabase>}
   */
  function _idbOpen() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror   = () => reject(req.error);
    });
  }

  /**
   * _idbLoad
   * 概要 : IndexedDB から DB バイナリ（Uint8Array）を読み出す。
   * @returns {Promise<Uint8Array|null>}
   */
  async function _idbLoad() {
    try {
      const db = await _idbOpen();
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(IDB_STORE, "readonly");
        const req = tx.objectStore(IDB_STORE).get(IDB_KEY);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror   = () => reject(req.error);
      });
    } catch (e) {
      _log("warn", "SQLiteAdapter._idbLoad", "IndexedDB 読込失敗: " + e.message);
      return null;
    }
  }

  /**
   * _idbSave
   * 概要 : DB バイナリを IndexedDB に保存する。
   * @param {Uint8Array} bytes
   * @returns {Promise<void>}
   */
  async function _idbSave(bytes) {
    try {
      const db = await _idbOpen();
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(IDB_STORE, "readwrite");
        tx.objectStore(IDB_STORE).put(bytes, IDB_KEY);
        tx.oncomplete = () => resolve();
        tx.onerror    = () => reject(tx.error);
      });
    } catch (e) {
      _log("warn", "SQLiteAdapter._idbSave", "IndexedDB 保存失敗: " + e.message);
    }
  }

  /**
   * _persist
   * 概要 : 現在の DB を Uint8Array にエクスポートし IndexedDB に保存する。
   *        書込系メソッドの末尾で呼ばれる。
   * @returns {void}
   */
  function _persist() {
    if (!_db) return;
    try {
      const bytes = _db.export();
      // 非同期だが待たない（次操作までに完了する想定）
      _idbSave(bytes);
    } catch (e) {
      _log("warn", "SQLiteAdapter._persist", "export 失敗: " + e.message);
    }
  }

  /* =====================================================================
   * 2. sql.js 初期化
   * ===================================================================== */

  /**
   * _loadSqlJs
   * 概要 : sql.js が window に居なければ CDN からロードする。
   *        ローカル file:// / オフライン環境では失敗する場合あり。
   *        失敗時は null を返し、フォールバックを誘発する。
   *
   * @returns {Promise<Object|null>} initSqlJs 関数 or null
   */
  async function _loadSqlJs() {
    if (typeof window.initSqlJs === "function") return window.initSqlJs;
    return new Promise(resolve => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js";
      s.async = true;
      s.onload  = () => resolve(window.initSqlJs || null);
      s.onerror = () => {
        _log("warn", "SQLiteAdapter._loadSqlJs",
          "sql.js の CDN ロード失敗。オフライン環境ではフォールバックします。");
        resolve(null);
      };
      document.head.appendChild(s);
    });
  }

  /**
   * _createSchema
   * 概要 : 9 テーブル + INDEX + 部分一意 INDEX を作成する。
   *        DB仕様書 v4.0 §5 / §8 と整合。
   * @returns {void}
   */
  function _createSchema() {
    _db.run(`
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_code TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        password_hash TEXT,
        role TEXT NOT NULL DEFAULT 'STUDENT',
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS books (
        book_id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL, author TEXT, category TEXT,
        arrival_date TEXT, is_disabled INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE INDEX IF NOT EXISTS idx_books_title    ON books(title);
      CREATE INDEX IF NOT EXISTS idx_books_author   ON books(author);
      CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);

      CREATE TABLE IF NOT EXISTS reservations (
        reservation_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        book_id INTEGER NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('RESERVED','CANCELED','FULFILLED')),
        reserved_at TEXT NOT NULL,
        pickup_deadline TEXT,
        canceled_at TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY(user_id) REFERENCES users(user_id),
        FOREIGN KEY(book_id) REFERENCES books(book_id)
      );
      CREATE INDEX IF NOT EXISTS idx_res_user_status ON reservations(user_id, status);
      CREATE INDEX IF NOT EXISTS idx_res_book_status ON reservations(book_id, status);
      CREATE UNIQUE INDEX IF NOT EXISTS uq_reservations_active
        ON reservations(user_id, book_id) WHERE status='RESERVED';

      CREATE TABLE IF NOT EXISTS notifications (
        notification_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL, type TEXT NOT NULL,
        title TEXT NOT NULL, body TEXT,
        is_read INTEGER NOT NULL DEFAULT 0, read_at TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY(user_id) REFERENCES users(user_id)
      );
      CREATE TABLE IF NOT EXISTS favorites (
        favorite_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        book_id INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        UNIQUE(user_id, book_id),
        FOREIGN KEY(user_id) REFERENCES users(user_id),
        FOREIGN KEY(book_id) REFERENCES books(book_id)
      );
      CREATE TABLE IF NOT EXISTS audit_log (
        audit_log_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER, action TEXT NOT NULL,
        target_table TEXT NOT NULL, target_id INTEGER,
        changes TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS system_config (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `);
  }

  /**
   * _seedFromLibrarySeed
   * 概要 : library-seed.js から初期データを投入する。
   *        DB が完全に空のときのみ実行する。
   * @returns {void}
   */
  function _seedFromLibrarySeed() {
    const userCount = _db.exec("SELECT COUNT(*) AS c FROM users")[0].values[0][0];
    if (userCount > 0) return;

    const seed = window.LIBRARY_SEED_DATA || {};
    const users = seed.users || [
      { userId: "1", userName: "佐藤翔太" },
      { userId: "2", userName: "田中花子" },
      { userId: "3", userName: "山田教授" }
    ];
    const books = seed.books || [];

    _db.run("BEGIN");
    try {
      const insU = _db.prepare("INSERT INTO users(user_code, name, role) VALUES(?, ?, ?)");
      users.forEach(u => insU.run([String(u.userId || u.user_code || u.id),
                                   u.userName || u.name,
                                   u.role || "STUDENT"]));
      insU.free();

      const insB = _db.prepare(
        "INSERT INTO books(title, author, category, arrival_date, is_disabled) VALUES(?, ?, ?, ?, ?)");
      books.forEach(b => insB.run([
        b.title, b.author || null, b.category || null,
        b.arrivalDate || null,
        (b.canReserve === false || b.isDisabled === true) ? 1 : 0
      ]));
      insB.free();

      const insC = _db.prepare("INSERT OR REPLACE INTO system_config(key, value) VALUES(?, ?)");
      insC.run(["dbType", "SQLite"]);
      insC.run(["schemaVersion", "3.0.4"]);
      insC.run(["maxReservations", "3"]);
      insC.run(["searchPageSize", "10"]);
      insC.free();

      _db.run("COMMIT");
      _log("info", "SQLiteAdapter._seed",
        "初期データ投入完了 users=" + users.length + " books=" + books.length);
    } catch (e) {
      _db.run("ROLLBACK");
      _log("error", "SQLiteAdapter._seed", "ROLLBACK: " + e.message);
    }
  }

  /**
   * init
   * 概要 : sql.js を初期化する（並行呼出は1回にまとめる）。
   *        IndexedDB に保存済みの DB があれば復元、無ければ新規作成。
   *
   * @returns {Promise<boolean>} 成功時 true、失敗時 false（呼び出し側でフォールバック判定）
   * @spec    DB仕様書 §3 PRAGMA / §5 テーブル
   */
  function init() {
    if (_initPromise) return _initPromise;
    _initPromise = (async () => {
      try {
        const initSqlJs = await _loadSqlJs();
        if (!initSqlJs) return false;

        _SQL = await initSqlJs({
          locateFile: f => "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/" + f
        });

        const saved = await _idbLoad();
        if (saved && saved.byteLength > 0) {
          _db = new _SQL.Database(new Uint8Array(saved));
          _log("info", "SQLiteAdapter.init",
            "IndexedDB から DB を復元 (" + saved.byteLength + " bytes)");
        } else {
          _db = new _SQL.Database();
          _createSchema();
          _seedFromLibrarySeed();
          _persist();
          _log("info", "SQLiteAdapter.init", "新規 DB を作成・初期データ投入");
        }
        // PRAGMA は接続毎
        _db.run("PRAGMA foreign_keys = ON;");
        _ready = true;
        return true;
      } catch (e) {
        _log("error", "SQLiteAdapter.init", "初期化失敗: " + e.message);
        _ready = false;
        return false;
      }
    })();
    return _initPromise;
  }

  function isReady() { return _ready; }

  /* =====================================================================
   * 3. SQL ヘルパ
   * ===================================================================== */

  /**
   * _all
   * 概要 : SELECT を実行し、行を配列で返す（列名キーのオブジェクト）。
   * @param {string} sql
   * @param {Array} [params]
   * @returns {Array<Object>}
   */
  function _all(sql, params) {
    if (!_ready) return [];
    const stmt = _db.prepare(sql);
    if (params) stmt.bind(params);
    const rows = [];
    while (stmt.step()) rows.push(stmt.getAsObject());
    stmt.free();
    return rows;
  }

  /**
   * _one
   * @returns {Object|null}
   */
  function _one(sql, params) {
    const r = _all(sql, params);
    return r.length ? r[0] : null;
  }

  /**
   * _run
   * 概要 : INSERT/UPDATE/DELETE を実行し、lastInsertRowid を返す。
   * @returns {{changes: number, lastInsertRowid: number}}
   */
  function _run(sql, params) {
    if (!_ready) return { changes: 0, lastInsertRowid: 0 };
    const stmt = _db.prepare(sql);
    if (params) stmt.bind(params);
    stmt.step();
    stmt.free();
    const lastId = _db.exec("SELECT last_insert_rowid() AS id")[0].values[0][0];
    return { changes: 1, lastInsertRowid: lastId };
  }

  /**
   * _tx
   * 概要 : トランザクションを張って fn を実行する（エラー時 ROLLBACK）。
   * @param {Function} fn
   * @returns {*} fn の戻り値
   */
  function _tx(fn) {
    _db.run("BEGIN IMMEDIATE");
    try {
      const r = fn();
      _db.run("COMMIT");
      return r;
    } catch (e) {
      try { _db.run("ROLLBACK"); } catch (_) { /* noop */ }
      throw e;
    }
  }

  function _now() { return new Date().toISOString(); }

  /* =====================================================================
   * 4. IRepository 契約の実装
   * ===================================================================== */

  /** @spec RF-01 / AU01 */
  function findUser(userCode, userName) {
    if (!_ready) return null;
    return _one(
      "SELECT user_id AS userId, user_code AS userCode, name AS userName, role FROM users WHERE user_code=? AND name=?",
      [String(userCode), String(userName)]
    );
  }

  /** @spec RF-03 / RV01 */
  function getActiveReservations(userId) {
    if (!_ready) return [];
    return _all(`
      SELECT r.reservation_id AS reservationId, r.book_id AS bookId,
             b.title, b.author, r.status, r.reserved_at AS reservedAt
      FROM reservations r
      LEFT JOIN books b ON r.book_id = b.book_id
      WHERE r.user_id=? AND r.status='RESERVED'
      ORDER BY r.reserved_at DESC`, [Number(userId)]);
  }

  /** @spec RF-03 / RV01 */
  function getReservationCount(userId) {
    if (!_ready) return 0;
    const r = _one("SELECT COUNT(*) AS c FROM reservations WHERE user_id=? AND status='RESERVED'",
      [Number(userId)]);
    return r ? r.c : 0;
  }

  /** @spec RF-04/05/06 / SR02 / SR04 */
  function searchBooks(criteria) {
    if (!_ready) return [];
    const c = criteria || {};
    const conds = [], params = [];
    if (c.title)    { conds.push("title LIKE ?");  params.push("%" + c.title + "%"); }
    if (c.author)   { conds.push("author LIKE ?"); params.push("%" + c.author + "%"); }
    if (c.category) { conds.push("category = ?");  params.push(c.category); }
    const where = conds.length ? "WHERE " + conds.join(" AND ") : "";
    const order = ({
      title: "title ASC, book_id ASC",
      author: "author ASC, book_id ASC",
      arrivalDateDesc: "arrival_date DESC, book_id ASC",
      bookId: "book_id ASC"
    })[c.sort] || "book_id ASC";

    const rows = _all(`SELECT book_id AS bookId, title, author, category,
                              arrival_date AS arrivalDate, is_disabled AS isDisabled
                       FROM books ${where} ORDER BY ${order}`, params);

    const userId = c.userId ? Number(c.userId) : null;
    const myRes = userId ? new Set(_all(
      "SELECT book_id FROM reservations WHERE user_id=? AND status='RESERVED'",
      [userId]).map(r => r.book_id)) : new Set();
    const otherRes = userId ? new Set(_all(
      "SELECT DISTINCT book_id FROM reservations WHERE user_id<>? AND status='RESERVED'",
      [userId]).map(r => r.book_id)) : new Set();

    return rows.map(b => {
      let actionState, actionLabel;
      if (b.isDisabled) { actionState = "DISABLED"; actionLabel = "不可"; }
      else if (myRes.has(b.bookId))    { actionState = "RESERVED"; actionLabel = "予約済（自分）"; }
      else if (otherRes.has(b.bookId)) { actionState = "RESERVED"; actionLabel = "予約済（他利用者）"; }
      else                              { actionState = "AVAILABLE"; actionLabel = "予約する"; }
      return Object.assign({}, b, {
        bookId: String(b.bookId),
        status: b.isDisabled ? "利用停止" : "在庫あり",
        actionState, actionLabel, dueDate: null
      });
    });
  }

  /** @spec RF-07 / RV03 / DB §10 */
  function reserveBook(userId, bookId) {
    if (!_ready) return { success: false, messageCode: "E10", message: "DB未初期化です。" };
    try {
      const result = _tx(() => {
        const book = _one("SELECT * FROM books WHERE book_id=?", [Number(bookId)]);
        if (!book) return { success: false, messageCode: "W17", message: "対象の書籍が見つかりません。" };
        if (book.is_disabled === 1) {
          return { success: false, messageCode: "W13", message: "この書籍は利用停止中のため予約できません。" };
        }
        const dup = _one(
          "SELECT 1 AS x FROM reservations WHERE user_id=? AND book_id=? AND status='RESERVED'",
          [Number(userId), Number(bookId)]);
        if (dup) return { success: false, messageCode: "W11", message: "この書籍はすでに予約済です。" };
        const cnt = _one(
          "SELECT COUNT(*) AS c FROM reservations WHERE user_id=? AND status='RESERVED'",
          [Number(userId)]).c;
        if (cnt >= 3) return { success: false, messageCode: "W12", message: "予約上限に達しています（3冊）。" };

        const now = _now();
        const r = _run(`INSERT INTO reservations(user_id, book_id, status, reserved_at, created_at, updated_at)
                        VALUES(?,?,'RESERVED',?,?,?)`,
          [Number(userId), Number(bookId), now, now, now]);
        _run("INSERT INTO audit_log(user_id, action, target_table, target_id, changes) VALUES(?,?,?,?,?)",
          [Number(userId), "RESERVE_BOOK", "reservations", r.lastInsertRowid,
           JSON.stringify({ bookId, status: "RESERVED" })]);
        return { success: true, messageCode: "I02", message: "予約を登録しました。",
                 reservationId: r.lastInsertRowid };
      });
      _persist();
      return result;
    } catch (e) {
      if (String(e.message || "").includes("UNIQUE")) {
        return { success: false, messageCode: "W11", message: "この書籍はすでに予約済です。" };
      }
      _log("error", "SQLiteAdapter.reserveBook", e.message);
      return { success: false, messageCode: "E10", message: "予約処理に失敗しました。" };
    }
  }

  /** @spec RF-08 / RV02 */
  function cancelReservation(userId, reservationId) {
    if (!_ready) return { success: false, messageCode: "E10", message: "DB未初期化です。" };
    try {
      const result = _tx(() => {
        const r = _one("SELECT * FROM reservations WHERE reservation_id=? AND user_id=?",
          [Number(reservationId), Number(userId)]);
        if (!r) return { success: false, messageCode: "W17", message: "対象の予約が見つかりません。" };
        if (r.status !== "RESERVED") {
          return { success: false, messageCode: "W14", message: "キャンセル可能な予約ではありません。" };
        }
        const now = _now();
        _run("UPDATE reservations SET status='CANCELED', canceled_at=?, updated_at=? WHERE reservation_id=?",
          [now, now, Number(reservationId)]);
        _run("INSERT INTO audit_log(user_id, action, target_table, target_id, changes) VALUES(?,?,?,?,?)",
          [Number(userId), "CANCEL_RESERVATION", "reservations", Number(reservationId),
           JSON.stringify({ from: "RESERVED", to: "CANCELED" })]);
        return { success: true, messageCode: "I03", message: "予約をキャンセルしました。" };
      });
      _persist();
      return result;
    } catch (e) {
      _log("error", "SQLiteAdapter.cancelReservation", e.message);
      return { success: false, messageCode: "E10", message: "取消処理に失敗しました。" };
    }
  }

  /** @spec RF-10 / MP01 */
  function getMyPageData(userId) {
    if (!_ready) return { currentReservations: [], history: [], favorites: [], notifications: [] };
    const uid = Number(userId);
    return {
      currentReservations: _all(`SELECT r.reservation_id AS reservationId, r.book_id AS bookId,
                                        b.title, b.author, r.status, r.reserved_at AS reservedAt
                                 FROM reservations r LEFT JOIN books b ON r.book_id=b.book_id
                                 WHERE r.user_id=? AND r.status='RESERVED'
                                 ORDER BY r.reserved_at DESC`, [uid]),
      history: _all(`SELECT r.reservation_id AS reservationId, r.book_id AS bookId, b.title,
                            r.status, r.reserved_at AS reservedAt, r.canceled_at AS canceledAt
                     FROM reservations r LEFT JOIN books b ON r.book_id=b.book_id
                     WHERE r.user_id=? ORDER BY r.reserved_at DESC LIMIT 50`, [uid]),
      favorites: _all(`SELECT f.favorite_id AS favoriteId, f.book_id AS bookId, b.title, b.author
                       FROM favorites f LEFT JOIN books b ON f.book_id=b.book_id
                       WHERE f.user_id=? ORDER BY f.created_at DESC`, [uid]),
      notifications: _all(`SELECT notification_id AS notificationId, type, title, body,
                                  is_read AS isRead, created_at AS createdAt
                           FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 50`, [uid])
    };
  }

  /** @spec RF-09 */
  function getNotifications(userId) {
    if (!_ready) return [];
    return _all(`SELECT notification_id AS notificationId, type, title, body,
                        is_read AS isRead, created_at AS createdAt
                 FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 100`,
      [Number(userId)]);
  }

  /**
   * markNotificationRead（v3.0.6 / API-14 正仕様化）
   * 概要: 本人の通知を既読化、readAt 記録。
   *        ServiceResult 形式 { ok, messageCode, message, data? } を返す。
   * @spec  RF-09 / MP03 / 外部 v4.0a-rev3 §8.4.14
   */
  function markNotificationRead(userId, notificationId) {
    if (!_ready) return { ok: false, messageCode: "E10", message: "SQLite 未初期化" };
    const u = Number(userId), nid = Number(notificationId);
    const row = _one("SELECT * FROM notifications WHERE notification_id=? AND user_id=?", [nid, u]);
    if (!row) return { ok: false, messageCode: "W17", message: "対象の通知が見つかりません。" };
    const now = _now();
    _run("UPDATE notifications SET is_read=1, read_at=? WHERE notification_id=?", [now, nid]);
    _writeAuditLocal(u, "MARK_READ", "notifications", nid, null);
    _persist();
    return { ok: true, messageCode: "I04", message: "通知を既読にしました。",
             data: { notificationId: nid, isRead: true, readAt: now } };
  }

  /**
   * listFavorites（v3.0.6 / API-11 新規）
   * @spec  RF-10 / MP02 / 外部 v4.0a-rev3 §8.4.11
   */
  function listFavorites(userId, opts) {
    if (!_ready) return { count: 0, page: 0, pageSize: 20, totalPages: 1, favorites: [] };
    const o = opts || {};
    const u = Number(userId);
    const page = Math.max(0, parseInt(o.page, 10) || 0);
    const pageSize = Math.min(50, Math.max(1, parseInt(o.pageSize, 10) || 20));
    const count = (_one("SELECT COUNT(*) AS c FROM favorites WHERE user_id=?", [u]) || {c:0}).c;
    const favorites = _all(
      "SELECT f.favorite_id AS favoriteId, f.book_id AS bookId, b.title, b.author, b.category, f.created_at AS addedAt " +
      "FROM favorites f LEFT JOIN books b ON f.book_id = b.book_id WHERE f.user_id = ? " +
      "ORDER BY f.created_at DESC LIMIT ? OFFSET ?",
      [u, pageSize, page * pageSize]);
    return { count, page, pageSize, totalPages: Math.max(1, Math.ceil(count / pageSize)), favorites };
  }

  /**
   * addFavorite（v3.0.6 / API-12 正仕様化）
   * 概要: UNIQUE(user_id, book_id) 違反時は W19、書籍不在は W17。
   * @spec  RF-10 / MP02 / 外部 v4.0a-rev3 §8.4.12
   */
  function addFavorite(userId, bookId) {
    if (!_ready) return { ok: false, messageCode: "E10", message: "SQLite 未初期化" };
    const u = Number(userId), b = Number(bookId);
    const book = _one("SELECT * FROM books WHERE book_id=?", [b]);
    if (!book) return { ok: false, messageCode: "W17", message: "対象の書籍が見つかりません。" };
    // 重複チェック（UNIQUE と INSERT OR IGNORE だと favoriteId が不定になるので事前検証）
    const dup = _one("SELECT favorite_id FROM favorites WHERE user_id=? AND book_id=?", [u, b]);
    if (dup) return { ok: false, messageCode: "W19", message: "既にお気に入りに登録されています。" };
    const now = _now();
    _run("INSERT INTO favorites(user_id, book_id, created_at) VALUES(?,?,?)", [u, b, now]);
    const fid = (_one("SELECT last_insert_rowid() AS id") || {id:0}).id;
    _writeAuditLocal(u, "ADD_FAVORITE", "favorites", fid, { bookId: b });
    _persist();
    return { ok: true, messageCode: "I05", message: "お気に入りに追加しました。",
             data: { favoriteId: fid, bookId: b, addedAt: now } };
  }

  /**
   * removeFavorite（v3.0.6 / API-13 正仕様化）
   * 概要: 本人の favorite を favoriteId で削除。不在は W17。
   *        引数 (userId, favoriteId)（v3.0.5 までは bookId だったが、外部仕様 v4.0a-rev3 に合わせて favoriteId に変更）
   * @spec  RF-10 / MP02 / 外部 v4.0a-rev3 §8.4.13
   */
  function removeFavorite(userId, favoriteId) {
    if (!_ready) return { ok: false, messageCode: "E10", message: "SQLite 未初期化" };
    const u = Number(userId), fid = Number(favoriteId);
    const row = _one("SELECT * FROM favorites WHERE favorite_id=? AND user_id=?", [fid, u]);
    if (!row) return { ok: false, messageCode: "W17", message: "対象のお気に入りが見つかりません。" };
    _run("DELETE FROM favorites WHERE favorite_id=?", [fid]);
    _writeAuditLocal(u, "REMOVE_FAVORITE", "favorites", fid, { bookId: row.book_id });
    _persist();
    return { ok: true, messageCode: "I06", message: "お気に入りから削除しました。", data: null };
  }

  /**
   * _writeAuditLocal（v3.0.6 追加）
   * SQLite アダプタ内部の監査ログ記録ヘルパ。
   */
  function _writeAuditLocal(userId, action, targetTable, targetId, changes) {
    try {
      _run("INSERT INTO audit_log(user_id, action, target_table, target_id, changes) VALUES(?,?,?,?,?)",
        [userId || null, action, targetTable, targetId || null,
         changes ? JSON.stringify(changes) : null]);
    } catch (e) {
      _log("warn", "SQLiteAdapter._writeAuditLocal", e.message);
    }
  }

  /** @spec RF-11 / API-08 */
  function exportAll() {
    if (!_ready) return "{}";
    const tables = ["users", "books", "reservations", "notifications",
                    "favorites", "audit_log", "system_config"];
    const out = {};
    tables.forEach(t => out[t] = _all("SELECT * FROM " + t));
    return JSON.stringify(out, null, 2);
  }

  function importAll(jsonStr) {
    if (!_ready) return { success: false, messageCode: "E10", message: "DB未初期化です。" };
    try {
      const data = JSON.parse(jsonStr);
      _tx(() => {
        ["audit_log", "favorites", "notifications", "reservations",
         "books", "users", "system_config"].forEach(t => _run("DELETE FROM " + t));
        Object.keys(data).forEach(table => {
          (data[table] || []).forEach(row => {
            const cols = Object.keys(row);
            const placeholders = cols.map(() => "?").join(",");
            const values = cols.map(c => row[c]);
            _run(`INSERT INTO ${table}(${cols.join(",")}) VALUES(${placeholders})`, values);
          });
        });
      });
      _persist();
      return { success: true, messageCode: "I00", message: "取込が完了しました。" };
    } catch (e) {
      _log("error", "SQLiteAdapter.importAll", e.message);
      return { success: false, messageCode: "E10", message: "取込に失敗しました: " + e.message };
    }
  }

  function resetToSeed() {
    if (!_ready) return;
    _tx(() => {
      ["audit_log", "favorites", "notifications", "reservations",
       "books", "users", "system_config"].forEach(t => _run("DELETE FROM " + t));
    });
    _seedFromLibrarySeed();
    _persist();
  }

  /** @spec RF-13 / LN01 */
  function handleLoanEvent(event) {
    if (!_ready) return { success: false, messageCode: "E10", message: "DB未初期化です。" };
    // 簡易対応：受け取り時に該当 RESERVED を FULFILLED に更新（loans テーブルは v3.0.4 では未保有）
    if (event && event.eventType === "LOAN" && event.userId && event.bookId) {
      _tx(() => {
        _run(`UPDATE reservations SET status='FULFILLED', updated_at=?
              WHERE user_id=? AND book_id=? AND status='RESERVED'`,
          [_now(), Number(event.userId), Number(event.bookId)]);
      });
      _persist();
    }
    return { success: true, messageCode: "I00", message: "OK" };
  }

  /** @spec RF-12 / LG01 */
  function writeAuditLog(eventType, level, userId, message, detail) {
    if (!_ready) return;
    try {
      _run("INSERT INTO audit_log(user_id, action, target_table, target_id, changes) VALUES(?,?,?,?,?)",
        [userId ? Number(userId) : null, String(eventType),
         (level || "INFO"), null,
         JSON.stringify({ message, detail: detail || null })]);
      _persist();
    } catch (e) {
      _log("warn", "SQLiteAdapter.writeAuditLog", e.message);
    }
  }

  /** B-9: 1冊取得 */
  function findBookById(bookId) {
    if (!_ready) return null;
    const r = _one("SELECT book_id AS bookId, title, author, category, arrival_date AS arrivalDate, is_disabled AS isDisabled FROM books WHERE book_id=?",
      [Number(bookId)]);
    if (!r) return null;
    r.bookId = String(r.bookId);
    return r;
  }

  /* =====================================================================
   * 5. 公開 API（IRepository 契約）
   * ===================================================================== */
  return Object.freeze({
    init, isReady,
    findUser,
    getActiveReservations, getReservationCount,
    searchBooks,
    reserveBook, cancelReservation,
    getMyPageData, getNotifications, markNotificationRead,
    listFavorites, addFavorite, removeFavorite,
    exportAll, importAll, resetToSeed,
    handleLoanEvent,
    writeAuditLog,
    findBookById
  });
})();

window.SQLiteAdapter = SQLiteAdapter;

/* =============================================================================
 * v3.0.4 起動時の自動初期化
 *  dbType=SQLite のときのみ init() を起動。失敗時は RepositoryFactory が
 *  ApiAdapter → ExcelAdapter にフォールバックする。
 * ============================================================================= */
(function autoInit() {
  "use strict";
  function start() {
    var dbType = (window.ConfigManager && typeof ConfigManager.get === "function")
      ? ConfigManager.get("dbType") : null;
    if (dbType !== "SQLite") return;
    SQLiteAdapter.init().then(ok => {
      if (ok) {
        if (window.Logger) Logger.info("SQLiteAdapter",
          "本実装で起動完了（sql.js + IndexedDB 永続化）");
        // スタブモードバッジは不要なので除去
        var badge = document.querySelector(".stub-mode-badge");
        if (badge) badge.remove();
      } else {
        if (window.Logger) Logger.warn("SQLiteAdapter",
          "本実装の初期化に失敗。ApiAdapter/ExcelAdapter にフォールバックします。");
      }
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(start, 200));
  } else {
    setTimeout(start, 200);
  }
})();
