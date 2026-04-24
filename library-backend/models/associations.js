const Book = require('./Book');
const Reservation = require('./Reservation');
const Lending = require('./Lending');
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
// ===== Book ↔ Lending (1:N) =====
//
Book.hasMany(Lending, {
    foreignKey: 'bookId'
});

Lending.belongsTo(Book, {
    foreignKey: 'bookId'
});

//
// ===== User ↔ Lending (1:N) =====
//
User.hasMany(Lending, {
    foreignKey: 'userId'
});

Lending.belongsTo(User, {
    foreignKey: 'userId'
});