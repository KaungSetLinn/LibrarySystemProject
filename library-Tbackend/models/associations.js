/*
 * READABLE-CODE REVIEW NOTE
 * 対象ファイル: library-Tbackend/models/associations.js
 * 責務: Sequelize モデル定義。DB列名、型、制約を JS オブジェクトとして表現する。
 * 保守メモ: Controller の業務判断をモデルへ混ぜず、テーブル構造の SSOT として保つ。
 */
/*
 * -----------------------------------------------------------------------------
 * ファイル名 : library-Tbackend/models/associations.js
 * 概要       : モデル間関連の定義。MAIN backend と互換 + Favorite/Notification 追加。
 * -----------------------------------------------------------------------------
 */
const User = require('./User');
const Book = require('./Book');
const Reservation = require('./Reservation');
const Loan = require('./Loan');
const Favorite = require('./Favorite');
const Notification = require('./Notification');
const AuditLog = require('./AuditLog');

// 既存(MAIN 互換)
Reservation.belongsTo(Book, { foreignKey: 'bookId', targetKey: 'bookId' });
Book.hasMany(Reservation, { foreignKey: 'bookId', sourceKey: 'bookId' });
Reservation.belongsTo(User, { foreignKey: 'userId', targetKey: 'userId' });
User.hasMany(Reservation, { foreignKey: 'userId', sourceKey: 'userId' });

Loan.belongsTo(Book, { foreignKey: 'bookId', targetKey: 'bookId' });
Loan.belongsTo(User, { foreignKey: 'userId', targetKey: 'userId' });

// 追加機能
Favorite.belongsTo(User, { foreignKey: 'userId', targetKey: 'userId' });
Favorite.belongsTo(Book, { foreignKey: 'bookId', targetKey: 'bookId' });
User.hasMany(Favorite, { foreignKey: 'userId', sourceKey: 'userId' });

Notification.belongsTo(User, { foreignKey: 'userId', targetKey: 'userId' });
User.hasMany(Notification, { foreignKey: 'userId', sourceKey: 'userId' });

AuditLog.belongsTo(User, { foreignKey: 'userId', targetKey: 'userId' });

module.exports = { User, Book, Reservation, Loan, Favorite, Notification, AuditLog };
