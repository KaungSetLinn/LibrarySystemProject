/*
 * =============================================================================
 * ファイル名 : test/test-csrf-client.js
 * 概要       : ApiClient（CSRF 自動取得・付与・リトライ）の検証テスト。
 *              Node.js 単独で動作させるため、最低限の DOM/fetch をスタブ化する。
 *
 * 検証観点（A-5）:
 *   1) /api/v1/csrf-token から取得したトークンが内部に保持されること
 *   2) 並行呼出時にトークンエンドポイントが二重発行されないこと
 *   3) POST 時に X-CSRF-Token ヘッダが自動付与されること
 *   4) 403 応答時に1回だけリトライされ、トークンが再取得されること
 *   5) GET には CSRF ヘッダが付与されないこと
 *   6) リクエスト失敗時（network error）に四層構造の error 応答が返ること
 *   7) BASE プレフィックスが /api/v1 であること
 *
 * 改訂履歴:
 *   v3.0.3  2026-05-05  Y.Toyoda  新規作成（v3.0.1 コードレビュー A-5 対応）
 *
 * @author  Y.Toyoda
 * @version v3.0.3
 * =============================================================================
 */
"use strict";

const path = require("path");
const fs   = require("fs");
const vm   = require("vm");

let pass = 0, fail = 0;
function ok(label) { pass++; console.log("  PASS:", label); }
function ng(label, detail) { fail++; console.log("  FAIL:", label, detail || ""); }

/* ---------------- DOM / window スタブ ---------------- */
const sandbox = {
  console,
  document: {
    readyState: "complete",
    addEventListener: function () {},
    body: { appendChild: function () {} },
    querySelector: function () { return null; },
    createElement: function () { return { setAttribute: function () {}, appendChild: function () {}, style: {}, textContent: "" }; }
  },
  window: {},
  setTimeout
};
sandbox.window = sandbox;

/* ---------------- fetch スタブ ---------------- */
let fetchCalls = [];
let nextResponses = [];   // [{status, body}, ...]
sandbox.fetch = async function (url, init) {
  fetchCalls.push({ url, init: init || {} });
  const r = nextResponses.shift() || { status: 200, body: {} };
  return {
    ok: r.status >= 200 && r.status < 300,
    status: r.status,
    json: async () => r.body
  };
};

/* ---------------- ApiClient 読込 ---------------- */
const code = fs.readFileSync(
  path.join(__dirname, "..", "app", "js", "core", "api-client.js"), "utf-8"
);
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const ApiClient = sandbox.ApiClient;

/* ---------------- 各テスト ---------------- */
(async function run() {
  console.log("=== test-csrf-client.js (v3.0.3 / A-5) ===");

  // (1) BASE prefix
  if (ApiClient.BASE === "/api/v1") ok("BASE === /api/v1"); else ng("BASE", ApiClient.BASE);

  // (2) GET にCSRFが付かない
  fetchCalls = [];
  nextResponses = [{ status: 200, body: { result: "success", messageCode: "I00", message: "OK", data: {} } }];
  ApiClient._clearToken();
  await ApiClient.get("/api/v1/health");
  const getCall = fetchCalls.find(c => c.url === "/api/v1/health");
  if (getCall && !getCall.init.headers["X-CSRF-Token"]) ok("GET にCSRFが付与されない");
  else ng("GET CSRF", getCall && getCall.init.headers);

  // (3) POST 時に CSRF 取得 → トークン付与
  fetchCalls = [];
  nextResponses = [
    { status: 200, body: { result: "success", messageCode: "I00", message: "OK", data: { csrfToken: "TOKEN-A" } } },
    { status: 200, body: { result: "success", messageCode: "I02", message: "予約しました。", data: { reservationId: 1 } } }
  ];
  ApiClient._clearToken();
  await ApiClient.post("/api/v1/reservations", { bookId: 1 });
  const tokenCall = fetchCalls.find(c => c.url === "/api/v1/csrf-token");
  const postCall = fetchCalls.find(c => c.url === "/api/v1/reservations");
  if (tokenCall && postCall && postCall.init.headers["X-CSRF-Token"] === "TOKEN-A")
    ok("POST 時に CSRF を取得し X-CSRF-Token を付与");
  else
    ng("POST CSRF 付与", JSON.stringify({ tokenCall: !!tokenCall, postHeaders: postCall && postCall.init.headers }));

  // (4) 内部保持トークンの確認
  if (ApiClient._peekToken() === "TOKEN-A") ok("トークンが内部保持されている");
  else ng("internal token", ApiClient._peekToken());

  // (5) 並行 POST でトークンエンドポイントは1回のみ呼ばれる
  fetchCalls = [];
  ApiClient._clearToken();
  nextResponses = [
    { status: 200, body: { result: "success", messageCode: "I00", message: "OK", data: { csrfToken: "TOKEN-B" } } },
    { status: 200, body: { result: "success", messageCode: "I02", message: "OK", data: {} } },
    { status: 200, body: { result: "success", messageCode: "I02", message: "OK", data: {} } },
    { status: 200, body: { result: "success", messageCode: "I02", message: "OK", data: {} } }
  ];
  await Promise.all([
    ApiClient.post("/api/v1/reservations", { bookId: 1 }),
    ApiClient.post("/api/v1/reservations", { bookId: 2 }),
    ApiClient.post("/api/v1/reservations", { bookId: 3 })
  ]);
  const tokenCalls = fetchCalls.filter(c => c.url === "/api/v1/csrf-token").length;
  if (tokenCalls === 1) ok("並行呼出でトークン取得は1回のみ");
  else ng("token concurrent fetch", "tokenCalls=" + tokenCalls);

  // (6) 403 応答時に1回だけリトライ（トークン再取得）
  fetchCalls = [];
  ApiClient._clearToken();
  nextResponses = [
    { status: 200, body: { result: "success", messageCode: "I00", message: "OK", data: { csrfToken: "TOKEN-C1" } } }, // 初回 token
    { status: 403, body: { result: "error", messageCode: "W02", message: "CSRF expired", data: null } },              // 1回目のPOSTが403
    { status: 200, body: { result: "success", messageCode: "I00", message: "OK", data: { csrfToken: "TOKEN-C2" } } }, // 再取得
    { status: 200, body: { result: "success", messageCode: "I02", message: "OK", data: {} } }                          // リトライPOST成功
  ];
  await ApiClient.post("/api/v1/reservations", { bookId: 9 });
  const reservePosts = fetchCalls.filter(c => c.url === "/api/v1/reservations").length;
  const tokenFetches = fetchCalls.filter(c => c.url === "/api/v1/csrf-token").length;
  if (reservePosts === 2 && tokenFetches === 2) ok("403 応答後、1回だけリトライ＆トークン再取得");
  else ng("retry on 403", "reservePosts=" + reservePosts + " tokenFetches=" + tokenFetches);

  // (7) network error 時に四層構造のエラーが返る
  sandbox.fetch = async function () { throw new Error("net down"); };
  // ApiClient は閉包内で fetch を参照するが、グローバル参照のためサンドボックスのfetchを差替え
  const r = await ApiClient.get("/api/v1/health");
  if (r && r.result === "error" && r.messageCode === "E10") ok("network error → 四層構造 error 応答");
  else ng("network error response", JSON.stringify(r));

  console.log("");
  console.log("=== Result: " + pass + " PASS / " + fail + " FAIL ===");
  process.exit(fail === 0 ? 0 : 1);
})();
