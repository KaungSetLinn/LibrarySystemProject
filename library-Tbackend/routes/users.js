/*
 * Readable-code review note:
 * - Role: Test-backend route definitions. Keep authentication boundary and controller delegation easy to audit.
 * - Keep behavior unchanged unless a specification or bug-fix task explicitly requires it.
 * - Comments in this file should explain intent, data contracts, and edge cases rather than repeat the code.
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

// === 追加機能: お気に入り CRUD ===
router.get(   '/:userId/favorites',            requireLogin, favoriteController.listFavorites);
router.post(  '/:userId/favorites',            requireLogin, favoriteController.addFavorite);
router.delete('/:userId/favorites/:favoriteId', requireLogin, favoriteController.removeFavorite);

// === 追加機能: 通知 ===
router.get( '/:userId/notifications',                          requireLogin, notificationController.listNotifications);
router.post('/:userId/notifications/read-all',                 requireLogin, notificationController.markAllRead);
router.post('/:userId/notifications/:notificationId/read',     requireLogin, notificationController.markRead);

module.exports = router;
