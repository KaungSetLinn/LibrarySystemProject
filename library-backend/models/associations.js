const Book = require('./Book');
const Reservation = require('./Reservation');
const Loan = require('./Loan');
const User = require('./User');
const History = require('./History');
const Notification = require('./Notification');
const Audit = require('./Audit');

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

// ===== User ↔ History (1:N) =====
User.hasMany(History, {
    foreignKey: 'userId'
});
 
History.belongsTo(User, {
    foreignKey: 'userId'
});
 
// ===== Book ↔ History (1:N) =====
Book.hasMany(History, {
    foreignKey: 'bookId'
});
 
History.belongsTo(Book, {
    foreignKey: 'bookId'
});
 
// ===== User ↔ Notification (1:N) =====
User.hasMany(Notification, {
    foreignKey: 'userId'
});
 
Notification.belongsTo(User, {
    foreignKey: 'userId'
});
 
// ===== User ↔ Audit (1:N) =====
User.hasMany(Audit, {
    foreignKey: 'userId'
});
 
Audit.belongsTo(User, {
    foreignKey: 'userId'
});