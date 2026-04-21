const Book = require('./Book');
const Reservation = require('./Reservation');
const Lending = require('./Lending');
const User = require('./User');

// Book ↔ Reservation (1:1)
Book.hasOne(Reservation, {
    foreignKey: 'book_id'
});

Reservation.belongsTo(Book, {
    foreignKey: 'book_id'
});

// User ↔ Reservation (1:N)
User.hasMany(Reservation, {
    foreignKey: 'user_id'
});

Reservation.belongsTo(User, {
    foreignKey: 'user_id'
});

//
// ===== Book ↔ Lending (1:N) =====
//
Book.hasMany(Lending, {
    foreignKey: 'book_id'
});

Lending.belongsTo(Book, {
    foreignKey: 'book_id'
});

//
// ===== User ↔ Lending (1:N) =====
//
User.hasMany(Lending, {
    foreignKey: 'user_id'
});

Lending.belongsTo(User, {
    foreignKey: 'user_id'
});