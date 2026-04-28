/*
 * =============================================================================
 * ファイル名 : js/library-config.js
 * 概要       : 図書予約システムの実行時既定設定（フォールバック）。
 *              ブラウザ起動直後に必ず存在する安全な初期値を提供する。
 *
 * 仕様書トレーサビリティ:
 *   - 要求仕様書 RF-11 ブリッジ入出力 / §5 システム構成
 *   - 内部仕様書 CF01 loadConfig
 *   - DB仕様書   §2 適用範囲（正式DB=SQLite、Excel/JSONは補助）
 *   - テスト仕様 TC-COM-01〜05
 *
 * 設計意図:
 *   - 既定 dbType を "Excel" にし、まず Excel 環境で動作確認できる。
 *   - SQLite 切替時も API 形状は同一（CF03 / IRepository 契約）。
 * 作成日 : 2026-04-26
 * =============================================================================
 */
"use strict";

window.LIBRARY_CONFIG_FALLBACK = {
  dbType:             "Excel",                       // RF-11 / DB §2 既定
  maxReservations:    3,                             // RF-07 / TC-RES-04
  searchPageSize:     10,                            // 外部仕様§7.2 / TC-SRH-06
  pickupDeadlineDays: 7,                             // EX-02 取置期限（既定7日）
  configFileName:     "library-system-config.txt"    // 互換情報
};
