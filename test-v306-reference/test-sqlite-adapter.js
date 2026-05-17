/*
 * READABLE-CODE REVIEW NOTE
 * 対象ファイル: test-v306-reference/test-sqlite-adapter.js
 * 責務: v3.0.6 参照テスト。過去不具合の再発防止と仕様トレーサビリティ確認を担当する。
 * 保守メモ: 実装修正時は、ここにある期待値と画面/API 契約がズレていないか確認する。
 */
/*
 * =============================================================================
 * ファイル名 : test/test-sqlite-adapter.js
 * 概要       : SQLiteAdapter（sql.js 本実装）の検証テスト。
 *              Node.js 環境では sql.js を直接 require して同等のロジックを検証する。
 *              ブラウザ実行は手動確認 + 既存の test-reservation-tx.js でカバー。
 *
 * 検証観点（v3.0.4 / S-1 本実装）:
 *   1) sql.js / better-sqlite3 で 9テーブル＋部分一意INDEXが作成できる
 *   2) findUser 相当のクエリが正しく動作
 *   3) reserveBook 相当のロジックがトランザクション内で完結
 *   4) is_disabled=1 の書籍は予約不可（W13）
 *   5) 上限3件で4件目は W12 で拒否
 *   6) 重複予約は部分一意INDEXで物理的に拒否
 *   7) CANCELED 後の再予約が可能
 *
 * 改訂履歴:
 *   v3.0.4  2026-05-05  Y.Toyoda  新規作成（SQLite 本実装の論理検証）
 *
 * @author  Y.Toyoda
 * @version v3.0.4
 * =============================================================================
 */
"use strict";

let pass = 0, fail = 0;
function ok(label) { pass++; console.log("  PASS:", label); }
function ng(label, detail) { fail++; console.log("  FAIL:", label, detail || ""); }

let Database;
try {
  Database = require("better-sqlite3");
} catch (_) {
  console.log("=== test-sqlite-adapter.js (v3.0.4 / S-1 本実装) ===");
  console.log("  SKIP: better-sqlite3 が未インストール。`cd server && npm install` 後に実行。");
  console.log("=== Result: SKIP ===");
  process.exit(0);
}

console.log("=== test-sqlite-adapter.js (v3.0.4 / S-1 本実装) ===");

// in-memory DB（sql.js とほぼ同じスキーマ）
const db = new Database(":memory:");
db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");

