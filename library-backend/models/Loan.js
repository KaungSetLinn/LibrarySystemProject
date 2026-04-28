'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection'); // adjust path if needed

const Loan = sequelize.define('Loan', {
  loanId: {
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

  loanDate: {
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
  tableName: 'loans',
  timestamps: false,
  underscored: false
});

module.exports = Loan;