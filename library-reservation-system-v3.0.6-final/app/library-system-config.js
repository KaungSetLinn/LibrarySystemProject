/*
 * =============================================================================
 * ファイル名 : library-system-config.js
 * 概要       : 図書予約システム v3.0 設定ファイル（JS 形式）。
 *              library-system-config.txt と完全同内容を保持し、file:// プロトコル
 *              （HTML をダブルクリック起動）で fetch がブロックされる環境でも
 *              設定値を取得できるようにする「fallback 経路」を提供する。
 *
 *              ★ SSOT（Single Source of Truth）は library-system-config.txt ★
 *              本ファイルは txt と同一内容を必ず保つこと。差異がある場合は
 *              ConfigManager が起動時に検出し、警告ログを出力する。
 *
 * 仕様書トレーサビリティ:
 *   - 要求仕様書 v3.0  RF-11 ブリッジ入出力 / §5 システム構成
 *   - 内部仕様書 v3.0  CF01 loadConfig（async fetch 二経路化）
 *   - DB仕様書   v3.0  §2.3 物理ファイル / §22 Excel/CSV 対応
 *   - テスト仕様 v3.0  TC-COM-01〜09（設定読込・dbType 解決）
 *   - ADR-005             設定 SSOT を txt に固定
 *   - BUG調査報告 BUG-01  txt が読まれないバグの修正経路
 *   - 議事録          P1-01 / P4-03 / D-01
 *
 * 設計のポイント:
 *   - txt が SSOT。本 .js は file:// 環境用の fallback でしかない。
 *   - 値の重複登録（txt と .js の不一致）は事故の温床のため、
 *     ConfigManager.init() で起動時に整合性チェックを行う（CF01-3）。
 *   - 利用者は通常 txt のみ編集すれば十分。.js は CI/CD 等で自動再生成する。
 *
 * 改訂履歴:
 *   v1.0  2026-04-15  Y.Toyoda  新規作成（v2.x の library-config.js と統合）
 *   v3.0  2026-05-04  Y.Toyoda  v3.0 最終版（dbType バグ修正・SSOT 経路化）
 *
 * @author  Y.Toyoda
 * @since   v1.0
 * @version v3.0
 * =============================================================================
 */
"use strict";

/**
 * 図書予約システムの設定値（fallback 経路 / file:// 用）。
 *
 * ★重要★
 *   利用者が普段編集するのは library-system-config.txt のみ。
 *   本ファイルは txt と同一内容を保つよう、変更時は両方更新する。
 *   ConfigManager.init() が両者の不一致を検知した場合、
 *   txt 側を優先する（=SSOT）。
 *
 * @type {Readonly<{
 *   dbType: ("Excel"|"SQLite"),
 *   maxReservations: number,
 *   searchPageSize: number,
 *   pickupDeadlineDays: number,
 *   sessionTimeoutMinutes: number,
 *   logLevel: ("debug"|"info"|"warn"|"error")
 * }>}
 *
 * @spec 要求仕様書 RF-11, 内部仕様書 CF01, DB仕様書 §22
 */
window.LIBRARY_CONFIG_FILE_JS = Object.freeze({
  // データソース種別。"Excel" = localStorage 経由（ブラウザ単体）、
  //                   "SQLite" = server/ 経由（Express + better-sqlite3）。
  // RF-11 / DB §22 ハイブリッド構成。
  dbType: "Excel",

  // 1利用者あたりの予約冊数上限。RF-07 / TC-RES-04。
  // 0 以下は ConfigManager.validateConfig() で 3 に補正される。
  maxReservations: 3,

  // 検索結果1ページあたりの件数。外部仕様 §7.2 / TC-SRH-06。
  searchPageSize: 10,

  // 予約成立後の取置期限（日）。EX-02 取置期限（既定7日）。
  pickupDeadlineDays: 7,

  // セッション有効期間（分）。BUG-09 / P4-12 反映。30分超で自動ログアウト。
  sessionTimeoutMinutes: 30,

  // ログレベル。"debug" は開発時のみ。提出版は "info" 推奨。
  // BUG-17 / P4-14 共通 Logger 連動。
  logLevel: "info"
});
