/*
 * READABLE-CODE REVIEW NOTE
 * 対象ファイル: library-Tbackend/migrations/20260503003038-create-users.js
 * 責務: DB マイグレーション。テーブル定義とロールバック手順を管理する。
 * 保守メモ: 既存データとの互換性に注意し、モデル定義と差分が出ないようにする。
 */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      userId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      userName: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
  }
};