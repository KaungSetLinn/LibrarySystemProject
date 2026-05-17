/*
 * READABLE-CODE REVIEW NOTE
 * 対象ファイル: library-Tbackend/models/User.js
 * 責務: Sequelize モデル定義。DB列名、型、制約を JS オブジェクトとして表現する。
 * 保守メモ: Controller の業務判断をモデルへ混ぜず、テーブル構造の SSOT として保つ。
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const User = sequelize.define('User', {
    userId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'users',
    timestamps: false,
    underscored: false
});

module.exports = User;