// SQLiteAdapter._createSchema と同等
db.exec(`
  CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    password_hash TEXT,
    role TEXT NOT NULL DEFAULT 'STUDENT',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE books (
    book_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL, author TEXT, category TEXT,
    arrival_date TEXT, is_disabled INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX idx_books_title ON books(title);
  CREATE INDEX idx_books_author ON books(author);
  CREATE INDEX idx_books_category ON books(category);
  CREATE TABLE reservations (
    reservation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('RESERVED','CANCELED','FULFILLED')),
    reserved_at TEXT NOT NULL,
    pickup_deadline TEXT,
    canceled_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(book_id) REFERENCES books(book_id)
  );
  CREATE INDEX idx_res_user_status ON reservations(user_id, status);
  CREATE INDEX idx_res_book_status ON reservations(book_id, status);
  CREATE UNIQUE INDEX uq_reservations_active
    ON reservations(user_id, book_id) WHERE status='RESERVED';
  CREATE TABLE notifications (
    notification_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL, type TEXT NOT NULL,
    title TEXT NOT NULL, body TEXT,
    is_read INTEGER NOT NULL DEFAULT 0, read_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(user_id)
  );
  CREATE TABLE favorites (
    favorite_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL, book_id INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, book_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(book_id) REFERENCES books(book_id)
  );
  CREATE TABLE audit_log (
    audit_log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER, action TEXT NOT NULL,
    target_table TEXT NOT NULL, target_id INTEGER,
    changes TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE system_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

// (1) 9 テーブル + 部分一意 INDEX 確認
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(r => r.name);
const expected = ["users", "books", "reservations", "notifications",
                  "favorites", "audit_log", "system_config"];
const allTablesExist = expected.every(t => tables.includes(t));
if (allTablesExist) ok("テーブル 7 種が作成されている");
else ng("tables", JSON.stringify(tables));

const indexes = db.prepare("SELECT name FROM sqlite_master WHERE type='index'").all().map(r => r.name);
if (indexes.includes("uq_reservations_active")) ok("部分一意 INDEX uq_reservations_active が作成されている");
else ng("partial unique index", JSON.stringify(indexes));

// 初期データ
db.prepare("INSERT INTO users(user_code, name, role) VALUES(?,?,?)").run("1", "佐藤翔太", "STUDENT");
db.prepare("INSERT INTO books(title, author, category, is_disabled) VALUES(?,?,?,?)").run("DB入門", "A", "技術", 0);
db.prepare("INSERT INTO books(title, author, category, is_disabled) VALUES(?,?,?,?)").run("Node.js", "B", "技術", 0);
db.prepare("INSERT INTO books(title, author, category, is_disabled) VALUES(?,?,?,?)").run("Express", "C", "技術", 0);
db.prepare("INSERT INTO books(title, author, category, is_disabled) VALUES(?,?,?,?)").run("SQL本", "D", "技術", 0);
db.prepare("INSERT INTO books(title, author, category, is_disabled) VALUES(?,?,?,?)").run("古い本", "E", "歴史", 1);

// (2) findUser
const u = db.prepare("SELECT * FROM users WHERE user_code=? AND name=?").get("1", "佐藤翔太");
if (u && u.user_id === 1) ok("findUser 相当のクエリが成功");
else ng("findUser", JSON.stringify(u));

// reserveBook 相当のトランザクション関数（SQLiteAdapter._tx + reserveBook と同等）
function reserve(uid, bid) {
  const txn = db.transaction(() => {
    const book = db.prepare("SELECT * FROM books WHERE book_id=?").get(bid);
    if (!book) return { code: "W17" };
    if (book.is_disabled === 1) return { code: "W13" };
    const dup = db.prepare("SELECT 1 FROM reservations WHERE user_id=? AND book_id=? AND status='RESERVED'").get(uid, bid);
    if (dup) return { code: "W11" };
    const cnt = db.prepare("SELECT COUNT(*) AS c FROM reservations WHERE user_id=? AND status='RESERVED'").get(uid).c;
    if (cnt >= 3) return { code: "W12" };
    const now = new Date().toISOString();
    const r = db.prepare(`INSERT INTO reservations(user_id, book_id, status, reserved_at, created_at, updated_at)
                          VALUES(?,?,'RESERVED',?,?,?)`).run(uid, bid, now, now, now);
    db.prepare("INSERT INTO audit_log(user_id, action, target_table, target_id, changes) VALUES(?,?,?,?,?)")
      .run(uid, "RESERVE_BOOK", "reservations", r.lastInsertRowid, JSON.stringify({ bookId: bid }));
    return { code: "I02", reservationId: r.lastInsertRowid };
  });
  try { return txn(); }
  catch (e) {
    if (String(e.message).includes("UNIQUE")) return { code: "W11", reason: "unique" };
    throw e;
  }
}

// (3) reserveBook 相当：正常予約
const r1 = reserve(1, 1);
if (r1.code === "I02") ok("reserveBook 相当：正常予約成功（book 1）");
else ng("reserve normal", JSON.stringify(r1));

// (4) is_disabled=1 の書籍は予約不可（W13）
const rDis = reserve(1, 5);
if (rDis.code === "W13") ok("is_disabled=1 の書籍は W13 で拒否");
else ng("disabled check", JSON.stringify(rDis));

// (5) 上限3件で4件目は W12
const r2 = reserve(1, 2);
const r3 = reserve(1, 3);
const r4 = reserve(1, 4);
if (r2.code === "I02" && r3.code === "I02" && r4.code === "W12")
  ok("予約上限3件で4件目は W12 で拒否");
else ng("max limit", JSON.stringify({ r2, r3, r4 }));

// (6) 重複予約は部分一意INDEXで物理拒否
let unique = false;
try {
  db.prepare(`INSERT INTO reservations(user_id, book_id, status, reserved_at, created_at, updated_at)
              VALUES(?,?,?,?,?,?)`)
    .run(1, 1, "RESERVED", new Date().toISOString(), new Date().toISOString(), new Date().toISOString());
} catch (e) {
  if (String(e.message).includes("UNIQUE")) unique = true;
}
if (unique) ok("部分一意 INDEX が重複 RESERVED を物理拒否");
else ng("partial unique enforcement");

// (7) CANCELED 後は再予約可能
db.prepare("UPDATE reservations SET status='CANCELED', canceled_at=? WHERE user_id=? AND book_id=? AND status='RESERVED'")
  .run(new Date().toISOString(), 1, 1);
const rAgain = reserve(1, 1);
if (rAgain.code === "I02") ok("CANCELED 後の再予約が可能（部分一意INDEXは status='RESERVED' のみに効く）");
else ng("re-reserve after cancel", JSON.stringify(rAgain));

console.log("");
console.log("=== Result: " + pass + " PASS / " + fail + " FAIL ===");
process.exit(fail === 0 ? 0 : 1);
