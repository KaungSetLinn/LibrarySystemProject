/*
 * READABLE-CODE REVIEW NOTE
 * 対象ファイル: library-Tbackend/migrations/20260503003120-create-reservations.js
 * 責務: DB マイグレーション。テーブル定義とロールバック手順を管理する。
 * 保守メモ: 既存データとの互換性に注意し、モデル定義と差分が出ないようにする。
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