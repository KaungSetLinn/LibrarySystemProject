'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection'); // adjust path if needed

const Lending = sequelize.define('Lending', {
  lending_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  book_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  lending_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },

  due_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  return_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }

}, {
  tableName: 'lendings',
  timestamps: false
});

module.exports = Lending;