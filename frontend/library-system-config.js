/*
 * READABLE-CODE REVIEW NOTE
 * 対象ファイル: frontend/library-system-config.js
 * 責務: ブラウザ側設定値。txt 設定が読めない場合の fallback として動作する。
 * 保守メモ: SSOT は library-system-config.txt。設定を増やす場合は txt/js/fallback の差分検出も更新する。
 */
/*
 * =============================================================================
 * ファイル名 : library-system-config.js
 * 概要       : 図書予約システム v3.0.6 設定ファイル(JS 形式 fallback)。
 *              library-system-config.txt と完全同内容を保持し、file://
 *              プロトコル(HTML をダブルクリック起動)で fetch がブロックされる
 *              環境でも設定値を取得できるようにする「fallback 経路」を提供する。
 *
 *              ★ SSOT は library-system-config.txt ★
 *              本ファイルは txt と同一内容を必ず保つこと。差異がある場合は
 *              ConfigManager が起動時に検出し、警告ログを出力する。
 *
 * 改訂履歴:
 *   v1.0     2026-04-15  Y.Toyoda  新規作成
 *   v3.0     2026-05-04  Y.Toyoda  v3.0 最終版
 *   v3.0.6+  2026-05-12  Y.Toyoda  統合パッケージ用 backendMode キー追加
 *
 * @author  Y.Toyoda
 * @version v3.0.6+integration
 * =============================================================================
 */
"use strict";

/**
 * 図書予約システムの設定値(fallback 経路 / file:// 用)。
 *
 * @type {Readonly<{
 *   backendMode: ("MAIN"|"TEST"),
 *   dbType: ("Excel"|"SQLite"),
 *   maxReservations: number,
 *   searchPageSize: number,
 *   pickupDeadlineDays: number,
 *   sessionTimeoutMinutes: number,
 *   logLevel: ("debug"|"info"|"warn"|"error")
 * }>}
 */
window.LIBRARY_CONFIG_FILE_JS = Object.freeze({
  // バックエンド切替(統合パッケージ追加)
  // MAIN = library-backend (カゥン氏正本 /api/v1/*)
  // TEST = library-Tbackend (豊田テスト /api/* + /api/v1/health)
  backendMode: "MAIN",

  // データソース種別
  dbType: "SQLite",

  // 予約上限
  maxReservations: 3,

  // 検索1ページ件数
  searchPageSize: 10,

  // 取置期限(日)
  pickupDeadlineDays: 7,

  // セッション(分)
  sessionTimeoutMinutes: 30,

  // ログレベル
  logLevel: "info"
});
