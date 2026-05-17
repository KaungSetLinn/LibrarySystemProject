/*
 * READABLE-CODE REVIEW NOTE
 * 対象ファイル: library-Tbackend/db/connection.js
 * 責務: 豊田テスト backend の DB 接続設定。SQLite ファイルと Sequelize 接続を生成する。
 * 保守メモ: DB ファイル名は start.js の backendMode 判定と一致させる。
 */
/*
 * -----------------------------------------------------------------------------
 * ファイル名 : library-Tbackend/db/connection.js
 * 概要       : 豊田テストバックエンドの Sequelize 接続。
 *              MAIN バックエンドと DB を分離するため libraryT.db を使用。
 * 作成者     : Y.Toyoda
 * 作成日     : 2026-05-12
 * 備考       : スキーマは MAIN と互換 + Favorite/Notification/AuditLog を追加。
 * -----------------------------------------------------------------------------
 */
const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    // __dirname 基準の絶対パス化(CWD依存排除、v3.0.6 B-10 修正方針踏襲)
    storage: path.join(__dirname, '..', 'libraryT.db'),
    logging: false
});

module.exports = sequelize;
