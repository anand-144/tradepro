const express = require('express');
const router = express.Router();
const { convertCurrency } = require('../utils/currency'); // ensure this path is correct

// 🌐 Popular global trading currencies
const tradingCurrencies = [
  'USD', 'EUR', 'INR', 'JPY', 'GBP', 'AUD', 'CAD',
  'CHF', 'CNY', 'HKD', 'SGD', 'NZD', 'ZAR',
  'KRW', 'SEK', 'NOK', 'RUB', 'BRL', 'MXN', 'AED'
];

// ✅ GET /api/currency/list → List supported currencies
router.get('/list', (req, res) => {
  res.json(tradingCurrencies);
});

// ✅ GET /api/currency/:to → Convert USD to :to currency
router.get('/:to', async (req, res) => {
  try {
    const to = req.params.to.toUpperCase();

    // ✅ Validate supported currency
    if (!tradingCurrencies.includes(to)) {
      return res.status(400).json({ message: `Unsupported currency: ${to}` });
    }

    // 🔄 Convert USD to target currency
    const rate = await convertCurrency(to);

    if (!rate || isNaN(rate)) {
      return res.status(500).json({ message: 'Invalid exchange rate received' });
    }

    res.json({ rate });
  } catch (err) {
    console.error('❌ Currency conversion error:', err.message);
    res.status(500).json({ message: 'Currency conversion failed' });
  }
});

module.exports = router;
