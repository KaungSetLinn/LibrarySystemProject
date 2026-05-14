const sequelize = require('../db/connection');
const Book      = require('../models/Book');
const Favorite  = require('../models/Favorite');
const Audit     = require('../models/Audit');
const { _writeAuditLog } = require('../helpers/auditHelper');

// =============================================================
// 補助関数: owner チェック（W03）
// :userId ≠ session.userId のとき 403 を返し false を返す。
// =============================================================
function _checkOwner(req, res, userIdNum) {
    const sessionUserId = req.session?.user?.userId;
    if (!sessionUserId || sessionUserId !== userIdNum) {
        res.status(403).json({
            result:      'error',
            messageCode: 'W03',
            message:     '他者のリソースにはアクセスできません。',
            data:        null,
        });
        return false;
    }
    return true;
}

// =============================================================
// API-11  GET /api/v1/users/:userId/favorites
//
// お気に入り一覧をページング付きで返す（§8.4.11）。
// Query: page（既定 0）、pageSize（既定 20、最大 50）
// =============================================================
exports.listFavorites = async (req, res) => {
    // --------------------------------------------------
    // 1. userId バリデーション & 本人確認
    // --------------------------------------------------
    const userIdNum = parseInt(req.params.userId, 10);
    if (!Number.isInteger(userIdNum) || userIdNum <= 0) {
        return res.status(400).json({
            result:      'error',
            messageCode: 'E01',
            message:     '入力に誤りがあります。',
            data:        null,
        });
    }
    if (!_checkOwner(req, res, userIdNum)) return;

    // --------------------------------------------------
    // 2. ページネーション パラメータ
    // --------------------------------------------------
    let page     = parseInt(req.query.page,     10);
    let pageSize = parseInt(req.query.pageSize, 10);
    if (isNaN(page)      || page < 0)    page     = 0;
    if (isNaN(pageSize)  || pageSize < 1) pageSize = 20;
    if (pageSize > 50)                    pageSize = 50;

    const offset = page * pageSize;

    try {
        // --------------------------------------------------
        // 3. Favorite を books と JOIN してページング取得
        // --------------------------------------------------
        const { count, rows } = await Favorite.findAndCountAll({
            where: { userId: userIdNum },
            include: [
                {
                    model:      Book,
                    attributes: ['title', 'author', 'category'],
                    required:   true,   // INNER JOIN — 書籍が存在する行のみ
                },
            ],
            order:  [['addedAt', 'DESC']],
            limit:  pageSize,
            offset,
        });

        const totalPages = count === 0 ? 0 : Math.ceil(count / pageSize);

        const favorites = rows.map(f => ({
            favoriteId: f.favoriteId,
            bookId:     f.bookId,
            title:      f.Book?.title    ?? null,
            author:     f.Book?.author   ?? null,
            category:   f.Book?.category ?? null,
            addedAt:    f.addedAt,
        }));

        return res.status(200).json({
            result:      'success',
            messageCode: 'I00',
            message:     'OK',
            data: {
                count,
                page,
                pageSize,
                totalPages,
                favorites,
            },
        });

    } catch (err) {
        await _writeAuditLog({
            level:     'ERROR',
            eventType: 'FAVORITE_LIST_ERROR',
            userId:    userIdNum,
            message:   err.message,
        });
        return res.status(500).json({
            result:      'error',
            messageCode: 'E10',
            message:     'システムエラーが発生しました。',
            data:        null,
        });
    }
};

