/*
 * Readable-code review note:
 * - Role: Reference test. The assertions document the expected behavior for configuration, API paths, and UI flows.
 * - Keep behavior unchanged unless a specification or bug-fix task explicitly requires it.
 * - Comments in this file should explain intent, data contracts, and edge cases rather than repeat the code.
 */
/*
 * =============================================================================
 * ファイル名 : test/test-integration-server.js
 * 概要       : v3.0.5 新規統合テスト。
 *              Express サーバを supertest で起動し、API-06 新パスが
 *              正しく動作するかをエンドツーエンドで検証する。
 *
 * 検証ポイント:
 *   (1) GET  /api/v1/health        → 200, 4層構造応答
 *   (2) POST /api/v1/auth/login    → 200, セッション確立
 *   (3) POST /api/v1/reservations  → 201, reservationId 取得
 *   (4) DELETE /api/v1/users/:userId/reservations/:reservationId（新パス）→ 200
 *   (5) DELETE /api/v1/users/:otherUserId/reservations/:reservationId → 403 W03
 *   (6) DELETE /api/v1/reservations/:id（旧パス）→ 404（廃止確認）
 *
 * 改訂履歴:
 *   v3.0.5  2026-05-10  Y.Toyoda  新規作成
 *
 * @author  Y.Toyoda
 * @version v3.0.5
 * =============================================================================
 */
"use strict";

const path = require("path");
let request, express, session;
try {
  request = require("supertest");
  express = require("express");
  session = require("express-session");
} catch (e) {
  console.log("=== test-integration-server.js (v3.0.5) ===");
  console.log("  SKIP: 依存ライブラリ未インストールのためスキップ");
  console.log("=== Result: SKIP ===");
  process.exit(0);
}

let pass = 0, fail = 0;
function ok(label) { pass++; console.log("  PASS:", label); }
function ng(label, detail) { fail++; console.log("  FAIL:", label, JSON.stringify(detail).slice(0, 200)); }

console.log("=== test-integration-server.js (v3.0.5 / API-06 新パス E2E) ===");

// インメモリ DB を使う形でセットアップ
process.env.SQLITE_PATH = ":memory:";
process.env.NODE_ENV = "test";
// CSRF を無効化したテスト用フラグ（server.js が参照する想定で設定するが、
// 既存実装が csurf を強制する場合はミドルウェアを上書きする）

(async () => {
  // server.js を直接読まず、最小構成で routes/controllers を組み立てる
  const app = express();
  app.use(express.json());
  app.use(session({
    secret: "test-secret-v305",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "strict" }
  }));

  // CSRF をテストではバイパス（本番は server.js で有効化）
  app.use((req, _res, next) => { req.csrfToken = () => "test-token"; next(); });

  // DB 初期化（メモリ）
  const { initDb, getDb } = require("../server/src/utils/db");
  await initDb();
  const db = getDb();
  // テストデータ投入
  db.prepare("INSERT INTO users(user_code, name, role) VALUES(?,?,?)").run("1", "佐藤翔太", "STUDENT");
  db.prepare("INSERT INTO users(user_code, name, role) VALUES(?,?,?)").run("2", "田中花子", "STUDENT");
  db.prepare("INSERT INTO books(title, author, category, arrival_date, is_disabled) VALUES(?,?,?,?,?)")
    .run("テスト書籍A", "著者A", "技術", "2026-01-01", 0);

  const routes = require("../server/src/routes");
  app.use("/api/v1", routes);
  // 404 ハンドラ
  app.use((req, res) => res.status(404).json({
    result: "error", messageCode: "W17", message: "not found", data: null
  }));

  // ----- (1) GET /api/v1/health -----
  {
    const r = await request(app).get("/api/v1/health");
    if (r.status === 200 && r.body.result === "success" && r.body.data && typeof r.body.data.dbConnected !== "undefined") {
      ok("(1) /api/v1/health: 200, 4 層構造応答");
    } else {
      ng("(1) /api/v1/health", { status: r.status, body: r.body });
    }
  }

  // ----- (2) POST /api/v1/auth/login -----
  const agent = request.agent(app);
  let userId;
  {
    const r = await agent.post("/api/v1/auth/login").send({ userCode: "1", userName: "佐藤翔太" });
    if (r.status === 200 && r.body.result === "success" && r.body.data && r.body.data.user) {
      userId = r.body.data.user.userId;
      ok("(2) /api/v1/auth/login: 200, userId=" + userId);
    } else {
      ng("(2) /api/v1/auth/login", { status: r.status, body: r.body });
    }
  }

  // ----- (3) POST /api/v1/reservations -----
  let reservationId;
  {
    const r = await agent.post("/api/v1/reservations").send({ bookId: 1 });
    if (r.status === 201 && r.body.result === "success" && r.body.data && r.body.data.reservationId) {
      reservationId = r.body.data.reservationId;
      ok("(3) /api/v1/reservations: 201, reservationId=" + reservationId);
    } else {
      ng("(3) /api/v1/reservations", { status: r.status, body: r.body });
    }
  }

  // ----- (4) DELETE 新パス（本人）→ 200 -----
  if (userId && reservationId) {
    const r = await agent.delete(`/api/v1/users/${userId}/reservations/${reservationId}`);
    if (r.status === 200 && r.body.result === "success" && r.body.messageCode === "I03") {
      ok("(4) DELETE /users/:userId/reservations/:reservationId: 200 I03");
    } else {
      ng("(4) DELETE 新パス（本人）", { status: r.status, body: r.body });
    }
  }

  // ----- (5) DELETE 新パス（他者ID）→ 403 W03 -----
  // 別予約を作成
  let reservationId2;
  {
    const r = await agent.post("/api/v1/reservations").send({ bookId: 1 });
    reservationId2 = r.body && r.body.data && r.body.data.reservationId;
  }
  if (reservationId2) {
    const otherUserId = userId === 1 ? 2 : 1;
    const r = await agent.delete(`/api/v1/users/${otherUserId}/reservations/${reservationId2}`);
    if (r.status === 403 && r.body.result === "error" && r.body.messageCode === "W03") {
      ok("(5) DELETE 他者 userId: 403 W03（本人外チェック）");
    } else {
      ng("(5) DELETE 他者 userId", { status: r.status, body: r.body });
    }
  }

  // ----- (6) DELETE 旧パス → 404（廃止確認） -----
  {
    const r = await agent.delete(`/api/v1/reservations/${reservationId2 || 1}`);
    if (r.status === 404) {
      ok("(6) 旧パス DELETE /reservations/:id: 404（廃止確認）");
    } else {
      ng("(6) 旧パスがまだ応答している", { status: r.status, body: r.body });
    }
  }

  console.log("");
  console.log("=== Result: " + pass + " PASS / " + fail + " FAIL ===");
  process.exit(fail === 0 ? 0 : 1);
})().catch(e => {
  console.error("UNEXPECTED:", e);
  process.exit(1);
});
