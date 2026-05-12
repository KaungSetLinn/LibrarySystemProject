/*
 * =============================================================================
 * ファイル名 : js/library-config.js
 * 概要       : ハードコード安全網（FALLBACK）。
 *              library-system-config.txt も .js も読めない最悪ケースで使用される。
 *              ConfigManager の解決優先順位 (3) に該当。
 *
 * 仕様書トレーサビリティ:
 *   - 内部仕様書 v3.0  CF01 loadConfig（fallback 経路）
 *   - 要求仕様書 v3.0  RF-11
 *   - ADR-005 SSOT 経路階層
 *
 * 改訂履歴:
 *   v1.0  2026-04-15  Y.Toyoda  v2.x 初版
 *   v3.0  2026-05-04  Y.Toyoda  位置づけ明確化（最後の安全網）
 *
 * @author  Y.Toyoda
 * @version v3.0
 * =============================================================================
 */
"use strict";

/**
 * 最後の安全網となるハードコード設定値。
 * 通常はこの値が使われることは無い。
 * 使用された場合は ConfigManager.getResolutionPath() が
 * source="LIBRARY_CONFIG_FALLBACK" を示す。
 *
 * @type {Readonly<Object>}
 * @spec  内部仕様 CF01-3
 */
window.LIBRARY_CONFIG_FALLBACK = Object.freeze({
  dbType:                "Excel",
  maxReservations:       3,
  searchPageSize:        10,
  pickupDeadlineDays:    7,
  sessionTimeoutMinutes: 30,
  logLevel:              "info"
});
