const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Book = sequelize.define('Book', {
    bookId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    author: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    category: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    canReserve: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    isDisabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    arrivalDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
}, {
    tableName: 'books',
    timestamps: false,
    underscored: false
});

module.exports = Book;