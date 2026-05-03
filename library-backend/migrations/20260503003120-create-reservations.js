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