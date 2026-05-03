const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Audit = sequelize.define('Audit', {
    logId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    level: {
        type: DataTypes.STRING,
        allowNull: true
    },
    eventType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'userId'
        }
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'audit',
    timestamps: false,
    underscored: false
});

module.exports = Audit;