/*
 * Readable-code review note:
 * - Role: Sequelize model definition. Field names and types are part of the API contract with controllers and seeders.
 * - Keep behavior unchanged unless a specification or bug-fix task explicitly requires it.
 * - Comments in this file should explain intent, data contracts, and edge cases rather than repeat the code.
 */
/*
 * -----------------------------------------------------------------------------
 * ファイル名 : library-Tbackend/models/AuditLog.js
 * 概要       : 監査ログモデル(豊田 v3.0.6 由来、Tbackend 追加機能)。
 *              ログイン/操作/エラーを INFO/ERROR で記録。
 * -----------------------------------------------------------------------------
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const AuditLog = sequelize.define('AuditLog', {
    logId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    level: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: { isIn: [['INFO', 'WARN', 'ERROR']] },
        defaultValue: 'INFO'
    },
    eventType: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: () => new Date().toISOString()
    }
}, {
    tableName: 'audit_logs',
    timestamps: false,
    underscored: false
});

module.exports = AuditLog;
