/*
 * Readable-code review note:
 * - Role: Sequelize model definition. Field names and types are part of the API contract with controllers and seeders.
 * - Keep behavior unchanged unless a specification or bug-fix task explicitly requires it.
 * - Comments in this file should explain intent, data contracts, and edge cases rather than repeat the code.
 */
/*
 * -----------------------------------------------------------------------------
 * ファイル名 : library-Tbackend/models/Notification.js
 * 概要       : 通知モデル(豊田 v3.0.6 由来、Tbackend 追加機能)。
 *              既読化フラグを保持。SUCCESS/WARN/INFO の3種類のタイプを想定。
 * 作成者     : Y.Toyoda
 * 作成日     : 2026-05-12
 * -----------------------------------------------------------------------------
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Notification = sequelize.define('Notification', {
    notificationId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: { isIn: [['SUCCESS', 'WARN', 'INFO', 'ERROR']] }
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: () => new Date().toISOString()
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    readAt: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'notifications',
    timestamps: false,
    underscored: false
});

module.exports = Notification;
