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