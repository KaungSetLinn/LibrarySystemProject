'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection'); // adjust path if needed

const Lending = sequelize.define('Lending', {
  lendingId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  lendingDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },

  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  returnDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }

}, {
  tableName: 'lendings',
  timestamps: false,
  underscored: false
});

module.exports = Lending;