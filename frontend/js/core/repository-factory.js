/*
 * =============================================================================
 * ファイル名 : js/core/repository-factory.js
 * 概要       : RepositoryFactory。dbType に応じて IRepository 実装を返す。
 *
 * 仕様書トレーサビリティ:
 *   - 内部仕様書 CF03 createRepository
 *   - 要求仕様書 §5 システム構成 / §11 将来拡張（SQLite正式化）
 *   - テスト仕様 TC-COM-02 切替
 * 作成日 : 2026-04-26
 * =============================================================================
 */
"use strict";

const RepositoryFactory = {
  /**
   * CF03 - create
   * 概要   : 設定 dbType に基づいて IRepository 実装を返す。
   * 戻り値 : ExcelAdapter | SQLiteStubAdapter
   * 例外   : 想定外 dbType の場合は ExcelAdapter にフォールバック。
   */
  create() {
    const dbType = (window.ConfigManager && ConfigManager.get("dbType")) || "Excel";
    if (dbType === "SQLite" && window.SQLiteStubAdapter) return SQLiteStubAdapter;
    return window.ExcelAdapter;
  }
};

window.RepositoryFactory = RepositoryFactory;
