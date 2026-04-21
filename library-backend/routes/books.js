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