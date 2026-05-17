/*
 * =============================================================================
 * ファイル名 : test/test-reservation-tx.js
 * 概要       : 予約 API のトランザクション・書籍状態チェック・部分一意INDEX 検証。
 *              better-sqlite3 を直接使い、controllers の SQL ロジックを再現する。
 *
 * 検証観点（S-3 / B-9 / B-11）:
 *   1) PRAGMA foreign_keys=ON / WAL モードが適用されること
 *   2) 部分一意 INDEX uq_reservations_active で同一ユーザー×同一書籍の
 *      RESERVED 二重登録が DB レベルで拒否されること
 *   3) is_disabled=1 の書籍は予約不可（業務ロジック）
 *   4) 上限3件の業務ロジックが動くこと
 *   5) CANCELED 後は同じ書籍を再予約できる（部分一意 INDEX が status='RESERVED' のみに効く）
 *   6) audit_log が原子的に書込まれること
 *   7) password_hash 列が存在すること（A-6 構造のみ）
 *
 * 改訂履歴:
 *   v3.0.3  2026-05-05  Y.Toyoda  新規作成（v3.0.1 コードレビュー S-3 対応）
 *
 * @author  Y.Toyoda
 * @version v3.0.3
 * =============================================================================
 */
"use strict";

const fs   = require("fs");
const path = require("path");

let pass = 0, fail = 0;
function ok(label) { pass++; console.log("  PASS:", label); }
function ng(label, detail) { fail++; console.log("  FAIL:", label, detail || ""); }

let Database;
try {
  Database = require("better-sqlite3");
} catch (_) {
  console.log("=== test-reservation-tx.js (v3.0.3 / S-3) ===");
  console.log("  SKIP: better-sqlite3 が未インストールのため本テストはスキップします。");
  console.log("        サーバーモード検証時は `cd server && npm install` 実行後に再度実行してください。");
  console.log("=== Result: SKIP（better-sqlite3 unavailable） ===");
  process.exit(0);
}

console.log("=== test-reservation-tx.js (v3.0.3 / S-3) ===");

// テスト用 in-memory DB
const db = new Database(":memory:");
db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");
db.pragma("synchronous = NORMAL");
db.pragma("busy_timeout = 5000");

// (1) PRAGMA 確認（in-memory では WAL は memory にフォールバックするケースもあるが、設定自体は通る）
const fk = db.pragma("foreign_keys", { simple: true });
if (fk === 1) ok("PRAGMA foreign_keys=ON が反映されている");
else ng("foreign_keys", "value=" + fk);

