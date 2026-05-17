const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

/*
 * GET /api/v1/books/search  (API-04)
 *
 * 書籍を複合条件で検索します。ページング込み。
 *
 * クエリパラメータ:
 *   title          - タイトル（部分一致）
 *   author         - 著者名（部分一致）
 *   category       - カテゴリ（完全一致）
 *   sort           - title / author / arrivalDateDesc / bookId（既定: bookId）
 *   onlyAvailable  - 在庫ありのみ絞込（既定: false）
 *   onlyReservable - 予約可能のみ絞込（既定: false）
 *   page           - 0始まりのページ番号（既定: 0）
 *   pageSize       - 1ページの件数（既定: 10、最大: 50）
 *
 * レスポンス:
 *   200 OK  - { result, messageCode, message, data: {
 *               count, page, pageSize, totalPages, books } }
 *   400     - title/author/category 全空（W04）
 *   401     - セッション切れ（W02）
 *   500     - DB例外発生時（E10）
 */
router.get('/search', bookController.searchBooks);


/*
 * GET /api/v1/books/categories  (API-04c)
 *
 * books.category の実値から分類一覧を返します。
 * G03 詳細検索画面の分類プルダウン生成用。
 *
 * レスポンス:
 *   200 OK  - { result, messageCode, message, data: { categories: string[] } }
 *   500     - DB例外発生時（E10）
 */
router.get('/categories', bookController.getCategories);

/*
 * GET /api/v1/books/:bookId  (API-04b)
 *
 * 指定IDの書籍を1件取得します。
 *
 * パスパラメータ:
 *   bookId - 書籍ID（INTEGER、正の整数）
 *
 * レスポンス:
 *   200 OK  - { result, messageCode, message, data: {
 *               bookId, title, author, category, arrivalDate,
 *               status, actionState, actionLabel, dueDate } }
 *   401     - セッション切れ（W02）
 *   404     - 書籍不在（W17）
 *   500     - DB例外発生時（E10）
 */
router.get('/:bookId', bookController.getBookById);

module.exports = router;