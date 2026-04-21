const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookController');

router.get('/search', controller.searchBooks);

module.exports = router;