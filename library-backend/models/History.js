const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const History = sequelize.define('History', {
    historyId: {
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
    bookId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'books',
            key: 'bookId'
        }
    },
    eventType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    eventAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    detail: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    reservationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'reservations', key: 'reservationId' }
    },
    loanId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'loans', key: 'loanId' }
    },
}, {
    tableName: 'history',
    timestamps: false,
    underscored: false
});

module.exports = History;