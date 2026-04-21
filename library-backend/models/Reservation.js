const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Reservation = sequelize.define('Reservation', {
    reservation_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    reserved_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'reservations',
    timestamps: false
});

module.exports = Reservation;