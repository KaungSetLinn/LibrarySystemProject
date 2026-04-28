const Book = require('./Book');
const Reservation = require('./Reservation');
const Loan = require('./Loan');
const User = require('./User');

// Book ↔ Reservation (1:1)
Book.hasOne(Reservation, {
    foreignKey: 'bookId'
});

Reservation.belongsTo(Book, {
    foreignKey: 'bookId'
});

// User ↔ Reservation (1:N)
User.hasMany(Reservation, {
    foreignKey: 'userId'
});

Reservation.belongsTo(User, {
    foreignKey: 'userId'
});

//
// ===== Book ↔ Loan (1:N) =====
//
Book.hasMany(Loan, {
    foreignKey: 'bookId'
});

Loan.belongsTo(Book, {
    foreignKey: 'bookId'
});

//
// ===== User ↔ Loan (1:N) =====
//
User.hasMany(Loan, {
    foreignKey: 'userId'
});

Loan.belongsTo(User, {
    foreignKey: 'userId'
});