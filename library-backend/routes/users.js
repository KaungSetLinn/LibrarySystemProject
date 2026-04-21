const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireLogin } = require('../middleware/auth');

// METHOD: POST
// LOGIN API ENDPOINT
router.post('/login', userController.login);

// METHOD: POST
// LOGOUT API ENDPOINT
router.post('/logout', userController.logout);

// GET all users
router.get('/', requireLogin, userController.getAllUsers);

// GET single user
router.get('/:id', requireLogin, userController.getUserById);

module.exports = router;