// =============================================================
// API-12  POST /api/v1/users/:userId/favorites
//
// お気に入りに書籍を追加する（§8.4.12）。
// Body: { bookId: <integer> }
// CSRF トークン必須（middleware で検証済み想定）
// =============================================================
exports.addFavorite = async (req, res) => {
    // --------------------------------------------------
    // 1. userId バリデーション & 本人確認
    // --------------------------------------------------
    const userIdNum = parseInt(req.params.userId, 10);
    if (!Number.isInteger(userIdNum) || userIdNum <= 0) {
        return res.status(400).json({
            result:      'error',
            messageCode: 'E01',
            message:     '入力に誤りがあります。',
            data:        null,
        });
    }
    if (!_checkOwner(req, res, userIdNum)) return;

    // --------------------------------------------------
    // 2. bookId バリデーション（§6.2: 正の整数のみ → 400 E01）
    // --------------------------------------------------
    const bookIdNum = parseInt(req.body?.bookId, 10);
    if (!Number.isInteger(bookIdNum) || bookIdNum <= 0) {
        return res.status(400).json({
            result:      'error',
            messageCode: 'E01',
            message:     '入力に誤りがあります。',
            data:        null,
        });
    }

    const transaction = await sequelize.transaction();
    try {
        // --------------------------------------------------
        // 3. 書籍存在チェック（W17）
        // --------------------------------------------------
        const book = await Book.findOne({
            where: { bookId: bookIdNum },
            transaction,
        });
        if (!book) {
            await transaction.rollback();
            return res.status(404).json({
                result:      'error',
                messageCode: 'W17',
                message:     '対象が見つかりません。',
                data:        null,
            });
        }

        // --------------------------------------------------
        // 4. 重複チェック（W19: UNIQUE userId × bookId）
        //    DB の UNIQUE 制約に委ねず、先にアプリ側でチェックして
        //    W19 を確実に返す（reservationController の重複チェックと同パターン）
        // --------------------------------------------------
        const existing = await Favorite.findOne({
            where: { userId: userIdNum, bookId: bookIdNum },
            transaction,
        });
        if (existing) {
            await transaction.rollback();
            return res.status(409).json({
                result:      'error',
                messageCode: 'W19',
                message:     '既にお気に入りに登録されています。',
                data:        null,
            });
        }

        // --------------------------------------------------
        // 5. お気に入り登録
        // --------------------------------------------------
        const created = await Favorite.create({
            userId:  userIdNum,
            bookId:  bookIdNum,
            addedAt: new Date(),
        }, { transaction });

        // --------------------------------------------------
        // 6. 監査ログ（トランザクション内で commit 前に作成）
        // --------------------------------------------------
        await Audit.create({
            level:     'INFO',
            eventType: 'ADD_FAVORITE',
            userId:    userIdNum,
            message:   `bookId=${bookIdNum} をお気に入りに追加 (favoriteId=${created.favoriteId})`,
        }, { transaction });

        await transaction.commit();

        return res.status(201).json({
            result:      'success',
            messageCode: 'I05',
            message:     'お気に入りに追加しました。',
            data: {
                favoriteId: created.favoriteId,
                bookId:     bookIdNum,
                addedAt:    created.addedAt,
            },
        });

    } catch (err) {
        try { await transaction.rollback(); } catch (_) { }

        await _writeAuditLog({
            level:     'ERROR',
            eventType: 'ADD_FAVORITE_ERROR',
            userId:    userIdNum,
            message:   err.message,
        });
        return res.status(500).json({
            result:      'error',
            messageCode: 'E10',
            message:     'システムエラーが発生しました。',
            data:        null,
        });
    }
};

// =============================================================
// API-13  DELETE /api/v1/users/:userId/favorites/:favoriteId
//
// お気に入りから書籍を削除する（§8.4.13）。
// CSRF トークン必須（middleware で検証済み想定）
// =============================================================
exports.removeFavorite = async (req, res) => {
    // --------------------------------------------------
    // 1. userId / favoriteId バリデーション & 本人確認
    // --------------------------------------------------
    const userIdNum     = parseInt(req.params.userId,     10);
    const favoriteIdNum = parseInt(req.params.favoriteId, 10);

    if (!Number.isInteger(userIdNum) || userIdNum <= 0) {
        return res.status(400).json({
            result:      'error',
            messageCode: 'E01',
            message:     '入力に誤りがあります。',
            data:        null,
        });
    }
    if (!Number.isInteger(favoriteIdNum) || favoriteIdNum <= 0) {
        return res.status(400).json({
            result:      'error',
            messageCode: 'E01',
            message:     '入力に誤りがあります。',
            data:        null,
        });
    }
    if (!_checkOwner(req, res, userIdNum)) return;

    const transaction = await sequelize.transaction();
    try {
        // --------------------------------------------------
        // 2. レコード存在チェック & 本人所有チェック（W17）
        //    userId を条件に含めることで他者の favoriteId 操作を防ぐ
        //    （cancelReservation の where: { reservationId, userId } と同パターン）
        // --------------------------------------------------
        const favorite = await Favorite.findOne({
            where: { favoriteId: favoriteIdNum, userId: userIdNum },
            transaction,
        });
        if (!favorite) {
            await transaction.rollback();
            return res.status(404).json({
                result:      'error',
                messageCode: 'W17',
                message:     '対象が見つかりません。',
                data:        null,
            });
        }

        // --------------------------------------------------
        // 3. 削除
        // --------------------------------------------------
        await favorite.destroy({ transaction });

        // --------------------------------------------------
        // 4. 監査ログ（トランザクション内で commit 前に作成）
        // --------------------------------------------------
        await Audit.create({
            level:     'INFO',
            eventType: 'REMOVE_FAVORITE',
            userId:    userIdNum,
            message:   `favoriteId=${favoriteIdNum} をお気に入りから削除 (bookId=${favorite.bookId})`,
        }, { transaction });

        await transaction.commit();

        return res.status(200).json({
            result:      'success',
            messageCode: 'I06',
            message:     'お気に入りから削除しました。',
            data:        null,
        });

    } catch (err) {
        try { await transaction.rollback(); } catch (_) { }

        await _writeAuditLog({
            level:     'ERROR',
            eventType: 'REMOVE_FAVORITE_ERROR',
            userId:    userIdNum,
            message:   err.message,
        });
        return res.status(500).json({
            result:      'error',
            messageCode: 'E10',
            message:     'システムエラーが発生しました。',
            data:        null,
        });
    }
};