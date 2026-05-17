/*
 * Readable-code review note:
 * - Role: Sequelize model definition. Field names and types are part of the API contract with controllers and seeders.
 * - Keep behavior unchanged unless a specification or bug-fix task explicitly requires it.
 * - Comments in this file should explain intent, data contracts, and edge cases rather than repeat the code.
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Reservation = sequelize.define('Reservation', {
    reservationId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    bookId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    status: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            isIn: [['WAITING', 'RESERVED', 'CANCELLED']]
        }
    },
    reservedAt: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    pickupDeadline: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    queueNo: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    cancelledAt: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'reservations',
    timestamps: false,
    underscored: false
});

module.exports = Reservation;