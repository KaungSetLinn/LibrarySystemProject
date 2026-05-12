/*
 * =============================================================================
 * ファイル名 : server/src/routes/index.js
 * 概要       : Express ルーティング定義（外部仕様書 §8 準拠）。
 *              全エンドポイントは /api/v1/ プレフィックス。
 *
 * 仕様書トレーサビリティ:
 *   - 外部仕様書 v4.0  §8 API一覧 / §8.2 共通応答形式
 *   - 改訂対象        A-4（API契約整合）
 *
 * 改訂履歴:
 *   v3.0    2026-05-04  Y.Toyoda  新規作成
 *   v3.0.3  2026-05-05  Y.Toyoda  検索・dashboard・mypage・notifications・book・health 追加（A-4）
 *   v3.0.4  2026-05-05  Y.Toyoda  ApiAdapter 経由のサーバモード対応（仕様整合）
 *   v3.0.5  2026-05-10  Y.Toyoda  DB担当指摘反映：API-06 予約取消パスを
 *                                 /reservations/:reservationId →
 *                                 /users/:userId/reservations/:reservationId に修正
 *                                 （外部仕様 v4.0a-rev2 §8.4.5 と整合）
 *   v3.0.6  2026-05-11  Y.Toyoda  v4.0a-rev3 反映：favorites CRUD（API-11/12/13）・
 *                                 通知既読化（API-14）ルート追加
 *
 * @author  Y.Toyoda
 * @version v3.0.6
 * =============================================================================
 */
"use strict";

const router = require("express").Router();
const c = require("../controllers");
const { requireAuth } = require("../middleware/auth");

// ----- 認証 -----
router.post("/auth/login",  c.validators.login, c.login);
router.post("/auth/logout", requireAuth, c.logout);

// ----- 予約 -----
// v3.0.5: API-06 エンドポイントをリソース指向に変更（外部仕様 v4.0a-rev2 §8.4.5）
router.post("/reservations", requireAuth, c.validators.reserve, c.reserve);
router.delete("/users/:userId/reservations/:reservationId", requireAuth, c.cancel);

// ----- 読み取り系（v3.0.3 / A-4 新設） -----
router.get("/books/search",                requireAuth, c.validators.search, c.searchBooks);
router.get("/books/:bookId",               requireAuth, c.getBook);
router.get("/users/:userId/dashboard",     requireAuth, c.getDashboard);
router.get("/users/:userId/mypage",        requireAuth, c.getMyPage);
router.get("/users/:userId/notifications", requireAuth, c.getNotifications);

// ----- favorites CRUD（v3.0.6 / API-11/12/13）-----
router.get("/users/:userId/favorites",                  requireAuth, c.listFavorites);
router.post("/users/:userId/favorites",                 requireAuth, c.validators.favoriteAdd, c.addFavorite);
router.delete("/users/:userId/favorites/:favoriteId",   requireAuth, c.removeFavorite);

// ----- 通知既読化（v3.0.6 / API-14）-----
router.post("/users/:userId/notifications/:notificationId/read", requireAuth, c.markNotificationRead);

// ----- ヘルスチェック -----
router.get("/health", c.health);

module.exports = router;
