const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const reservationController = require('../controllers/reservationController');
const mypageController = require('../controllers/mypageController');
const dashboardController = require('../controllers/dashboardController');
const favoriteController = require('../controllers/favoriteController');
// const notificationController = require('../controllers/notificationController');
const { requireLogin } = require('../middleware/auth');

// GET all users
router.get('/', requireLogin, userController.getAllUsers);

// GET single user
router.get('/:id', requireLogin, userController.getUserById);

/*
 * GET /api/v1/users/:userId/dashboard  (API-03)
 *
 * 指定利用者のダッシュボード集約データを取得します。（G02 対応）
 *
 * パスパラメータ:
 *   userId  - 利用者ID（例: /api/v1/users/1/dashboard）
 *
 * レスポンス:
 *   200 OK  - { result, messageCode, message, data: {
 *               reservations, reservationCount,
 *               remainingQuota, unreadCount, notifications } }
 *   401     - セッション切れ（requireLogin ミドルウェアが処理、W02）
 *   403     - 他利用者の userId へのアクセス（W03）
 *   500     - DB例外発生時（E10）
 */
router.get('/:userId/dashboard', requireLogin, dashboardController.getDashboard);

/*
 * GET /api/v1/users/:userId/notifications  (API-03b)
 *
 * 指定利用者の通知一覧をページング付きで取得します。
 *
 * パスパラメータ:
 *   userId  - 利用者ID（例: /api/v1/users/1/notifications）
 *
 * クエリパラメータ:
 *   page     - ページ番号（既定 0）
 *   pageSize - 1ページの件数（既定 20、最大 100）
 *
 * レスポンス:
 *   200 OK  - { result, messageCode, message, data: { count, page, pageSize, totalPages, notifications } }
 *   401     - セッション切れ（W02）
 *   403     - 他利用者の userId へのアクセス（W03）
 *   500     - DB例外発生時（E10）
 */
// router.get('/:userId/notifications', requireLogin, notificationController.getNotifications);

/*
 * POST /api/v1/users/:userId/notifications/:notificationId/read  (API-14)
 *
 * 指定通知を既読状態に変更します。
 *
 * パスパラメータ:
 *   userId         - 利用者ID
 *   notificationId - 通知ID
 *
 * レスポンス:
 *   200 OK  - { result, messageCode: "I04", message, data: { notificationId, isRead, readAt } }
 *   401     - セッション切れ（W02）
 *   403     - 他利用者の userId へのアクセス（W03）
 *   404     - notificationId 不在・本人外（W17）
 *   500     - DB例外発生時（E10）
 */
// router.post('/:userId/notifications/:notificationId/read', requireLogin, notificationController.markRead);

/*
 * GET /api/v1/users/:userId/reservations/active
 *
 * 指定利用者の有効な予約一覧を取得します。
 *
 * パスパラメータ:
 *   userId  - 利用者ID（例: /api/v1/users/1/reservations/active）
 *
 * レスポンス:
 *   200 OK  - { count, reservations: [...] }
 *   400     - userId が空文字の場合
 *   500     - DB例外発生時
 */
router.get('/:userId/reservations/active', requireLogin, reservationController.getActiveReservations);

/*
 * DELETE /api/v1/users/:userId/reservations/:reservationId  (API-06)
 *
 * 指定利用者の予約を取り消します。（本人のみ）
 *
 * パスパラメータ:
 *   userId        - 利用者ID（例: /api/v1/users/1/reservations/7）
 *   reservationId - 予約ID
 *
 * レスポンス:
 *   200 OK  - { result, messageCode: "I03", message, data: null }
 *   401     - 認証失敗（W02）
 *   403     - 本人以外からのアクセス（W03）
 *   404     - reservationId 不在（W17）
 *   500     - DB例外発生時（E10）
 */
router.delete('/:userId/reservations/:reservationId', requireLogin, reservationController.cancelReservation);

/*
 * GET /api/v1/users/:userId/mypage  (API-07)
 *
 * 指定利用者のマイページ集約データを取得します。
 *
 * パスパラメータ:
 *   userId  - 利用者ID（例: /api/v1/users/1/mypage）
 *
 * レスポンス:
 *   200 OK  - { result, messageCode, message, data: {
 *               currentReservations, history, favorites, notifications } }
 *   403     - 他利用者のデータへのアクセス（W03）
 *   500     - DB例外発生時（E10）
 */
router.get('/:userId/mypage', requireLogin, mypageController.getMyPage);

/*
 * GET /api/v1/users/:userId/favorites  (API-11)
 *
 * 指定利用者のお気に入り一覧をページング付きで取得します。
 *
 * パスパラメータ:
 *   userId  - 利用者ID（例: /api/v1/users/1/favorites）
 *
 * クエリパラメータ:
 *   page     - ページ番号（既定 0）
 *   pageSize - 1ページの件数（既定 20、最大 50）
 *
 * レスポンス:
 *   200 OK  - { result, messageCode, message, data: { count, page, pageSize, totalPages, favorites } }
 *   401     - セッション切れ（W02）
 *   403     - 他利用者の userId へのアクセス（W03）
 *   500     - DB例外発生時（E10）
 */
router.get('/:userId/favorites', requireLogin, favoriteController.listFavorites);

/*
 * POST /api/v1/users/:userId/favorites  (API-12)
 *
 * お気に入りに書籍を追加します。
 *
 * パスパラメータ:
 *   userId  - 利用者ID（例: /api/v1/users/1/favorites）
 *
 * リクエストボディ:
 *   { "bookId": 1239 }
 *
 * レスポンス:
 *   201 Created - { result, messageCode: "I05", message, data: { favoriteId, bookId, addedAt } }
 *   400     - bookId 不正（E01）
 *   401     - セッション切れ（W02）
 *   403     - 他利用者の userId へのアクセス（W03）
 *   404     - 書籍不在（W17）
 *   409     - 重複登録・UNIQUE 違反（W19）
 *   500     - DB例外発生時（E10）
 */
router.post('/:userId/favorites', requireLogin, favoriteController.addFavorite);

/*
 * DELETE /api/v1/users/:userId/favorites/:favoriteId  (API-13)
 *
 * お気に入りから書籍を削除します。
 *
 * パスパラメータ:
 *   userId     - 利用者ID（例: /api/v1/users/1/favorites/3）
 *   favoriteId - お気に入りID
 *
 * レスポンス:
 *   200 OK  - { result, messageCode: "I06", message, data: null }
 *   401     - セッション切れ（W02）
 *   403     - 他利用者の userId へのアクセス（W03）
 *   404     - favoriteId 不在・本人外（W17）
 *   500     - DB例外発生時（E10）
 */
router.delete('/:userId/favorites/:favoriteId', requireLogin, favoriteController.removeFavorite);

module.exports = router;