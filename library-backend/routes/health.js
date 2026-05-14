const express = require('express');

const router = express.Router();

const healthController =
    require('../controllers/healthController');

// =============================================================
// API-10
// GET /api/v1/health
// =============================================================
router.get(
    '/',
    healthController.getHealth
);

module.exports = router;