'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('lending', [
      {
        user_id: 1,
        book_id: 100,
        lending_date: '2026-04-01',
        due_date: '2026-04-15',
        return_date: null
      },
      {
        user_id: 2,
        book_id: 102,
        lending_date: '2026-04-05',
        due_date: '2026-04-19',
        return_date: null
      },
      {
        user_id: 3,
        book_id: 104,
        lending_date: '2026-04-10',
        due_date: '2026-04-24',
        return_date: null
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('lending', null, {});
  }
};