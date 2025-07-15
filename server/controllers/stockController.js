const { getStockPrice, getHistoricalPrices } = require('../utils/alphaVantage');

// Live Price
const getStock = async (req, res) => {
  try {
    const { symbol } = req.params;
    const stockData = await getStockPrice(symbol);
    res.json({ symbol: symbol.toUpperCase(), price: stockData.price });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching stock price' });
  }
};

// Historical Chart
const getStockHistory = async (req, res) => {
  try {
    const { symbol } = req.params;
    const history = await getHistoricalPrices(symbol);
    res.json({ symbol: symbol.toUpperCase(), history });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error fetching historical prices' });
  }
};

module.exports = {
  getStock,
  getStockHistory,
};
