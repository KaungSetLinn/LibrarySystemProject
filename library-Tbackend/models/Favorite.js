/*
 * Readable-code review note:
 * - Role: Sequelize model definition. Field names and types are part of the API contract with controllers and seeders.
 * - Keep behavior unchanged unless a specification or bug-fix task explicitly requires it.
 * - Comments in this file should explain intent, data contracts, and edge cases rather than repeat the code.
 */
/*
 * -----------------------------------------------------------------------------
 * ファイル名 : library-Tbackend/models/Favorite.js
 * 概要       : お気に入りモデル(豊田 v3.0.6 由来、Tbackend 追加機能)。
 *              ユーザーごとの書籍お気に入りを保持。W19 重複検出に対応。
 * 作成者     : Y.Toyoda
 * 作成日     : 2026-05-12
 * -----------------------------------------------------------------------------
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Favorite = sequelize.define('Favorite', {
    favoriteId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    bookId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    addedAt: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: () => new Date().toISOString()
    }
}, {
    tableName: 'favorites',
    timestamps: false,
    underscored: false,
    indexes: [
        // W19 重複検出のための一意制約
        { unique: true, fields: ['userId', 'bookId'], name: 'idx_favorites_user_book' }
    ]
});

module.exports = Favorite;
