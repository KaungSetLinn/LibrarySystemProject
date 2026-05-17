/*
 * READABLE-CODE REVIEW NOTE
 * 対象ファイル: library-Tbackend/migrations/20260503003104-create-books.js
 * 責務: DB マイグレーション。テーブル定義とロールバック手順を管理する。
 * 保守メモ: 既存データとの互換性に注意し、モデル定義と差分が出ないようにする。
 */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('books', {
      bookId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      title: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      author: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      category: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      canReserve: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      isDisabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      arrivalDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('books');
  }
};