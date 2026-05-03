'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('loans', [
    { userId: 1, bookId: 1242, loanDate: '2026-04-01', dueDate: '2026-04-15', returnDate: null },
    { userId: 2, bookId: 102, loanDate: '2026-04-05', dueDate: '2026-04-19', returnDate: null },
    { userId: 3, bookId: 104, loanDate: '2026-04-10', dueDate: '2026-04-24', returnDate: null },
    ], {});

    await queryInterface.bulkInsert('reservations', [
    { userId: 1, bookId: 1241, status: 'RESERVED', reservedAt: '2026-04-01 09:00:00', pickupDeadline: '2026-04-08', queueNo: 1, cancelledAt: null },
    { userId: 2, bookId: 25, status: 'RESERVED', reservedAt: '2026-04-02 10:30:00', pickupDeadline: '2026-04-09', queueNo: 1, cancelledAt: null },
    { userId: 8, bookId: 35, status: 'RESERVED', reservedAt: '2026-04-05 11:45:00', pickupDeadline: '2026-04-12', queueNo: 1, cancelledAt: null },
    { userId: 10, bookId: 45, status: 'RESERVED', reservedAt: '2026-04-07 14:00:00', pickupDeadline: '2026-04-14', queueNo: 1, cancelledAt: null },
    { userId: 12, bookId: 55, status: 'RESERVED', reservedAt: '2026-04-09 15:15:00', pickupDeadline: '2026-04-16', queueNo: 1, cancelledAt: null },
    { userId: 14, bookId: 65, status: 'RESERVED', reservedAt: '2026-04-11 08:30:00', pickupDeadline: '2026-04-18', queueNo: 1, cancelledAt: null },
    { userId: 16, bookId: 75, status: 'RESERVED', reservedAt: '2026-04-14 09:00:00', pickupDeadline: '2026-04-21', queueNo: 1, cancelledAt: null },
    { userId: 17, bookId: 80, status: 'RESERVED', reservedAt: '2026-04-16 10:00:00', pickupDeadline: '2026-04-23', queueNo: 1, cancelledAt: null },
    { userId: 18, bookId: 85, status: 'RESERVED', reservedAt: '2026-04-18 13:30:00', pickupDeadline: '2026-04-25', queueNo: 1, cancelledAt: null },
    { userId: 19, bookId: 90, status: 'RESERVED', reservedAt: '2026-04-20 16:00:00', pickupDeadline: '2026-04-27', queueNo: 1, cancelledAt: null },
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('reservations', null, {});
    await queryInterface.bulkDelete('loans', null, {});
  }
};