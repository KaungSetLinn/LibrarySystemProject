/*
 * -----------------------------------------------------------------------------
 * ファイル名 : library-Tbackend/scripts/initDatabase.js
 * 概要       : Tbackend 用 DB(libraryT.db) を初期化。
 *              全モデルを sync({force:true}) で再生成し、シードデータを投入。
 * 使用法     : npm run init-db
 * -----------------------------------------------------------------------------
 */
const sequelize = require('../db/connection');
const { User, Book, Reservation, Loan, Favorite, Notification, AuditLog } =
    require('../models/associations');

(async () => {
    try {
        console.log('🅃 [Tbackend] DB 初期化開始 (libraryT.db)');
        await sequelize.sync({ force: true });
        console.log('✅ テーブル再生成完了');

        // === シードデータ(MAIN backend と互換) ===
        await User.bulkCreate([
            { userId: 1, userName: '佐藤翔太' },
            { userId: 2, userName: '田中花子' },
            { userId: 3, userName: '鈴木一郎' }
        ]);
        console.log('✅ users: 3 件');

        await Book.bulkCreate([
            { bookId: 1, title: 'JavaScript 入門',  author: '山田太郎',  category: '技術書', canReserve: true,  isDisabled: false, arrivalDate: '2026-01-10' },
            { bookId: 2, title: 'Node.js 実践',     author: '佐々木次郎', category: '技術書', canReserve: true,  isDisabled: false, arrivalDate: '2026-02-05' },
            { bookId: 3, title: 'データベース設計', author: '高橋三郎',  category: '技術書', canReserve: true,  isDisabled: false, arrivalDate: '2026-02-20' },
            { bookId: 4, title: '人工知能の歴史',   author: '伊藤四郎',  category: '専門書', canReserve: true,  isDisabled: false, arrivalDate: '2026-03-01' },
            { bookId: 5, title: '機械学習基礎',     author: '渡辺五郎',  category: '専門書', canReserve: false, isDisabled: false, arrivalDate: '2026-03-15' },
            { bookId: 6, title: '近代日本史',       author: '中村六郎',  category: '歴史',   canReserve: true,  isDisabled: true,  arrivalDate: '2026-04-01' }
        ]);
        console.log('✅ books: 6 件');

        await Loan.bulkCreate([
            { userId: 2, bookId: 2, loanDate: '2026-05-01', dueDate: '2026-05-15', returnDate: null }
        ]);
        console.log('✅ loans: 1 件');

        await Reservation.bulkCreate([
            { userId: 1, bookId: 1, status: 'RESERVED', reservedAt: '2026-05-10T09:00:00.000Z', pickupDeadline: '2026-05-17', queueNo: 1 }
        ]);
        console.log('✅ reservations: 1 件');

        // === 追加機能のサンプルデータ ===
        await Favorite.bulkCreate([
            { userId: 1, bookId: 3, addedAt: '2026-05-11T10:00:00.000Z' }
        ]);
        console.log('✅ favorites: 1 件');

        await Notification.bulkCreate([
            { userId: 1, type: 'INFO', title: 'ようこそ', message: '豊田テストバックエンドへようこそ。', isRead: false }
        ]);
        console.log('✅ notifications: 1 件');

        await AuditLog.create({
            level: 'INFO', eventType: 'SYSTEM_INIT', userId: null,
            message: 'libraryT.db を初期化しました。'
        });
        console.log('✅ audit_logs: 1 件');

        console.log('\n🎉 [Tbackend] DB 初期化完了 (libraryT.db)');
        process.exit(0);
    } catch (e) {
        console.error('❌ 初期化エラー:', e);
        process.exit(1);
    }
})();
