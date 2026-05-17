/*
 * READABLE-CODE REVIEW NOTE
 * 対象ファイル: library-Tbackend/routes/reservations.js
 * 責務: 豊田テスト backend の予約登録ルーティング。URL と Controller の対応だけを担当する。
 */
const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { requireLogin } = require('../middleware/auth');

router.post('/', requireLogin, reservationController.reserveBook);

module.exports = router;
