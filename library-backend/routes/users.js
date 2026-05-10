const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const reservationController = require('../controllers/reservationController');
const { requireLogin } = require('../middleware/auth');

// METHOD: POST
// LOGIN API ENDPOINT
router.post('/login', userController.login);

// METHOD: POST
// LOGOUT API ENDPOINT
router.post('/logout', userController.logout);

// GET all users
router.get('/', requireLogin, userController.getAllUsers);

// GET single user
router.get('/:id', requireLogin, userController.getUserById);

/*
 * GET /api/users/:userId/reservations/active
 *
 * 指定利用者の有効な予約一覧を取得します。
 *
 * パスパラメータ:
 *   userId  - 利用者ID（例: /api/users/1/reservations/active）
 *
 * レスポンス:
 *   200 OK  - { count, reservations: [...] }
 *   400     - userId が空文字の場合
 *   500     - DB例外発生時
 */
router.get('/:userId/reservations/active', requireLogin, reservationController.getActiveReservations);

/*
 * POST /api/users/:userId/reservations
 *
 * 指定利用者が書籍を予約します。
 *
 * パスパラメータ:
 *   userId  - 利用者ID（例: /api/users/1/reservations）
 *
 * リクエストボディ:
 *   { "bookId": 2439 }
 *
 * レスポンス:
 *   200 OK  - { success, reservationId, message }
 *   400     - userId / bookId が空文字の場合
 *   500     - DB例外発生時
 */
router.post('/:userId/reservations', requireLogin, reservationController.reserveBook);

/*
 * POST /api/users/:userId/reservations/:reservationId/cancel
 *
 * 指定利用者の予約を取り消します。
 *
 * パスパラメータ:
 *   userId        - 利用者ID（例: /api/users/1/reservations/3/cancel）
 *   reservationId - 予約ID
 *
 * レスポンス:
 *   200 OK  - { success, message }
 *   400     - userId / reservationId が空文字の場合
 *   500     - DB例外発生時
 */
router.post('/:userId/reservations/:reservationId/cancel', requireLogin, reservationController.cancelReservation);

module.exports = router;