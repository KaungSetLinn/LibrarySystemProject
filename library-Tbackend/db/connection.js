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
