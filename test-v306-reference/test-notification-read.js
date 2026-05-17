/*
 * READABLE-CODE REVIEW NOTE
 * 対象ファイル: test-v306-reference/test-notification-read.js
 * 責務: v3.0.6 参照テスト。過去不具合の再発防止と仕様トレーサビリティ確認を担当する。
 * 保守メモ: 実装修正時は、ここにある期待値と画面/API 契約がズレていないか確認する。
 */
/*
 * =============================================================================
 * ファイル名 : test/test-notification-read.js
 * 概要       : v3.0.6 新規テスト。通知既読化（API-14）を
 *              Express サーバを supertest で起動して E2E 検証する。
 *
 * 検証ポイント:
 *   (1) POST /api/v1/users/:userId/notifications/:notificationId/read → 200 I04
 *   (2) 既読化後の DB 状態（is_read=1, read_at NOT NULL）
 *   (3) 冪等性: 既に既読の通知を再度 POST → 200 I04（成功扱い）
 *   (4) 存在しない notificationId → 404 W17
 *   (5) 他者 userId → 403 W03
 *   (6) audit_log に MARK_READ が記録される
 *
 * 仕様書トレーサビリティ:
 *   - 外部仕様書 v4.0a-rev3  §8.4.14
 *   - 内部仕様書 v4.0a-rev3  MP03 markNotificationRead
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
  console.log("=== test-notification-read.js (v3.0.6) ===");
  console.log("  SKIP: 依存ライブラリ未インストールのためスキップ");
  console.log("=== Result: SKIP ===");
  process.exit(0);
}

let pass = 0, fail = 0;
function ok(label) { pass++; console.log("  PASS:", label); }
function ng(label, detail) { fail++; console.log("  FAIL:", label, JSON.stringify(detail).slice(0, 200)); }

console.log("=== test-notification-read.js (v3.0.6 / API-14 E2E) ===");

process.env.SQLITE_PATH = ":memory:";
process.env.NODE_ENV = "test";

(async () => {
  const app = express();
  app.use(express.json());
  app.use(session({
    secret: "test-secret-v306-notif",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "strict" }
  }));
  app.use((req, _res, next) => { req.csrfToken = () => "test-token"; next(); });

  const { initDb, getDb } = require("../server/src/utils/db");
  await initDb();
  const db = getDb();
  db.prepare("DELETE FROM notifications").run();
  db.prepare("DELETE FROM audit_log").run();
  db.prepare("DELETE FROM users WHERE user_code IN ('1','2')").run();
  db.prepare("INSERT INTO users(user_code, name, role) VALUES(?,?,?)").run("1", "佐藤翔太", "STUDENT");
  db.prepare("INSERT INTO users(user_code, name, role) VALUES(?,?,?)").run("2", "田中花子", "STUDENT");

  const routes = require("../server/src/routes");
  app.use("/api/v1", routes);
  app.use((req, res) => res.status(404).json({
    result: "error", messageCode: "W17", message: "not found", data: null
  }));

  const agent = request.agent(app);

  const loginRes = await agent.post("/api/v1/auth/login").send({ userCode: "1", userName: "佐藤翔太" });
  const userId = loginRes.body && loginRes.body.data && loginRes.body.data.user && loginRes.body.data.user.userId;
  if (!userId) {
    ng("login", { status: loginRes.status, body: loginRes.body });
    console.log("=== Result: " + pass + " PASS / " + fail + " FAIL ===");
    process.exit(1);
  }

  // 通知を3件投入
  const ins = db.prepare(
    "INSERT INTO notifications(user_id, type, title, body, is_read) VALUES(?,?,?,?,0)"
  );
  const n1 = ins.run(userId, "INFO", "予約完了", "予約が確定しました").lastInsertRowid;
  const n2 = ins.run(userId, "INFO", "返却期限", "明日が返却期限です").lastInsertRowid;
  const otherUserId = userId === 1 ? 2 : 1;
  const n3 = ins.run(otherUserId, "INFO", "他者の通知", "本人外").lastInsertRowid;

  // ----- (1) POST 既読化 → 200 I04 -----
  {
    const r = await agent.post(`/api/v1/users/${userId}/notifications/${n1}/read`).send({});
    if (r.status === 200 && r.body.result === "success" && r.body.messageCode === "I04"
        && r.body.data.notificationId === n1 && r.body.data.isRead === true) {
      ok("(1) POST 既読化: 200 I04 isRead=true");
    } else {
      ng("(1) POST 既読化", { status: r.status, body: r.body });
    }
  }

  // ----- (2) DB 状態確認 -----
  {
    const row = db.prepare("SELECT is_read, read_at FROM notifications WHERE notification_id=?").get(n1);
    if (row && row.is_read === 1 && row.read_at) {
      ok("(2) DB 状態: is_read=1 read_at=" + row.read_at);
    } else {
      ng("(2) DB 状態", row);
    }
  }

  // ----- (3) 冪等性: 同じ通知を再度既読化 → 200 I04 -----
  {
    const r = await agent.post(`/api/v1/users/${userId}/notifications/${n1}/read`).send({});
    if (r.status === 200 && r.body.result === "success" && r.body.messageCode === "I04") {
      ok("(3) 冪等性: 再既読化も 200 I04");
    } else {
      ng("(3) 冪等性", { status: r.status, body: r.body });
    }
  }

  // ----- (4) 存在しない notificationId → 404 W17 -----
  {
    const r = await agent.post(`/api/v1/users/${userId}/notifications/99999/read`).send({});
    if (r.status === 404 && r.body.result === "error" && r.body.messageCode === "W17") {
      ok("(4) 不在通知: 404 W17");
    } else {
      ng("(4) 不在通知", { status: r.status, body: r.body });
    }
  }

  // ----- (5) 他者 userId → 403 W03 -----
  {
    const r = await agent.post(`/api/v1/users/${otherUserId}/notifications/${n3}/read`).send({});
    if (r.status === 403 && r.body.result === "error" && r.body.messageCode === "W03") {
      ok("(5) 他者: 403 W03");
    } else {
      ng("(5) 他者", { status: r.status, body: r.body });
    }
  }

  // ----- (6) audit_log に MARK_READ が記録 -----
  {
    const rows = db.prepare(
      "SELECT * FROM audit_log WHERE user_id=? AND action='MARK_READ' AND target_id=?"
    ).all(userId, n1);
    if (rows.length >= 1) {
      ok("(6) audit_log MARK_READ: " + rows.length + "件記録");
    } else {
      ng("(6) audit_log MARK_READ", { count: rows.length });
    }
  }

  console.log("");
  console.log("=== Result: " + pass + " PASS / " + fail + " FAIL ===");
  process.exit(fail === 0 ? 0 : 1);
})().catch(e => {
  console.error("UNEXPECTED:", e);
  process.exit(1);
});
