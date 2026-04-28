const { Op } = require('sequelize');
const Book = require('../models/Book');
const Reservation = require('../models/Reservation');
const Loan = require('../models/Loan');

// =============================================================
// 補助関数: actionState 判定（仕様書 6-4-8 の優先度テーブルに準拠）
// 優先度: DISABLED → ON_LOAN → RESERVED → AVAILABLE
// フロントエンドでは呼び出さない。バックエンド専用。
// =============================================================
function _determineBookActionState(book, loanMap, reservationMap, currentUserId) {
    // 優先度1: 書籍が無効または予約不可
    if (book.isDisabled || !book.canReserve) {
        return { actionState: 'DISABLED', actionLabel: '不可', dueDate: null };
    }

    // 優先度2: 貸出中
    const loan = loanMap.get(book.bookId);
    if (loan) {
        return { actionState: 'ON_LOAN', actionLabel: '予約する（貸出中）', dueDate: loan.dueDate ?? null };
    }

    // 優先度3: 予約中（自分 / 他利用者を区別）
    const reservedByUserId = reservationMap.get(book.bookId);
    if (reservedByUserId !== undefined) {
        const isMine = String(reservedByUserId) === String(currentUserId);
        return {
            actionState: 'RESERVED',
            actionLabel: isMine ? '予約済（自分）' : '予約済（他利用者）',
            dueDate: null,
        };
    }

    // 優先度4: 予約可能
    return { actionState: 'AVAILABLE', actionLabel: '予約する', dueDate: null };
}

// =============================================================
// searchBooks
// GET /api/books/search
//   ?title=<部分一致>
//   &author=<部分一致>
//   &category=<完全一致>
//   &sort=title|author|arrivalDateDesc|bookId(default)
//   &page=0
//
// ※ availableOnly / reservableOnly はフロントエンド側で
//    レスポンスの actionState を使ってフィルタリングする。
// =============================================================
exports.searchBooks = async (req, res) => {
    try {
        // =========================
        // 1. クエリパラメータ取得
        // =========================
        const {
            title,
            author,
            category,
            sort = 'bookId',
            page = 0,
        } = req.query;

        // =========================
        // 1-a. 全空検索バリデーション（仕様書 E04）
        //      title / author / category がすべて空の場合はエラー
        // =========================
        const hasTitle    = title    && title.trim()    !== '';
        const hasAuthor   = author   && author.trim()   !== '';
        const hasCategory = category && category.trim() !== '';

        if (!hasTitle && !hasAuthor && !hasCategory) {
            return res.status(400).json({
                result: 'error',
                messageCode: 'E04',
                message: '検索条件を 1 つ以上入力してください。',
                count: 0,
                page: Number(page),
                pageSize: 10,
                totalPages: 1,
                books: [],
            });
        }

        const pageSize = 10;
        const offset = Number(page) * pageSize;

        // =========================
        // 1-b. ログイン中ユーザーID取得
        // =========================
        const currentUserId = req.session?.user?.userId ?? null;

        // =========================
        // 2. WHERE 句を動的に組み立て（仕様書 6-4-5）
        //    title / author は部分一致、category は完全一致
        // =========================
        const conditions = [];

        if (hasTitle) {
            conditions.push({ title: { [Op.like]: `%${title.trim()}%` } });
        }

        if (hasAuthor) {
            conditions.push({ author: { [Op.like]: `%${author.trim()}%` } });
        }

        if (hasCategory) {
            conditions.push({ category: category.trim() });
        }

        const whereCondition = conditions.length > 0 ? { [Op.and]: conditions } : {};

        // =========================
        // 3. ソート順の決定（仕様書 6-4-5）
        // =========================
        const ORDER_MAP = {
            title: [['title', 'ASC']],
            author: [['author', 'ASC']],
            arrivalDateDesc: [['arrivalDate', 'DESC']],
        };
        const order = ORDER_MAP[sort] ?? [['bookId', 'ASC']];

        // =========================
        // 4. 書籍一覧を取得（ページ単位）
        // =========================
        const result = await Book.findAndCountAll({
            distinct: true,
            where: whereCondition,
            limit: pageSize,
            offset,
            order,
        });

        // =========================
        // 5. 状態判定用データを一括取得（仕様書 6-4-5 付随SQL）
        //    現在ページの bookId に絞ることで不要なデータを取得しない
        // =========================
        const bookIds = result.rows.map(b => b.bookId);

        const [activeLoans, activeReservations] = await Promise.all([
            Loan.findAll({
                where: { bookId: { [Op.in]: bookIds }, returnDate: null },
                attributes: ['bookId', 'dueDate'],
            }),
            Reservation.findAll({
                where: { bookId: { [Op.in]: bookIds }, status: { [Op.ne]: 'CANCELLED' } },
                attributes: ['bookId', 'userId'],  // userId を追加取得
            }),
        ]);

        // O(1) 参照のため Map に変換
        // reservationMap: bookId → userId（予約者ID）
        const loanMap        = new Map(activeLoans.map(l => [l.bookId, l]));
        const reservationMap = new Map(activeReservations.map(r => [Number(r.bookId), r.userId]));

        // =========================
        // 6. 結果整形 + actionState 付与（仕様書 6-4-6）
        //    availableOnly / reservableOnly はフロントエンド側で処理する
        // =========================
        const STATUS_LABEL_MAP = {
            AVAILABLE: '在庫あり',
            RESERVED: '予約中',
            ON_LOAN: '貸出中',
            DISABLED: '利用不可',   // ④ 仕様書に合わせて修正
        };

        const books = result.rows.map(book => {
            const { actionState, actionLabel, dueDate } =
                _determineBookActionState(book, loanMap, reservationMap, currentUserId);

            return {
                bookId: String(book.bookId),   // ① DB は TEXT 型 → 文字列で統一
                title: book.title,
                author: book.author,
                category: book.category,
                arrivalDate: book.arrivalDate,
                status: STATUS_LABEL_MAP[actionState] ?? '不明',
                actionState,
                actionLabel,
                dueDate,
            };
        });

        // =========================
        // 7. レスポンス返却
        // =========================
        const totalPages = Math.ceil(result.count / pageSize);

        return res.json({
            result: 'success',
            count: result.count,
            page: Number(page),
            pageSize,
            totalPages,
            books,
        });

    } catch (err) {
        // DB例外（仕様書 6-4-7）
        return res.status(500).json({ result: 'error', error: err.message });
    }
};