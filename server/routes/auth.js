const express = require('express');
const router = express.Router();
const { register, login , logout, refresh } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/refresh', refresh);
router.post('/logout', logout);

module.exports = router;
