/*
 * Readable-code review note:
 * - Role: Reference test. The assertions document the expected behavior for configuration, API paths, and UI flows.
 * - Keep behavior unchanged unless a specification or bug-fix task explicitly requires it.
 * - Comments in this file should explain intent, data contracts, and edge cases rather than repeat the code.
 */
/*
 * =============================================================================
 * ファイル名 : test/test-favorites-api.js
 * 概要       : v3.0.6 新規テスト。favorites CRUD（API-11/12/13）を
 *              Express サーバを supertest で起動して E2E 検証する。
 *
 * 検証ポイント:
 *   (1) GET  /api/v1/users/:userId/favorites           → 200 I00（初期は空配列）
 *   (2) POST /api/v1/users/:userId/favorites          → 201 I05, favoriteId 取得
 *   (3) POST 同じ bookId で再度                       → 409 W19（重複登録）
 *   (4) POST 存在しない bookId                        → 404 W17
 *   (5) POST bookId=0（バリデーション違反）           → 400 E01
 *   (6) POST 他者 userId                             → 403 W03
 *   (7) GET  /api/v1/users/:userId/favorites           → 200 I00（1件返却）
 *   (8) DELETE /api/v1/users/:userId/favorites/:fid   → 200 I06
 *   (9) DELETE 存在しない favoriteId                  → 404 W17
 *   (10) DELETE 他者 userId                          → 403 W03
 *
 * 仕様書トレーサビリティ:
 *   - 外部仕様書 v4.0a-rev3  §8.4.11 / §8.4.12 / §8.4.13
 *   - 内部仕様書 v4.0a-rev3  MP02
 *   - DB仕様書   v4.0a       favorites テーブル（UNIQUE(user_id, book_id)）
 *
 * 改訂履歴:
 *   v3.0.6  2026-05-11  Y.Toyoda  新規作成
 *
 * @author  Y.Toyoda
 * @version v3.0.6
 * =============================================================================
 */
"use strict";

let request, express, session;
try {
  request = require("supertest");
  express = require("express");
  session = require("express-session");
} catch (e) {
  console.log("=== test-favorites-api.js (v3.0.6) ===");
  console.log("  SKIP: 依存ライブラリ未インストールのためスキップ");
  console.log("=== Result: SKIP ===");
  process.exit(0);
}

let pass = 0, fail = 0;
function ok(label) { pass++; console.log("  PASS:", label); }
function ng(label, detail) { fail++; console.log("  FAIL:", label, JSON.stringify(detail).slice(0, 200)); }

console.log("=== test-favorites-api.js (v3.0.6 / API-11/12/13 E2E) ===");

process.env.SQLITE_PATH = ":memory:";
process.env.NODE_ENV = "test";

