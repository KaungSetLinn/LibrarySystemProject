/*
 * READABLE-CODE REVIEW NOTE
 * 対象ファイル: library-Tbackend/models/Book.js
 * 責務: Sequelize モデル定義。DB列名、型、制約を JS オブジェクトとして表現する。
 * 保守メモ: Controller の業務判断をモデルへ混ぜず、テーブル構造の SSOT として保つ。
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Book = sequelize.define('Book', {
    bookId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    author: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    category: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    canReserve: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    isDisabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    arrivalDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
}, {
    tableName: 'books',
    timestamps: false,
    underscored: false
});

module.exports = Book;