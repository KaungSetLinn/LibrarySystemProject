const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Book = sequelize.define('Book', {
    book_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    book_name: {
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
    can_reserve: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    is_disabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    arrival_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
}, {
    tableName: 'books',
    timestamps: false
});

module.exports = Book;