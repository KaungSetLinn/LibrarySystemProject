const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { requireLogin } = require('../middleware/auth');

/*
 * POST /api/v1/reservations  (API-05)
 *
 * ログイン中の利用者が書籍を予約します。
 * userId はリクエストボディではなくセッションから取得します（なりすまし防止）。
 *
 * リクエストボディ:
 *   { "bookId": 2439 }
 *
 * レスポンス:
 *   201 Created - { result, messageCode: "I02", message: "予約しました。",
 *                   data: { reservationId, bookId, userId, reservedAt } }
 *   400         - bookId 不正（E01）
 *   401         - セッション切れ（W02）
 *   404         - 書籍不在（W17）
 *   409         - 予約上限超過 / 重複予約 / 予約不可状態（W05 / W06 / W07）
 *   500         - DB例外発生時（E10）
 */
router.post('/', requireLogin, reservationController.reserveBook);

module.exports = router;