/*
 * -----------------------------------------------------------------------------
 * ファイル名 : library-Tbackend/controllers/favoriteController.js
 * 概要       : お気に入り CRUD コントローラ(豊田 v3.0.6 由来、Tbackend 追加)。
 *              W19 重複検出対応、Book と JOIN してタイトル・著者を付与。
 * 作成者     : Y.Toyoda
 * 作成日     : 2026-05-12
 * -----------------------------------------------------------------------------
 */
const Favorite = require('../models/Favorite');
const Book = require('../models/Book');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');

async function _audit(level, eventType, userId, message) {
    try { await AuditLog.create({ level, eventType, userId, message }); }
    catch (e) { /* 監査失敗はメイン処理を止めない */ }
}

/**
 * GET /api/users/:userId/favorites
 * 指定利用者のお気に入り一覧を取得。Book と JOIN して表示用情報を付与。
 */
exports.listFavorites = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) return res.status(400).json({ error: 'userId は必須です。' });

        const favs = await Favorite.findAll({
            where: { userId },
            include: [{ model: Book, required: false, attributes: ['title', 'author', 'category'] }],
            order: [['addedAt', 'DESC']]
        });

        const data = favs.map(f => ({
            favoriteId: f.favoriteId,
            userId:     f.userId,
            bookId:     f.bookId,
            bookTitle:  f.Book?.title    || '---',
            bookAuthor: f.Book?.author   || '---',
            bookCategory: f.Book?.category || '---',
            addedAt:    f.addedAt
        }));
        return res.json({ count: data.length, favorites: data });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

/**
 * POST /api/users/:userId/favorites  body: { bookId }
 * お気に入り登録。W19 重複検出を行う。
 */
exports.addFavorite = async (req, res) => {
    try {
        const { userId } = req.params;
        const { bookId } = req.body;
        if (!userId || !bookId) {
            return res.status(400).json({ result: 'error', message: 'userId と bookId は必須です。' });
        }

        // 書籍存在チェック
        const book = await Book.findByPk(bookId);
        if (!book) {
            return res.status(404).json({ result: 'error', message: '対象書籍が見つかりません。' });
        }

        // W19 重複検出
        const dup = await Favorite.findOne({ where: { userId, bookId } });
        if (dup) {
            await _audit('WARN', 'FAVORITE_DUPLICATE', userId, `bookId=${bookId}`);
            return res.status(409).json({
                result: 'error', code: 'W19',
                message: 'すでにお気に入り登録済みです。'
            });
        }

        const fav = await Favorite.create({ userId, bookId });
        await _audit('INFO', 'FAVORITE_ADD', userId, `bookId=${bookId} favoriteId=${fav.favoriteId}`);

        // 連動して通知を生成
        await Notification.create({
            userId, type: 'SUCCESS',
            title: 'お気に入り登録',
            message: `『${book.title}』をお気に入りに追加しました。`
        });

        return res.status(201).json({
            result: 'success',
            favoriteId: fav.favoriteId,
            message: 'お気に入りに追加しました。'
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

/**
 * DELETE /api/users/:userId/favorites/:favoriteId
 * お気に入り削除。本人確認あり。
 */
exports.removeFavorite = async (req, res) => {
    try {
        const { userId, favoriteId } = req.params;
        const fav = await Favorite.findOne({ where: { favoriteId, userId } });
        if (!fav) {
            return res.status(404).json({ result: 'error', message: '対象が見つかりません。' });
        }
        await fav.destroy();
        await _audit('INFO', 'FAVORITE_REMOVE', userId, `favoriteId=${favoriteId}`);
        return res.json({ result: 'success', message: 'お気に入りから削除しました。' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
