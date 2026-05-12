/*
 * =============================================================================
 * ファイル名 : server/scripts/init-db.js
 * 概要       : SQLite DB 初期化 + seed データ投入スクリプト。
 *              `npm run init-db` で実行する。既存 DB（WAL/SHM/sessions 含む）を
 *              全削除して再作成する。
 *
 * 仕様書トレーサビリティ:
 *   - DB仕様書   v4.0  §5 全テーブル / §16 バックアップ・運用
 *   - 改訂対象        B-10（絶対パス化）/ B-11（クリーンアップ拡張）
 *
 * 改訂履歴:
 *   v3.0    2026-05-04  Y.Toyoda  新規作成
 *   v3.0.3  2026-05-05  Y.Toyoda  __dirname 基準絶対パス化、WAL/SHM/sessions 全削除に拡張
 *
 * @author  Y.Toyoda
 * @version v3.0.3
 * =============================================================================
 */
"use strict";

const fs = require("fs");
const path = require("path");
const { initDb, getDb, DATA_DIR } = require("../src/utils/db");
const { loadAppConfig } = require("../src/utils/config-loader");

/**
 * cleanup
 * 概要 : 既存DBファイル一式を削除する（B-11）。
 *        SQLite WAL モードでは .db / .db-wal / .db-shm の3点セット。
 *        セッションDB（sessions.sqlite + WAL/SHM）も併せて削除する。
 * @returns {void}
 */
function cleanup() {
  const targets = [
    "library.db",
    "library.db-wal",
    "library.db-shm",
    "sessions.sqlite",
    "sessions.sqlite-journal",
    "sessions.sqlite-wal",
    "sessions.sqlite-shm",
  ];
  let removed = 0;
  targets.forEach(name => {
    const p = path.join(DATA_DIR, name);
    if (fs.existsSync(p)) {
      fs.unlinkSync(p);
      console.log("removed:", p);
      removed++;
    }
  });
  console.log(`cleanup done (${removed} files removed)`);
}

/**
 * seed
 * 概要 : seed データを投入する。
 * @returns {Promise<void>}
 */
async function seed() {
  // (1) 既存DB一式をクリーンアップ（B-11 拡張）
  fs.mkdirSync(DATA_DIR, { recursive: true });
  cleanup();

  // (2) DB初期化
  await initDb();
  const db = getDb();
  const cfg = loadAppConfig();

  // (3) system_config 初期データ
  const cfgInsert = db.prepare(
    "INSERT OR REPLACE INTO system_config(key, value) VALUES(?, ?)"
  );
  cfgInsert.run("dbType", cfg.dbType);
  cfgInsert.run("schemaVersion", "3.0.6");
  cfgInsert.run("maxReservations", String(cfg.maxReservations));
  cfgInsert.run("searchPageSize", String(cfg.searchPageSize));

  // (4) users（簡易認証 / A-6）
  const userInsert = db.prepare(
    "INSERT INTO users(user_code, name, role) VALUES(?, ?, ?)"
  );
  userInsert.run("1", "佐藤翔太", "STUDENT");
  userInsert.run("2", "田中花子", "STUDENT");
  userInsert.run("3", "山田教授", "FACULTY");

  // (5) books
  const bookInsert = db.prepare(
    "INSERT INTO books(title, author, category, arrival_date, is_disabled) VALUES(?, ?, ?, ?, ?)"
  );
  bookInsert.run("データベース設計入門", "佐藤一郎", "技術", "2026-01-10", 0);
  bookInsert.run("SQL実践",             "鈴木次郎", "技術", "2026-02-15", 0);
  bookInsert.run("Node.js入門",         "田中三郎", "技術", "2026-03-01", 0);
  bookInsert.run("Express ハンドブック", "山本四郎", "技術", "2026-03-10", 0);
  bookInsert.run("Sequelize ガイド",    "小林五郎", "技術", "2026-04-01", 0);
  // S-3 検証用に1冊だけ利用停止フラグを立てる
  bookInsert.run("旧版・古い書籍",       "古田六郎", "歴史", "2020-01-01", 1);

  console.log("Seed data inserted: 3 users, 6 books (incl. 1 disabled), system_config 4 keys");
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
