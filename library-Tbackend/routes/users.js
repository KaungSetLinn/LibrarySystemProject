/*
 * READABLE-CODE REVIEW NOTE
 * 対象ファイル: library-Tbackend/routes/users.js
 * 責務: 豊田テスト backend のルーティング定義。URL と Controller の対応だけを担当する。
 * 保守メモ: 認証要否やパス接頭辞は frontend ApiAdapter と揃える。処理内容は Controller に閉じ込める。
 */
/*
 * -----------------------------------------------------------------------------
 * ファイル名 : library-Tbackend/routes/users.js
 * 概要       : 利用者ルーティング。MAIN backend 互換 + favorites/notifications 追加。
 * -----------------------------------------------------------------------------
 */
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const reservationController = require('../controllers/reservationController');
const favoriteController = require('../controllers/favoriteController');
const notificationController = require('../controllers/notificationController');
const { requireLogin } = require('../middleware/auth');

// === MAIN 互換 ===
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/', requireLogin, userController.getAllUsers);
router.get('/:id', requireLogin, userController.getUserById);
router.get('/:userId/reservations/active', requireLogin, reservationController.getActiveReservations);
router.delete('/:userId/reservations/:reservationId', requireLogin, reservationController.cancelReservation);

// === 追加機能: お気に入り CRUD ===
router.get(   '/:userId/favorites',            requireLogin, favoriteController.listFavorites);
router.post(  '/:userId/favorites',            requireLogin, favoriteController.addFavorite);
router.delete('/:userId/favorites/:favoriteId', requireLogin, favoriteController.removeFavorite);

// === 追加機能: 通知 ===
router.get( '/:userId/notifications',                          requireLogin, notificationController.listNotifications);
router.post('/:userId/notifications/read-all',                 requireLogin, notificationController.markAllRead);
router.post('/:userId/notifications/:notificationId/read',     requireLogin, notificationController.markRead);

module.exports = router;
