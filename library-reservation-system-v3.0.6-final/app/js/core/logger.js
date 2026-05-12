/*
 * =============================================================================
 * ファイル名 : js/core/logger.js
 * 概要       : 共通ロガー（Logger）。console 直撃を全廃し、レベル制御可能な
 *              ログ出力を提供する。提出版（logLevel=info）は debug を抑止し、
 *              本番コンソールを綺麗に保つ。
 *
 * 仕様書トレーサビリティ:
 *   - 外部仕様書 v3.0  §17 ロギング仕様
 *   - 内部仕様書 v3.0  §5 ミドルウェア標準チェーン（クライアント側）
 *   - テスト仕様 v3.0  TC-COM-06 ログ出力レベル
 *   - 議事録          P1-12 / P4-14 / D-04（共通 Logger 導入）
 *   - BUG調査         BUG-17（console.* 散在）
 *
 * 設計のポイント:
 *   - レベル: debug < info < warn < error。指定レベル以上のみ出力する。
 *   - シークレット（password / sessionId 等）は出力前に自動マスク。
 *   - ConfigManager 未初期化時は info をデフォルトとして安全動作。
 *
 * 改訂履歴:
 *   v3.0  2026-05-04  Y.Toyoda  新規作成（議事録 D-04 反映）
 *
 * @author  Y.Toyoda
 * @version v3.0
 * =============================================================================
 */
"use strict";

const Logger = (() => {

  // レベル順位。値が大きいほど重要度が高い。
  const LEVELS = Object.freeze({ debug: 10, info: 20, warn: 30, error: 40 });

  // マスク対象のキー（議事録 P4-14 / 外部仕様 §17 反映）。
  const MASK_KEYS = Object.freeze(["password", "passwordHash", "sessionId", "csrfToken", "secret"]);

  /**
   * _currentLevel
   * 概要 : ConfigManager から logLevel を取得して数値化する。
   *        ConfigManager 未読込時は "info" 相当（20）を返す（防御的初期化）。
   *
   * @returns {number} レベル数値（debug=10 〜 error=40）
   * @spec    外部仕様書 §17, 議事録 D-04
   */
  function _currentLevel() {
    const lv = (window.ConfigManager && ConfigManager.get("logLevel")) || "info";
    return LEVELS[lv] || LEVELS.info;
  }

  /**
   * _maskSecrets
   * 概要 : ログ出力対象のオブジェクトに含まれる機密キーをマスクする。
   *        再帰的にネストオブジェクトもチェックする。
   *
   * @param {*} obj ログ対象データ（任意の型を許容）
   * @returns {*} マスク済みのコピー（原本は変更しない）
   * @spec    外部仕様書 §17 マスク対象
   */
  function _maskSecrets(obj) {
    if (obj === null || typeof obj !== "object") return obj;
    if (Array.isArray(obj)) return obj.map(_maskSecrets);
    const out = {};
    for (const k of Object.keys(obj)) {
      // 機密キーは伏せ字に置換。それ以外は再帰でマスク処理。
      out[k] = MASK_KEYS.includes(k) ? "***MASKED***" : _maskSecrets(obj[k]);
    }
    return out;
  }

  /**
   * _emit
   * 概要 : 指定レベルでログを実際に出力する。
   *        現在レベル未満なら出力しない（性能配慮）。
   *
   * @param {("debug"|"info"|"warn"|"error")} level 出力レベル
   * @param {string} tag タグ（呼出元識別）
   * @param {string} msg 主メッセージ
   * @param {*} [data] 任意の追加データ（マスク対象）
   * @returns {void}
   */
  function _emit(level, tag, msg, data) {
    if (LEVELS[level] < _currentLevel()) return;
    const ts = new Date().toISOString();
    const payload = data === undefined ? "" : _maskSecrets(data);
    // console.error / warn / info / log を level に応じて使い分け。
    const fn = (level === "error") ? "error"
             : (level === "warn")  ? "warn"
             : (level === "info")  ? "info"
             :                       "log";
    if (data === undefined) {
      console[fn](`[${ts}] [${level.toUpperCase()}] [${tag}] ${msg}`);
    } else {
      console[fn](`[${ts}] [${level.toUpperCase()}] [${tag}] ${msg}`, payload);
    }
  }

  /**
   * debug : 開発時の詳細ログ。logLevel=debug のときのみ出力。
   * @param {string} tag
   * @param {string} msg
   * @param {*} [data]
   * @spec  外部仕様 §17
   */
  function debug(tag, msg, data) { _emit("debug", tag, msg, data); }

  /**
   * info : 通常運用情報（起動完了、認証成功 等）。
   * @param {string} tag
   * @param {string} msg
   * @param {*} [data]
   * @spec  外部仕様 §17
   */
  function info(tag, msg, data) { _emit("info", tag, msg, data); }

  /**
   * warn : 警告（設定不正補正、リトライ可能エラー 等）。
   * @param {string} tag
   * @param {string} msg
   * @param {*} [data]
   * @spec  外部仕様 §17
   */
  function warn(tag, msg, data) { _emit("warn", tag, msg, data); }

  /**
   * error : 致命的エラー（例外、業務ルール違反、DB破損 等）。
   * @param {string} tag
   * @param {string} msg
   * @param {*} [data]
   * @spec  外部仕様 §17
   */
  function error(tag, msg, data) { _emit("error", tag, msg, data); }

  /**
   * @example
   *   Logger.info("Service.authenticate", "ログイン成功", { userId: "1" });
   *   Logger.error("ExcelAdapter.reserveBook", "ID 重複検出", { bookId: 12 });
   */
  return Object.freeze({ debug, info, warn, error });
})();

window.Logger = Logger;
