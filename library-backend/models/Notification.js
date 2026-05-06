const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Notification = sequelize.define('Notification', {
    notificationId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'userId'
        }
    },
    type: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'notifications',
    timestamps: true,
    updatedAt: false,     // createdAt のみ Sequelize が自動管理、updatedAt は不要
    underscored: false
});

module.exports = Notification;