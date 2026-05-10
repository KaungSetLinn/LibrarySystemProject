const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const reservationController = require('../controllers/reservationController');
const mypageController = require('../controllers/mypageController');
const dashboardController = require('../controllers/dashboardController');
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
 * DELETE /api/users/:userId/reservations/:reservationId
 *
 * 指定利用者の予約を取り消します。
 *
 * パスパラメータ:
 *   userId        - 利用者ID（例: /api/users/1/reservations/3）
 *   reservationId - 予約ID
 *
 * レスポンス:
 *   200 OK  - { success, message }
 *   400     - userId / reservationId が空文字の場合
 *   500     - DB例外発生時
 */
router.delete('/:userId/reservations/:reservationId', requireLogin, reservationController.cancelReservation);

/*
 * GET /api/users/:userId/dashboard
 *
 * 指定利用者のダッシュボード集約データを取得します。（G02 対応）
 *
 * パスパラメータ:
 *   userId  - 利用者ID（例: /api/users/1/dashboard）
 *
 * レスポンス:
 *   200 OK  - { result, messageCode, message, data: {
 *               reservations, reservationCount,
 *               remainingQuota, unreadCount, notifications } }
 *   401     - セッション切れ（requireLogin ミドルウェアが処理、E09）
 *   403     - 他利用者の userId へのアクセス（E02）
 *   500     - DB例外発生時（E10）
 */
router.get('/:userId/dashboard', requireLogin, dashboardController.getDashboard);

/*
 * GET /api/users/:userId/mypage
 *
 * 指定利用者のマイページ集約データを取得します。
 *
 * パスパラメータ:
 *   userId  - 利用者ID（例: /api/users/1/mypage）
 *
 * レスポンス:
 *   200 OK  - { currentReservations, history, favorites, notifications }
 *   403     - 他利用者のデータへのアクセス（E02）
 *   500     - DB例外発生時（E10）
 */
router.get('/:userId/mypage', requireLogin, mypageController.getMyPage);

module.exports = router;