(async () => {
  const app = express();
  app.use(express.json());
  app.use(session({
    secret: "test-secret-v306-fav",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "strict" }
  }));
  app.use((req, _res, next) => { req.csrfToken = () => "test-token"; next(); });

  const { initDb, getDb } = require("../server/src/utils/db");
  await initDb();
  const db = getDb();
  // テストデータ投入
  db.prepare("DELETE FROM favorites").run();
  db.prepare("DELETE FROM users WHERE user_code IN ('1','2')").run();
  db.prepare("DELETE FROM books WHERE title LIKE 'お気に入りテスト書籍%'").run();
  db.prepare("INSERT INTO users(user_code, name, role) VALUES(?,?,?)").run("1", "佐藤翔太", "STUDENT");
  db.prepare("INSERT INTO users(user_code, name, role) VALUES(?,?,?)").run("2", "田中花子", "STUDENT");
  db.prepare("INSERT INTO books(title, author, category, arrival_date, is_disabled) VALUES(?,?,?,?,?)")
    .run("お気に入りテスト書籍A", "著者A", "技術", "2026-01-01", 0);
  db.prepare("INSERT INTO books(title, author, category, arrival_date, is_disabled) VALUES(?,?,?,?,?)")
    .run("お気に入りテスト書籍B", "著者B", "文学", "2026-01-02", 0);

  const routes = require("../server/src/routes");
  app.use("/api/v1", routes);
  app.use((req, res) => res.status(404).json({
    result: "error", messageCode: "W17", message: "not found", data: null
  }));
  // グローバルエラーハンドラ（本番 server.js と同等の振る舞い）
  app.use((e, req, res, _next) => {
    const status = e.httpStatus || 500;
    const code   = e.messageCode || "E10";
    res.status(status).json({
      result: "error", messageCode: code,
      message: e.message || "システムエラーが発生しました。", data: null
    });
  });

  const agent = request.agent(app);

  // ログイン
  const loginRes = await agent.post("/api/v1/auth/login").send({ userCode: "1", userName: "佐藤翔太" });
  const userId = loginRes.body && loginRes.body.data && loginRes.body.data.user && loginRes.body.data.user.userId;
  if (!userId) {
    ng("login", { status: loginRes.status, body: loginRes.body });
    console.log("=== Result: " + pass + " PASS / " + fail + " FAIL ===");
    process.exit(1);
  }

  // 対象書籍 ID を取得
  const bookA = db.prepare("SELECT book_id FROM books WHERE title=?").get("お気に入りテスト書籍A");
  const bookB = db.prepare("SELECT book_id FROM books WHERE title=?").get("お気に入りテスト書籍B");
  const bookAId = bookA.book_id;
  const bookBId = bookB.book_id;

  // ----- (1) GET 初期は空 -----
  {
    const r = await agent.get(`/api/v1/users/${userId}/favorites`);
    if (r.status === 200 && r.body.result === "success"
        && r.body.messageCode === "I00" && Array.isArray(r.body.data.favorites)
        && r.body.data.favorites.length === 0) {
      ok("(1) GET favorites: 200 I00 空配列");
    } else {
      ng("(1) GET favorites 初期空", { status: r.status, body: r.body });
    }
  }

  // ----- (2) POST 追加 → 201 I05 -----
  let favoriteId;
  {
    const r = await agent.post(`/api/v1/users/${userId}/favorites`).send({ bookId: bookAId });
    if (r.status === 201 && r.body.result === "success"
        && r.body.messageCode === "I05" && r.body.data.favoriteId) {
      favoriteId = r.body.data.favoriteId;
      ok("(2) POST favorites: 201 I05 favoriteId=" + favoriteId);
    } else {
      ng("(2) POST favorites 追加", { status: r.status, body: r.body });
    }
  }

  // ----- (3) POST 同じ bookId で重複 → 409 W19 -----
  {
    const r = await agent.post(`/api/v1/users/${userId}/favorites`).send({ bookId: bookAId });
    if (r.status === 409 && r.body.result === "error" && r.body.messageCode === "W19") {
      ok("(3) POST favorites 重複: 409 W19");
    } else {
      ng("(3) POST favorites 重複", { status: r.status, body: r.body });
    }
  }

  // ----- (4) POST 存在しない bookId → 404 W17 -----
  {
    const r = await agent.post(`/api/v1/users/${userId}/favorites`).send({ bookId: 99999 });
    if (r.status === 404 && r.body.result === "error" && r.body.messageCode === "W17") {
      ok("(4) POST favorites 不在書籍: 404 W17");
    } else {
      ng("(4) POST favorites 不在書籍", { status: r.status, body: r.body });
    }
  }

  // ----- (5) POST bookId=0 バリデーション違反 → 400 E01 -----
  {
    const r = await agent.post(`/api/v1/users/${userId}/favorites`).send({ bookId: 0 });
    if (r.status === 400 && r.body.result === "error" && r.body.messageCode === "E01") {
      ok("(5) POST favorites バリデーション: 400 E01");
    } else {
      ng("(5) POST favorites バリデーション", { status: r.status, body: r.body });
    }
  }

  // ----- (6) POST 他者 userId → 403 W03 -----
  {
    const otherUserId = userId === 1 ? 2 : 1;
    const r = await agent.post(`/api/v1/users/${otherUserId}/favorites`).send({ bookId: bookBId });
    if (r.status === 403 && r.body.result === "error" && r.body.messageCode === "W03") {
      ok("(6) POST favorites 他者: 403 W03");
    } else {
      ng("(6) POST favorites 他者", { status: r.status, body: r.body });
    }
  }

  // ----- (7) GET 1件返却 -----
  {
    const r = await agent.get(`/api/v1/users/${userId}/favorites`);
    if (r.status === 200 && r.body.data.favorites.length === 1
        && r.body.data.favorites[0].bookId === bookAId
        && r.body.data.count === 1) {
      ok("(7) GET favorites: 200 I00 1件返却 + JOIN（title 取得）");
    } else {
      ng("(7) GET favorites 1件", { status: r.status, body: r.body });
    }
  }

  // ----- (8) DELETE 削除 → 200 I06 -----
  {
    const r = await agent.delete(`/api/v1/users/${userId}/favorites/${favoriteId}`);
    if (r.status === 200 && r.body.result === "success" && r.body.messageCode === "I06") {
      ok("(8) DELETE favorites: 200 I06");
    } else {
      ng("(8) DELETE favorites", { status: r.status, body: r.body });
    }
  }

  // ----- (9) DELETE 存在しない favoriteId → 404 W17 -----
  {
    const r = await agent.delete(`/api/v1/users/${userId}/favorites/99999`);
    if (r.status === 404 && r.body.result === "error" && r.body.messageCode === "W17") {
      ok("(9) DELETE favorites 不在: 404 W17");
    } else {
      ng("(9) DELETE favorites 不在", { status: r.status, body: r.body });
    }
  }

  // ----- (10) DELETE 他者 userId → 403 W03 -----
  {
    // まず1件追加
    const a = await agent.post(`/api/v1/users/${userId}/favorites`).send({ bookId: bookBId });
    const fid2 = a.body && a.body.data && a.body.data.favoriteId;
    const otherUserId = userId === 1 ? 2 : 1;
    const r = await agent.delete(`/api/v1/users/${otherUserId}/favorites/${fid2}`);
    if (r.status === 403 && r.body.result === "error" && r.body.messageCode === "W03") {
      ok("(10) DELETE favorites 他者: 403 W03");
    } else {
      ng("(10) DELETE favorites 他者", { status: r.status, body: r.body });
    }
  }

  console.log("");
  console.log("=== Result: " + pass + " PASS / " + fail + " FAIL ===");
  process.exit(fail === 0 ? 0 : 1);
})().catch(e => {
  console.error("UNEXPECTED:", e);
  process.exit(1);
});
