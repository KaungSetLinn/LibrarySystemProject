const { Op } = require('sequelize');
const User = require('../models/User');
const Book = require('../models/Book');
const Reservation = require('../models/Reservation');
const Lending = require('../models/Lending');

exports.searchBooks = async (req, res) => {
    try {
        // =========================
        // 1. クエリパラメータ
        // =========================
        const {
            title,
            author,
            category,
            sort = 'bookId',
            page = 0
        } = req.query;

        const pageSize = 10;
        const offset = page * pageSize;

        // =========================
        // 2. 条件正規化
        // =========================

        const conditions = [];

        if (title && title.trim() !== "") {
            conditions.push({
                book_name: { [Op.like]: `%${title.trim()}%` }
            });
        }

        if (author && author.trim() !== "") {
            conditions.push({
                author: { [Op.like]: `%${author.trim()}%` }
            });
        }

        if (category && category.trim() !== "") {
            conditions.push({
                category: { [Op.like]: `%${category.trim()}%` }
            });
        }

        // =========================
        // 2. AND検索
        // =========================

        const whereCondition = {
            can_reserve: true,
            is_disabled: false,
            ...(conditions.length > 0 && { [Op.and]: conditions })
        };

        // =========================
        // 3. 件数取得 + データ取得
        // =========================

        const result = await Book.findAndCountAll({
            distinct: true,
            where: whereCondition,
            limit: pageSize,
            offset,
            order: [['book_id', 'ASC']],
            include: [
                {
                    model: Reservation,
                    required: false
                },
                {
                    model: Lending,
                    required: false,
                    where: {
                        return_date: { [Op.is]: null }
                    }
                }
            ]
        });

        // =========================
        // 4. 結果整形 + 状態表示
        // =========================

        const books = result.rows.map(book => {
            let status = "予約可能";
            let dueDate = null;

            const hasLending =
                book.Lendings && book.Lendings.length > 0;

            if (hasLending) {
                status = "貸出中";
                dueDate = book.Lendings[0].due_date;
            }
            else if (book.Reservation) {
                status = "予約中";
            }

            return {
                bookId: book.book_id,
                title: book.book_name,
                author: book.author,
                category: book.category,
                status,
                dueDate
            };
        });

        // =========================
        // 5. 0件 / ヒット件数表示
        // =========================
        const totalPages = Math.ceil(result.count / pageSize);

        res.json({
            count: result.count,
            page: Number(page),
            pageSize,
            totalPages,
            books
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};