'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('lendings', [
      {
        userId: 1,
        bookId: 100,
        lendingDate: '2026-04-01',
        dueDate: '2026-04-15',
        returnDate: null
      },
      {
        userId: 2,
        bookId: 102,
        lendingDate: '2026-04-05',
        dueDate: '2026-04-19',
        returnDate: null
      },
      {
        userId: 3,
        bookId: 104,
        lendingDate: '2026-04-10',
        dueDate: '2026-04-24',
        returnDate: null
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('lendings', null, {});
  }
};