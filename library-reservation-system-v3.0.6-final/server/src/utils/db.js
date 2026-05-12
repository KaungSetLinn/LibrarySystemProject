/*
 * =============================================================================
 * ファイル名 : server/src/utils/db.js
 * 概要       : SQLite 接続層（better-sqlite3 直接使用）。
 *              起動時に PRAGMA 必須設定（外部キー有効化、WAL モード等）を適用する。
 *
 * 仕様書トレーサビリティ:
 *   - DB仕様書   v4.0  §3 PRAGMA / §5 テーブル定義 / §8 INDEX
 *   - 改訂対象        B-10（DBパス絶対化）/ A-6（password_hash 列）/ S-3（部分一意INDEX）
 *
 * 改訂履歴:
 *   v3.0    2026-05-04  Y.Toyoda  新規作成
 *   v3.0.3  2026-05-05  Y.Toyoda  __dirname基準絶対パス化（B-10）、password_hash 列追加（A-6）、
 *                                 部分一意 INDEX uq_reservations_active 追加（S-3）
 *
 * @author  Y.Toyoda
 * @version v3.0.3
 * =============================================================================
 */
"use strict";

const Database = require("better-sqlite3");
const path     = require("path");
const fs       = require("fs");
const { logger } = require("./logger");

// ★ B-10: __dirname 基準の絶対パスに変更（CWD 依存を排除）
//   server/src/utils/db.js → server/data/library.db
const DATA_DIR = path.join(__dirname, "..", "..", "data");
const DB_PATH  = path.join(DATA_DIR, "library.db");

let _db = null;

/**
 * initDb
 * 概要 : SQLite を初期化する。data/ ディレクトリ作成、DB 接続、
 *        PRAGMA 設定、テーブル作成、INDEX作成を実行する。
 *
 * @returns {Promise<void>}
 * @spec    DB §3 PRAGMA 必須設定 / §5 テーブル / §8 INDEX
 */
async function initDb() {
  // data/ ディレクトリを作成（絶対パス）
  fs.mkdirSync(DATA_DIR, { recursive: true });

  _db = new Database(DB_PATH);

  // PRAGMA 必須設定（DB仕様書 §3）
  _db.pragma("foreign_keys = ON");
  _db.pragma("journal_mode = WAL");
  _db.pragma("synchronous = NORMAL");
  _db.pragma("busy_timeout = 5000");
  _db.pragma("temp_store = MEMORY");
  logger.info("db.initDb", "PRAGMA 設定完了 path=" + DB_PATH);

  // テーブル作成
  _db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      password_hash TEXT,                 -- v3.0.3 追加（A-6 / EX-01 構造のみ）
      role TEXT NOT NULL DEFAULT 'STUDENT',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS books (
      book_id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL, author TEXT, category TEXT,
      arrival_date TEXT, is_disabled INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS reservations (
      reservation_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      book_id INTEGER NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('RESERVED','CANCELED','FULFILLED')),
      reserved_at TEXT NOT NULL,
      pickup_deadline TEXT,
      canceled_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
      FOREIGN KEY(book_id) REFERENCES books(book_id) ON DELETE RESTRICT ON UPDATE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_reservations_user_status ON reservations(user_id, status);
    CREATE INDEX IF NOT EXISTS idx_reservations_book_status ON reservations(book_id, status);
    -- v3.0.3 追加（S-3）: 同一ユーザー・同一書籍の RESERVED は1件まで（DB側で強制）
    CREATE UNIQUE INDEX IF NOT EXISTS uq_reservations_active
      ON reservations(user_id, book_id) WHERE status='RESERVED';

    CREATE TABLE IF NOT EXISTS notifications (
      notification_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL, type TEXT NOT NULL,
      title TEXT NOT NULL, body TEXT,
      is_read INTEGER NOT NULL DEFAULT 0, read_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read, created_at);
    -- v3.0.6 追加（v4.0a-rev3 C-2）: favorites テーブル
    CREATE TABLE IF NOT EXISTS favorites (
      favorite_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      book_id INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
      FOREIGN KEY(book_id) REFERENCES books(book_id) ON DELETE CASCADE,
      UNIQUE(user_id, book_id)
    );
    CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id, created_at);
    CREATE TABLE IF NOT EXISTS audit_log (
      audit_log_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER, action TEXT NOT NULL,
      target_table TEXT NOT NULL, target_id INTEGER,
      changes TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_audit_user_created ON audit_log(user_id, created_at);
    CREATE TABLE IF NOT EXISTS system_config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // ★ A-6: 既存DBに対するマイグレーション補助（password_hash が無ければ追加）
  try {
    const cols = _db.prepare("PRAGMA table_info(users)").all().map(r => r.name);
    if (!cols.includes("password_hash")) {
      _db.exec("ALTER TABLE users ADD COLUMN password_hash TEXT");
      logger.info("db.initDb", "users.password_hash 列を追加（A-6 / EX-01 構造のみ）");
    }
  } catch (e) {
    logger.warn("db.initDb", "password_hash migration skipped: " + e.message);
  }

  logger.info("db.initDb", "テーブル作成・INDEX作成完了");
}

/**
 * getDb
 * 概要 : DB ハンドルを取得する。
 * @returns {Database}
 */
function getDb() {
  if (!_db) throw new Error("DB is not initialized. Call initDb() first.");
  return _db;
}

/**
 * getConfig
 * 概要 : system_config からキー値を取得する。
 * @param {string} key
 * @returns {Promise<string|null>}
 */
async function getConfig(key) {
  if (!_db) return null;
  const row = _db.prepare("SELECT value FROM system_config WHERE key = ?").get(key);
  return row ? row.value : null;
}

module.exports = { initDb, getDb, getConfig, DB_PATH, DATA_DIR };
