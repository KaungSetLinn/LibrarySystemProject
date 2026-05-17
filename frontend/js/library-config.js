/*
 * READABLE-CODE REVIEW NOTE
 * 対象ファイル: frontend/js/library-config.js
 * 責務: ブラウザ側設定値。txt 設定が読めない場合の fallback として動作する。
 * 保守メモ: SSOT は library-system-config.txt。設定を増やす場合は txt/js/fallback の差分検出も更新する。
 */
/*
 * =============================================================================
 * ファイル名 : js/library-config.js
 * 概要       : ハードコード安全網(FALLBACK)。
 *              library-system-config.txt も .js も読めない最悪ケースで使用される。
 *              ConfigManager の解決優先順位 (3) に該当。
 *
 * 改訂履歴:
 *   v1.0     2026-04-15  Y.Toyoda  v2.x 初版
 *   v3.0     2026-05-04  Y.Toyoda  位置づけ明確化
 *   v3.0.6+  2026-05-12  Y.Toyoda  統合パッケージ用 backendMode キー追加
 *
 * @author  Y.Toyoda
 * @version v3.0.6+integration
 * =============================================================================
 */
"use strict";

/**
 * 最後の安全網となるハードコード設定値。
 * 通常はこの値が使われることは無い。
 *
 * @type {Readonly<Object>}
 */
window.LIBRARY_CONFIG_FALLBACK = Object.freeze({
  backendMode:           "MAIN",
  dbType:                "SQLite",
  maxReservations:       3,
  searchPageSize:        10,
  pickupDeadlineDays:    7,
  sessionTimeoutMinutes: 30,
  logLevel:              "info"
});
