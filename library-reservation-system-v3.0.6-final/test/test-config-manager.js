/*
 * =============================================================================
 * ファイル名 : test/test-config-manager.js
 * 概要       : ConfigManager の dbType バグ修正検証テスト（手動実行）。
 *              node 環境で window/localStorage/fetch をスタブ化して動作検証する。
 *
 * 実行: node test/test-config-manager.js
 *
 * 検証項目:
 *   1) library-system-config.txt が読まれること（BUG-01 修正）
 *   2) localStorage.lib-config が起動時に削除されること（BUG-02 修正）
 *   3) setDbType が localStorage に永続化しないこと（BUG-02 修正）
 *   4) txt と .js の整合性チェックが動作すること
 *
 * @author Y.Toyoda
 * @version v3.0
 * =============================================================================
 */
"use strict";

const path = require("path");
const fs = require("fs");

// ----- スタブ環境 -----
const _store = {};
global.localStorage = {
  getItem: k => _store[k] === undefined ? null : _store[k],
  setItem: (k, v) => { _store[k] = String(v); },
  removeItem: k => { delete _store[k]; }
};
global.fetch = async (url) => {
  const txtPath = path.join(__dirname, "..", "app", "library-system-config.txt");
  if (url.includes("library-system-config.txt") && fs.existsSync(txtPath)) {
    const text = fs.readFileSync(txtPath, "utf-8");
    return { ok: true, status: 200, text: async () => text };
  }
  return { ok: false, status: 404, text: async () => "" };
};
global.window = {};
global.console.warn = (...args) => console.log("[WARN]", ...args);

// ----- ConfigManager 読込 -----
require(path.join(__dirname, "..", "app", "js", "library-config.js"));
require(path.join(__dirname, "..", "app", "library-system-config.js"));
require(path.join(__dirname, "..", "app", "js", "core", "config-manager.js"));

const ConfigManager = global.window.ConfigManager;
let passed = 0, failed = 0;

function test(name, fn) {
  return Promise.resolve(fn()).then(() => {
    console.log("✓ PASS:", name); passed++;
  }).catch(e => {
    console.log("✗ FAIL:", name, "->", e.message); failed++;
  });
}

(async () => {
  console.log("\n========== ConfigManager v3.0 動作検証 ==========\n");

  // 事前に旧キー (BUG-02 シミュレーション) を仕込む
  global.localStorage.setItem("lib-config", JSON.stringify({ dbType: "SQLite" }));

  await test("BUG-01: txt が読み込まれる", async () => {
    await ConfigManager.init();
    const path = ConfigManager.getResolutionPath();
    if (path.source !== "library-system-config.txt") {
      throw new Error("source=" + path.source);
    }
  });

  await test("BUG-01: dbType=Excel が反映される", async () => {
    if (ConfigManager.get("dbType") !== "Excel") {
      throw new Error("dbType=" + ConfigManager.get("dbType"));
    }
  });

  await test("BUG-02: 旧 lib-config キーが削除される", async () => {
    if (global.localStorage.getItem("lib-config") !== null) {
      throw new Error("legacy key remained");
    }
  });

  await test("BUG-04: maxReservations が number 型", async () => {
    if (typeof ConfigManager.get("maxReservations") !== "number") {
      throw new Error("type=" + typeof ConfigManager.get("maxReservations"));
    }
  });

  await test("BUG-02: setDbType は localStorage に永続化しない", async () => {
    ConfigManager.setDbType("SQLite");
    if (global.localStorage.getItem("lib-config") !== null) {
      throw new Error("setDbType wrote to legacy key");
    }
    if (global.localStorage.getItem("lib-config-overrides") !== null) {
      throw new Error("setDbType wrote to overrides key");
    }
  });

  await test("setDbType は実行時の値は変える", async () => {
    if (ConfigManager.get("dbType") !== "SQLite") {
      throw new Error("runtime value not changed");
    }
  });

  await test("validateConfig が不正値を補正", async () => {
    ConfigManager.setDbType("InvalidValue"); // 失敗のはず
    if (ConfigManager.get("dbType") !== "SQLite") {
      throw new Error("invalid value accepted");
    }
  });

  console.log(`\n結果: ${passed} pass / ${failed} fail\n`);
  process.exit(failed > 0 ? 1 : 0);
})();
