const express = require('express');
const router = express.Router();
const { convertCurrency } = require('../utils/currency'); // adjust path if needed

// Common trading currencies globally
const tradingCurrencies = [
  'USD', 'EUR', 'INR', 'JPY', 'GBP', 'AUD', 'CAD',
  'CHF', 'CNY', 'HKD', 'SGD', 'NZD', 'ZAR',
  'KRW', 'SEK', 'NOK', 'RUB', 'BRL', 'MXN', 'AED',
];

// ✅ Route to get list of currencies
router.get('/list', (req, res) => {
  res.json(tradingCurrencies);
});

// ✅ Route to convert USD to any target currency
router.get('/:to', async (req, res) => {
  try {
    const { to } = req.params;
    if (!tradingCurrencies.includes(to)) {
      return res.status(400).json({ message: 'Unsupported currency' });
    }

    const rate = await convertCurrency(to);
    res.json({ rate });
  } catch (err) {
    console.error('❌ Currency conversion error:', err.message);
    res.status(500).json({ message: 'Conversion failed' });
  }
});

module.exports = router;
