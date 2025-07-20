const express = require('express');
const router = express.Router();
const { register, login, logout, getUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth'); // ✅ Middleware to check JWT

// Auth Routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// ✅ Get current logged-in user info (name, email, balance, etc.)
router.get('/user', authMiddleware, getUser);

module.exports = router;
