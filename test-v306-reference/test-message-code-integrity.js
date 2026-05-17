/*
 * READABLE-CODE REVIEW NOTE
 * 対象ファイル: test-v306-reference/test-message-code-integrity.js
 * 責務: v3.0.6 参照テスト。過去不具合の再発防止と仕様トレーサビリティ確認を担当する。
 * 保守メモ: 実装修正時は、ここにある期待値と画面/API 契約がズレていないか確認する。
 */
/*
 * =============================================================================
 * ファイル名 : test/test-message-code-integrity.js
 * 概要       : v3.0.5 新規回帰テスト。
 *              server/src/controllers/index.js で使用されている messageCode が
 *              すべて app/js/core/messages.js（クライアント側マスタ）に定義
 *              されていることを検証する。コード/文言の散在を防止する LL-10 規約。
 *
 * 検証ポイント:
 *   (1) controllers が使う全コードが messages.js に存在する
 *   (2) 4 層構造応答（result/messageCode/message/data）が ok()/err() で
 *       生成されている（response.js の実装）
 *   (3) auth.js も messageCode 規約に従って err() を経由している
 *
 * 仕様書トレーサビリティ:
 *   - 外部仕様 v4.0a-rev1 §8.2.1 messageCode 体系 / §8.2.2 4層構造
 *   - 内部仕様 v4.0a-rev1 §4.5 ServiceResult→HTTP マッピング
 *   - カゥン氏指摘            2026-05-06 / API レスポンス 4層構造統一
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

console.log("=== test-message-code-integrity.js (v3.0.5 / messageCode 整合) ===");

// ----- (1) controllers の使用コードが messages.js に定義されている -----
const ctrl = fs.readFileSync(path.join(ROOT, "server/src/controllers/index.js"), "utf8");
const auth = fs.readFileSync(path.join(ROOT, "server/src/middleware/auth.js"), "utf8");
const messages = fs.readFileSync(path.join(ROOT, "app/js/core/messages.js"), "utf8");

const usedCodes = new Set();
const codeRe = /"([IWE][0-9]{2})"/g;
let m;
while ((m = codeRe.exec(ctrl)) !== null) usedCodes.add(m[1]);
while ((m = codeRe.exec(auth)) !== null) usedCodes.add(m[1]);

const definedCodes = new Set();
const defRe = /^\s*([IWE][0-9]{2}):\s*\{/gm;
while ((m = defRe.exec(messages)) !== null) definedCodes.add(m[1]);

const missing = [];
usedCodes.forEach(c => { if (!definedCodes.has(c)) missing.push(c); });

if (missing.length === 0) {
  ok("(1) controllers/auth の全コード（" + usedCodes.size + " 個）が messages.js に定義されている");
} else {
  ng("(1) messages.js に未定義のコードがあります", missing.join(", "));
}

// ----- (2) response.js の ok()/err() が 4層構造を生成している -----
const resp = fs.readFileSync(path.join(ROOT, "server/src/utils/response.js"), "utf8");
const has4LayerOk = /result:\s*["']success["']/.test(resp) &&
                    /messageCode/.test(resp) &&
                    /message/.test(resp) &&
                    /data/.test(resp);
const has4LayerErr = /result:\s*["']error["']/.test(resp) &&
                     /data:\s*null/.test(resp);

if (has4LayerOk && has4LayerErr) {
  ok("(2) response.js の ok()/err() が 4 層構造を生成している（カゥン氏指摘整合）");
} else {
  ng("(2) response.js の 4 層構造が不完全です",
     "ok=" + has4LayerOk + ", err=" + has4LayerErr);
}

// ----- (3) auth.js が err() を経由している -----
if (/require\(["']\.\.\/utils\/response["']\)/.test(auth) && /\berr\(/.test(auth)) {
  ok("(3) auth.js が response.err() ヘルパを経由している");
} else {
  ng("(3) auth.js が 4 層構造ヘルパを使っていません");
}

// ----- (4) ok() のレスポンス使用例が controllers に含まれる -----
const okCallCount = (ctrl.match(/\bok\(res,\s*["'][IWE][0-9]{2}["']/g) || []).length;
const errCallCount = (ctrl.match(/\berr\(res,\s*["'][IWE][0-9]{2}["']/g) || []).length;
if (okCallCount >= 5 && errCallCount >= 5) {
  ok("(4) controllers で ok()/err() が十分に使用されている（ok=" + okCallCount + ", err=" + errCallCount + "）");
} else {
  ng("(4) ok()/err() の使用数が不足", "ok=" + okCallCount + ", err=" + errCallCount);
}

// ----- (5) messages.js に W03/W04/W11-W18/I00-I03/E01 が揃っている（API-06/05 必須） -----
const required = ["I00", "I01", "I02", "I03", "W01", "W02", "W03", "W04",
                  "W11", "W12", "W13", "W14", "W17", "W18", "E01"];
const lacking = required.filter(c => !definedCodes.has(c));
if (lacking.length === 0) {
  ok("(5) v4.0a-rev2 必須コード（" + required.length + " 個）が messages.js に揃っている");
} else {
  ng("(5) 必須コードが不足", lacking.join(", "));
}

console.log("");
console.log("=== Result: " + pass + " PASS / " + fail + " FAIL ===");
process.exit(fail === 0 ? 0 : 1);
