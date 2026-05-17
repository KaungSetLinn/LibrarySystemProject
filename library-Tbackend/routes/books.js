/*
 * READABLE-CODE REVIEW NOTE
 * 対象ファイル: library-Tbackend/routes/books.js
 * 責務: 豊田テスト backend のルーティング定義。URL と Controller の対応だけを担当する。
 * 保守メモ: 認証要否やパス接頭辞は frontend ApiAdapter と揃える。処理内容は Controller に閉じ込める。
 */
const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookController');

/* GET /api/books/search
      ?title=<部分一致>
      &author=<部分一致>
      &category=<完全一致>
      &sort=bookId
      &page=0 */
router.get('/search', controller.searchBooks);

// GET /api/*/books/categories - 詳細検索の分類プルダウン用
router.get('/categories', controller.getCategories);

router.get('/:bookId', controller.getBookById);

module.exports = router;