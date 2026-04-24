const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Reservation = sequelize.define('Reservation', {
    reservationId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    bookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    reservedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'reservations',
    timestamps: false,
    underscored: false
});

module.exports = Reservation;