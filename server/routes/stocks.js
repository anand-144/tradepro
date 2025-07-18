const express = require('express');
const router = express.Router();
const {
  getStock,
  getStockHistory,
  getCandleHistory, // 🆕
} = require('../controllers/stockController');
const { validateStockSymbol } = require('../validators/stockValidator');
const validateRequest = require('../middleware/validateRequest');
const auth = require('../middleware/auth');

// Public search
router.get('/public/:symbol', validateStockSymbol, validateRequest, getStock);

// Protected routes
router.get('/history/candle/:symbol', auth, validateStockSymbol, validateRequest, getCandleHistory); // 🆕
router.get('/history/:symbol', auth, validateStockSymbol, validateRequest, getStockHistory);
router.get('/:symbol', auth, validateStockSymbol, validateRequest, getStock);

module.exports = router;
