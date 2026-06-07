'use strict';

/**
 * 相互検証用に追加された 3 名のユーザを seeder として保持する。
 * （開発メンバーが手動で INSERT したものの恒久対策版）
 * 
 * 実行：npx sequelize-cli db:seed --seed 20260529000000-seed-additional-users.js
 * 取消：npx sequelize-cli db:seed:undo --seed 20260529000000-seed-additional-users.js
 */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('users', [
      { userId: 21, userName: 'TestUser21' },
      { userId: 22, userName: 'TestUser22'   },
      { userId: 23, userName: 'TestUser23' },
    ], { ignoreDuplicates: true });
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { userId: [21, 22, 23] });
  },
};
