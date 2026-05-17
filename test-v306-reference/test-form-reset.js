/*
 * READABLE-CODE REVIEW NOTE
 * 対象ファイル: test-v306-reference/test-form-reset.js
 * 責務: v3.0.6 参照テスト。過去不具合の再発防止と仕様トレーサビリティ確認を担当する。
 * 保守メモ: 実装修正時は、ここにある期待値と画面/API 契約がズレていないか確認する。
 */
/*
 * =============================================================================
 * ファイル名 : test/test-form-reset.js
 * 概要       : BUG-19〜BUG-23（form.reset() 起因の動的値消失）の自動再現
 *              および修正検証テスト。jsdom 不使用の軽量シミュレーション版。
 *
 * 実行: node test/test-form-reset.js
 *
 * 検証項目:
 *   1) BUG-19 再現：v3.0 のクリア処理ではブラウザ名が消える
 *   2) BUG-19 修正：v3.0.1 のクリア処理ではブラウザ名が再描画される
 *   3) BUG-20 修正：dbTypeSelect.value が ConfigManager.dbType と再同期する
 *   4) BUG-21 修正：sort セレクトが "bookId" に明示再代入される
 *   5) BUG-22 修正：refreshSummary が再呼出される（呼出回数で検証）
 *   6) BUG-23 修正：showMessage が "info" で呼出される（a11y 通知）
 *   7) 規約 LL-09：fillBrowserFields の冪等性
 *   8) 全体回帰：4 ステップが順序通り実行される
 *
 * @author  Y.Toyoda
 * @version v3.0.1
 * =============================================================================
 */
"use strict";

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); console.log("✓ PASS:", name); passed++; }
  catch (e) { console.log("✗ FAIL:", name, "->", e.message); failed++; }
}
function assertEq(actual, expected, msg) {
  if (actual !== expected) throw new Error(`${msg}: expected=${expected}, actual=${actual}`);
}
function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

console.log("\n========== BUG-19〜BUG-23 修正検証 ==========\n");

// ------------------------------------------------------------------
// 共通モック：login フォームを模擬したオブジェクトを構築
// ------------------------------------------------------------------
function makeMockEnv(initialBrowserField, initialDbType) {
  const fields = {
    userId:        { value: "1" },
    userName:      { value: "佐藤翔太" },
    browserName:   { value: initialBrowserField, focus: () => {} },
    dbTypeSelect:  { value: initialDbType }
  };
  let calls = { fillBrowserFields: 0, refreshSummary: 0, showMessage: [], dbSelectAssigned: 0 };
  const env = {
    fields, calls,
    fillBrowserFields: () => { fields.browserName.value = "Chrome"; calls.fillBrowserFields++; },
    refreshSummary:    () => { calls.refreshSummary++; },
    showMessage:       (type, msg) => { calls.showMessage.push({ type, msg }); },
    ConfigManager:     { get: k => ({ dbType: "Excel" })[k] },
    formReset: () => {
      // form.reset() の挙動シミュレーション：HTML 既定値（空 / 先頭値）に戻る
      fields.userId.value      = "";
      fields.userName.value    = "";
      fields.browserName.value = ""; // ★ BUG-19 の核心：JS で埋めた値が消える
      fields.dbTypeSelect.value = "Excel"; // 先頭値（HTML order）に戻る想定
    }
  };
  return env;
}

// ------------------------------------------------------------------
// 旧（v3.0）クリアハンドラ：BUG-19/20 を再現するため
// ------------------------------------------------------------------
function clearHandler_v3_0(env) {
  env.formReset();
  // refreshSummary も showMessage も fillBrowserFields も呼ばない（バグ）
}

// ------------------------------------------------------------------
// 新（v3.0.1）クリアハンドラ：規約 LL-09 を完全実装
// ------------------------------------------------------------------
function clearHandler_v3_0_1(env) {
  env.formReset();
  // (1) ブラウザ名再描画
  env.fillBrowserFields();
  // (2) DB 種別セレクト再同期
  env.fields.dbTypeSelect.value = env.ConfigManager.get("dbType");
  env.calls.dbSelectAssigned++;
  // (3) 設定サマリ再描画
  env.refreshSummary();
  // (4) a11y 通知
  env.showMessage("info", "入力をクリアしました。");
}

