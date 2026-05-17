/*
 * Readable-code review note:
 * - Role: Test-backend route definitions. Keep authentication boundary and controller delegation easy to audit.
 * - Keep behavior unchanged unless a specification or bug-fix task explicitly requires it.
 * - Comments in this file should explain intent, data contracts, and edge cases rather than repeat the code.
 */
const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookController');

/* GET /api/books/search
      ?title=<部分一致>
      &author=<部分一致>
      &category=<完全一致>
      &sort=bookId
      &page=0 */
router.get('/search', controller.searchBooks);

module.exports = router;