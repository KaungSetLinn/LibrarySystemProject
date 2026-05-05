const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Favorite = sequelize.define('Favorite', {
    favoriteId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'userId'
        }
    },
    bookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'books',
            key: 'bookId'
        }
    },
    addedAt: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'favorites',
    timestamps: false,
    underscored: false
});

module.exports = Favorite;