const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/*
 * POST /api/v1/auth/login  (API-01)
 *
 * 利用者IDと利用者名でログイン認証を行います。
 *
 * リクエストボディ:
 *   { "userId": 1, "userName": "佐藤翔太" }
 *
 * レスポンス:
 *   200 OK  - { result, messageCode: "I01", message, data: { userId, userName, loginAt } }
 *   401     - 認証失敗（W01）
 *
 * 副作用: connect-sqlite3 セッション保存、Set-Cookie connect.sid 発行、audit_log 記録
 */
router.post('/login', userController.login);

/*
 * POST /api/v1/auth/logout  (API-02)
 *
 * セッションを破棄し、クライアントの Cookie を無効化します。
 *
 * リクエスト: Body なし、X-CSRF-Token ヘッダ要
 *
 * レスポンス:
 *   200 OK  - { result, messageCode: "I00", message: "ログアウトしました。", data: null }
 *   401     - 未認証・セッション切れ（W02）
 *   500     - DB例外発生時（E10）
 *
 * 副作用: req.session.destroy()、Cookie 無効化、audit_log に LOGOUT を記録
 */
router.post('/logout', userController.logout);

module.exports = router;