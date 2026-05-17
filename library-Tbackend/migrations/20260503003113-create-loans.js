/*
 * READABLE-CODE REVIEW NOTE
 * 対象ファイル: library-Tbackend/migrations/20260503003113-create-loans.js
 * 責務: DB マイグレーション。テーブル定義とロールバック手順を管理する。
 * 保守メモ: 既存データとの互換性に注意し、モデル定義と差分が出ないようにする。
 */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('loans', {
      loanId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'userId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      bookId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'books',
          key: 'bookId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      loanDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      dueDate: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      returnDate: {
        type: Sequelize.TEXT,
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('loans');
  }
};