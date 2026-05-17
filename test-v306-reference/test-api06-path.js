/*
 * =============================================================================
 * ファイル名 : test/test-api06-path.js
 * 概要       : v3.0.5 新規回帰テスト。
 *              API-06 予約取消エンドポイントが新パス
 *              /api/v1/users/:userId/reservations/:reservationId
 *              に対応していること、および :userId ≠ session.userId の場合に
 *              403 W03 を返すことを検証する。
 *
 * 検証ポイント:
 *   (1) routes/index.js に新パスのルートが定義されている
 *   (2) 旧パス /api/v1/reservations/:id が定義されていない（廃止確認）
 *   (3) controllers/index.js の cancel が req.params.userId を参照している
 *   (4) cancel が pathUserId !== sessionUserId の場合に W03 を返す分岐を持つ
 *   (5) api-adapter.js が新パスを呼び出している
 *   (6) 旧パス呼出が api-adapter.js に残っていない
 *   (7) messages.js に W03 が定義されている
 *
 * 仕様書トレーサビリティ:
 *   - 外部仕様 v4.0a-rev2 §8.3 API一覧 / §8.4.5 API-06 詳細
 *   - DB担当指摘            2026-05-10
 *
 * 改訂履歴:
 *   v3.0.5  2026-05-10  Y.Toyoda  新規作成
 *
 * @author  Y.Toyoda
 * @version v3.0.5
 * =============================================================================
 */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
let pass = 0, fail = 0;
function ok(label) { pass++; console.log("  PASS:", label); }
function ng(label, detail) { fail++; console.log("  FAIL:", label, detail || ""); }

console.log("=== test-api06-path.js (v3.0.5 / DB担当指摘) ===");

// ----- (1) routes/index.js に新パスのルートが定義されている -----
const routes = fs.readFileSync(path.join(ROOT, "server/src/routes/index.js"), "utf8");
if (/router\.delete\(\s*["']\/users\/:userId\/reservations\/:reservationId["']/.test(routes)) {
  ok("(1) routes に新パス /users/:userId/reservations/:reservationId が定義されている");
} else {
  ng("(1) 新パスのルート定義が見つかりません");
}

// ----- (2) 旧パス /api/v1/reservations/:id（DELETE）が定義されていない -----
if (!/router\.delete\(\s*["']\/reservations\/:(?:reservationId|id)["']/.test(routes)) {
  ok("(2) 旧パス DELETE /reservations/:id 系が廃止されている");
} else {
  ng("(2) 旧パスがまだ残っています");
}

// ----- (3) controllers/index.js の cancel が req.params.userId を参照 -----
const ctrl = fs.readFileSync(path.join(ROOT, "server/src/controllers/index.js"), "utf8");
const cancelMatch = ctrl.match(/async function cancel\([\s\S]+?\n\}/);
if (cancelMatch && /req\.params\.userId/.test(cancelMatch[0])) {
  ok("(3) cancel が req.params.userId を参照している");
} else {
  ng("(3) cancel に req.params.userId 参照が見つかりません");
}

// ----- (4) cancel が pathUserId !== sessionUserId 時に W03 を返す -----
if (cancelMatch && /W03/.test(cancelMatch[0]) && /pathUserId\s*!==\s*sessionUserId/.test(cancelMatch[0])) {
  ok("(4) pathUserId !== sessionUserId の場合に W03 (403) を返す分岐がある");
} else {
  ng("(4) W03 / 本人外チェックの分岐が見つかりません");
}

// ----- (5) api-adapter.js が新パスを呼び出している -----
const apiAdapter = fs.readFileSync(path.join(ROOT, "app/js/datasource/api-adapter.js"), "utf8");
if (/\/api\/v1\/users\/.+\/reservations\//.test(apiAdapter)) {
  ok("(5) api-adapter.js が新パス /api/v1/users/:userId/reservations/:id を呼出している");
} else {
  ng("(5) api-adapter.js に新パスの呼出が見つかりません");
}

// ----- (6) 旧パス呼出が残っていないこと -----
if (!/ApiClient\.delete\(\s*["']\/api\/v1\/reservations\/["']\s*\+/.test(apiAdapter) &&
    !/ApiClient\.delete\(\s*`\/api\/v1\/reservations\//.test(apiAdapter)) {
  ok("(6) api-adapter.js に旧パス呼出が残っていない");
} else {
  ng("(6) api-adapter.js に旧パス呼出が残っています");
}

// ----- (7) messages.js に W03 が定義されている -----
const messages = fs.readFileSync(path.join(ROOT, "app/js/core/messages.js"), "utf8");
if (/W03:\s*\{[^}]*text:\s*"[^"]+"/.test(messages)) {
  ok("(7) messages.js に W03 が定義されている");
} else {
  ng("(7) messages.js に W03 定義がありません");
}

console.log("");
console.log("=== Result: " + pass + " PASS / " + fail + " FAIL ===");
process.exit(fail === 0 ? 0 : 1);
