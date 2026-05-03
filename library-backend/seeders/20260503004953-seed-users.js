'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('users', [
    { userId: 1, userName: '佐藤翔太' },
    { userId: 2, userName: '鈴木蓮' },
    { userId: 3, userName: '高橋翔' },
    { userId: 4, userName: '田中陸' },
    { userId: 5, userName: '渡辺颯太' },
    { userId: 6, userName: '伊藤悠斗' },
    { userId: 7, userName: '山本大翔' },
    { userId: 8, userName: '中村樹' },
    { userId: 9, userName: '小林翼' },
    { userId: 10, userName: '加藤大和' },
    { userId: 11, userName: '吉田奏太' },
    { userId: 12, userName: '山田大輝' },
    { userId: 13, userName: '佐々木悠' },
    { userId: 14, userName: '山口隼人' },
    { userId: 15, userName: '松本大輔' },
    { userId: 16, userName: '井上健太' },
    { userId: 17, userName: '井上駿' },
    { userId: 18, userName: '斎藤優' },
    { userId: 19, userName: '木村陽斗' },
    { userId: 20, userName: '林悠人' },
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  }
};