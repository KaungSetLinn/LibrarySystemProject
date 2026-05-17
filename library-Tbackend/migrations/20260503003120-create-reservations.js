/*
 * Readable-code review note:
 * - Role: Schema migration. Keep column names synchronized with models, seed data, and search/reservation queries.
 * - Keep behavior unchanged unless a specification or bug-fix task explicitly requires it.
 * - Comments in this file should explain intent, data contracts, and edge cases rather than repeat the code.
 */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reservations', {
      reservationId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'userId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      bookId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'books',
          key: 'bookId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      status: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      reservedAt: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      pickupDeadline: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      queueNo: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      cancelledAt: {
        type: Sequelize.TEXT,
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('reservations');
  }
};