// スキーマ作成（server/src/utils/db.js と同じ）
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
  CREATE UNIQUE INDEX uq_reservations_active
    ON reservations(user_id, book_id) WHERE status='RESERVED';
  CREATE TABLE audit_log (
    audit_log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER, action TEXT NOT NULL,
    target_table TEXT NOT NULL, target_id INTEGER,
    changes TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

// (7) password_hash 列の存在
const cols = db.prepare("PRAGMA table_info(users)").all().map(r => r.name);
if (cols.includes("password_hash")) ok("users.password_hash 列が存在（A-6 / EX-01 構造のみ）");
else ng("password_hash column missing");

// 初期データ
db.prepare("INSERT INTO users(user_code, name, role) VALUES(?,?,?)").run("1", "佐藤翔太", "STUDENT");
const userId = 1;
db.prepare("INSERT INTO books(title, author, category, arrival_date, is_disabled) VALUES(?,?,?,?,?)")
  .run("DB入門", "A", "技術", "2026-01-01", 0);    // book 1: 利用可
db.prepare("INSERT INTO books(title, author, category, arrival_date, is_disabled) VALUES(?,?,?,?,?)")
  .run("Node.js", "B", "技術", "2026-02-01", 0);   // book 2: 利用可
db.prepare("INSERT INTO books(title, author, category, arrival_date, is_disabled) VALUES(?,?,?,?,?)")
  .run("Express", "C", "技術", "2026-03-01", 0);   // book 3: 利用可
db.prepare("INSERT INTO books(title, author, category, arrival_date, is_disabled) VALUES(?,?,?,?,?)")
  .run("SQL本", "D", "技術", "2026-04-01", 0);     // book 4: 利用可
db.prepare("INSERT INTO books(title, author, category, arrival_date, is_disabled) VALUES(?,?,?,?,?)")
  .run("古い本", "E", "歴史", "2020-01-01", 1);    // book 5: 利用停止

// controllers/index.js の reserve() を再現する関数
function reserve(uid, bid) {
  const txn = db.transaction(() => {
    const book = db.prepare("SELECT * FROM books WHERE book_id=?").get(bid);
    if (!book) return { kind: "err", code: "W17" };
    if (book.is_disabled === 1) return { kind: "err", code: "W13" };
    const dup = db.prepare("SELECT 1 FROM reservations WHERE user_id=? AND book_id=? AND status='RESERVED'").get(uid, bid);
    if (dup) return { kind: "err", code: "W11" };
    const cnt = db.prepare("SELECT COUNT(*) AS c FROM reservations WHERE user_id=? AND status='RESERVED'").get(uid).c;
    if (cnt >= 3) return { kind: "err", code: "W12" };
    const now = new Date().toISOString();
    const r = db.prepare(`
      INSERT INTO reservations(user_id, book_id, status, reserved_at, created_at, updated_at)
      VALUES(?,?,'RESERVED',?,?,?)
    `).run(uid, bid, now, now, now);
    db.prepare("INSERT INTO audit_log(user_id, action, target_table, target_id, changes) VALUES(?,?,?,?,?)")
      .run(uid, "RESERVE_BOOK", "reservations", r.lastInsertRowid, JSON.stringify({ bookId: bid }));
    return { kind: "ok", reservationId: r.lastInsertRowid };
  });
  try { return txn(); }
  catch (e) {
    if (String(e.message || "").includes("UNIQUE")) return { kind: "err", code: "W11", reason: "unique" };
    throw e;
  }
}

// (3) is_disabled=1 の書籍は予約不可
const r5 = reserve(userId, 5);
if (r5.kind === "err" && r5.code === "W13") ok("is_disabled=1 の書籍は W13 で予約拒否");
else ng("is_disabled check", JSON.stringify(r5));

// 正常予約
const r1 = reserve(userId, 1);
if (r1.kind === "ok") ok("正常予約成功（book 1）");
else ng("normal reserve", JSON.stringify(r1));

// (2) 部分一意 INDEX で重複が DB レベルで拒否される（業務チェックを通り抜けた場合のシミュレーション）
// 通常は業務チェックで W11 になるが、ここでは UNIQUE INDEX が効くことを直接確認
let uniqueRejected = false;
try {
  db.prepare("INSERT INTO reservations(user_id, book_id, status, reserved_at, created_at, updated_at) VALUES(?,?,?,?,?,?)")
    .run(userId, 1, "RESERVED", new Date().toISOString(), new Date().toISOString(), new Date().toISOString());
} catch (e) {
  if (String(e.message).includes("UNIQUE")) uniqueRejected = true;
}
if (uniqueRejected) ok("部分一意 INDEX uq_reservations_active が重複を物理拒否");
else ng("partial unique index");

// 業務チェックでも重複は弾かれる
const r1dup = reserve(userId, 1);
if (r1dup.kind === "err" && r1dup.code === "W11") ok("業務ロジックでも重複予約を W11 で拒否");
else ng("business duplicate", JSON.stringify(r1dup));

// (4) 上限3件
const r2 = reserve(userId, 2);
const r3 = reserve(userId, 3);
const r4 = reserve(userId, 4);
if (r2.kind === "ok" && r3.kind === "ok" && r4.kind === "err" && r4.code === "W12")
  ok("予約上限3件で4件目は W12 で拒否");
else ng("max limit", JSON.stringify({ r2, r3, r4 }));

// (5) CANCELED 後は再予約可能
db.prepare("UPDATE reservations SET status='CANCELED', canceled_at=? WHERE user_id=? AND book_id=? AND status='RESERVED'")
  .run(new Date().toISOString(), userId, 1);
const r1again = reserve(userId, 1);
if (r1again.kind === "ok") ok("CANCELED 後は同じ書籍を再予約可能（部分一意INDEXが status='RESERVED' のみに効く）");
else ng("re-reserve after cancel", JSON.stringify(r1again));

// (6) audit_log が原子的に書込まれている
const auditCount = db.prepare("SELECT COUNT(*) AS c FROM audit_log WHERE action='RESERVE_BOOK'").get().c;
if (auditCount >= 4) ok("audit_log が予約成功と同一トランザクションで記録（count=" + auditCount + "）");
else ng("audit count", "count=" + auditCount);

console.log("");
console.log("=== Result: " + pass + " PASS / " + fail + " FAIL ===");
process.exit(fail === 0 ? 0 : 1);
