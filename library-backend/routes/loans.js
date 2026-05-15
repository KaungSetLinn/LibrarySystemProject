'use strict';

const express = require('express');
const router = express.Router();
const { requireLogin } = require('../middleware/auth');
const loanController = require('../controllers/loanController');

/*
 * POST /api/v1/loans/events  (API-09, §8.4.15)
 *
 * 外部貸出管理システムから貸出・返却イベントを受信します。
 *
 * リクエストボディ:
 *   { eventType: 'LOAN'|'RETURN', userId, bookId, loanedAt, dueDate }
 *
 * レスポンス:
 *   200  - { result, messageCode: "I00", message: "OK",
 *             data: { affectedReservations, loanId } }
 *   400  - バリデーションエラー（E04）
 *   401  - 未認証（E01）
 *   500  - DB例外（E10）
 */
router.post('/events', requireLogin, loanController.handleLoanEvent);

module.exports = router;