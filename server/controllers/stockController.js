const { getStockPrice, getHistoricalPrices } = require('../utils/twelveData');

// ✅ Live Price
const getStock = async (req, res) => {
  try {
    const { symbol } = req.params;
    const stockData = await getStockPrice(symbol);
    res.json({
      symbol: symbol.toUpperCase(),
      price: stockData.price,
      previousClose: stockData.previousClose, // for LivePrice.jsx
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching stock price' });
  }
};

// ✅ Historical Chart Data
const getStockHistory = async (req, res) => {
  try {
    const { symbol } = req.params;
    const history = await getHistoricalPrices(symbol);
    res.json(history); // Chart.jsx expects a raw array
  } catch (err) {
    console.error('❌ getStockHistory Error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

const { getCandleData } = require('../utils/twelveData'); // 🆕

const getCandleHistory = async (req, res) => {
  try {
    const { symbol } = req.params;
    const candles = await getCandleData(symbol);
    res.json(candles);
  } catch (err) {
    console.error('❌ getCandleHistory Error:', err.message);
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  getStock,
  getStockHistory,
  getCandleHistory,
};