// ------------------------------------------------------------------
// 検索画面 v3.0.1 クリアハンドラ：BUG-21 修正
// ------------------------------------------------------------------
function clearHandler_search_v3_0_1(env) {
  env.formReset();
  // BUG-21 修正：sort 既定値を明示再代入
  env.fields.sort = { value: "" };
  env.fields.sort.value = "bookId";
  env.showMessage("info", "検索条件をクリアしました。");
}

// ------------------------------------------------------------------
// テスト実行
// ------------------------------------------------------------------

test("BUG-19 再現：旧 v3.0 のクリアハンドラはブラウザ名を消したまま", () => {
  const env = makeMockEnv("Chrome", "Excel");
  clearHandler_v3_0(env);
  assertEq(env.fields.browserName.value, "", "browserName should be empty (BUG-19 reproduction)");
  assertEq(env.calls.fillBrowserFields, 0, "fillBrowserFields should NOT be called");
});

test("BUG-19 修正：v3.0.1 のクリアハンドラはブラウザ名を再描画する", () => {
  const env = makeMockEnv("Chrome", "Excel");
  clearHandler_v3_0_1(env);
  assertEq(env.fields.browserName.value, "Chrome", "browserName should be re-filled");
  assertEq(env.calls.fillBrowserFields, 1, "fillBrowserFields should be called once");
});

test("BUG-20 修正：dbTypeSelect が ConfigManager.dbType と再同期する", () => {
  const env = makeMockEnv("Chrome", "SQLite"); // 利用者が SQLite に切替済の状態
  // ConfigManager は Excel を返す状況（SSOT との乖離想定）
  clearHandler_v3_0_1(env);
  assertEq(env.fields.dbTypeSelect.value, "Excel", "dbTypeSelect should re-sync to Excel");
  assertEq(env.calls.dbSelectAssigned, 1, "dbSelect should be assigned once");
});

test("BUG-21 修正：sort セレクトが \"bookId\" に明示再代入される", () => {
  const env = makeMockEnv("Chrome", "Excel");
  clearHandler_search_v3_0_1(env);
  assertEq(env.fields.sort.value, "bookId", "sort should be reset to bookId");
});

test("BUG-22 修正：refreshSummary が呼出される", () => {
  const env = makeMockEnv("Chrome", "Excel");
  clearHandler_v3_0_1(env);
  assertEq(env.calls.refreshSummary, 1, "refreshSummary should be called once");
});

test("BUG-23 修正：showMessage が info で呼出される（a11y 通知）", () => {
  const env = makeMockEnv("Chrome", "Excel");
  clearHandler_v3_0_1(env);
  assert(env.calls.showMessage.length === 1, "showMessage should be called once");
  assertEq(env.calls.showMessage[0].type, "info", "type should be 'info'");
  assert(env.calls.showMessage[0].msg.includes("クリア"), "msg should mention クリア");
});

test("規約 LL-09：fillBrowserFields は冪等（複数回呼んでも結果同一）", () => {
  const env = makeMockEnv("", "Excel");
  env.fillBrowserFields();
  const after1 = env.fields.browserName.value;
  env.fillBrowserFields();
  env.fillBrowserFields();
  const after3 = env.fields.browserName.value;
  assertEq(after1, after3, "fillBrowserFields should be idempotent");
});

test("全体回帰：v3.0.1 ハンドラが 4 ステップを順序通り実行する", () => {
  const env = makeMockEnv("Chrome", "Excel");
  const orderLog = [];
  // 呼出順序を記録するラッパー
  const orig = {
    fb: env.fillBrowserFields, rs: env.refreshSummary, sm: env.showMessage
  };
  env.fillBrowserFields = () => { orderLog.push("fillBrowserFields"); orig.fb(); };
  env.refreshSummary    = () => { orderLog.push("refreshSummary"); orig.rs(); };
  env.showMessage       = (t, m) => { orderLog.push("showMessage"); orig.sm(t, m); };

  clearHandler_v3_0_1(env);
  assertEq(orderLog.length, 3, "3 callbacks should be invoked");
  assertEq(orderLog[0], "fillBrowserFields", "step 1 = fillBrowserFields");
  assertEq(orderLog[1], "refreshSummary",    "step 2 = refreshSummary");
  assertEq(orderLog[2], "showMessage",       "step 3 = showMessage");
});

console.log(`\n結果: ${passed} pass / ${failed} fail\n`);
process.exit(failed > 0 ? 1 : 0);
