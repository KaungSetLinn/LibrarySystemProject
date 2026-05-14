// routes/admin.js
const express = require('express');

const router = express.Router();

const adminBridgeController =
    require('../controllers/adminBridgeController');
const { requireLogin } = require('../middleware/auth');

// =============================================================
// API-08a  POST /api/v1/admin/bridge/import
// =============================================================
router.post(
    '/import',
    requireLogin,
    adminBridgeController.importBridge
);

// =============================================================
// API-08b  POST /api/v1/admin/bridge/export
// =============================================================
router.post(
    '/export',
    requireLogin,
    adminBridgeController.exportBridge
);

// =============================================================
// API-08c  POST /api/v1/admin/bridge/reset
// =============================================================
router.post(
    '/reset',
    requireLogin,
    adminBridgeController.resetBridge
);

module.exports = router;