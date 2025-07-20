const {
  getStockPrice,
  getHistoricalPrices,
  getCandleData,
  isMarketClosed
} = require('../utils/twelveData');

// ✅ Live Price
const getStock = async (req, res) => {
  try {
    const { symbol } = req.params;
    const stockData = await getStockPrice(symbol);
    res.json({
      symbol: symbol.toUpperCase(),
      price: stockData.price,
      previousClose: stockData.previousClose,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching stock price' });
  }
};

// ✅ Line Chart
const getStockHistory = async (req, res) => {
  try {
    const { symbol } = req.params;
    const history = await getHistoricalPrices(symbol);
    res.json(history);
  } catch (err) {
    console.error('❌ getStockHistory Error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Candle Chart (Only Daily)
const getCandleHistory = async (req, res) => {
  try {
    const { symbol } = req.params;
    const marketClosed = isMarketClosed();

    // Always use daily candles only
    let candles = await getCandleData(symbol);

    // Remove today’s candle if market is still open (to avoid partial data)
    const today = new Date().toISOString().slice(0, 10);
    candles = candles.filter(c => !c.x.startsWith(today));

    // Format dates as Date objects
    candles = candles.map(c => ({
      x: new Date(c.x),
      y: c.y
    }));

    res.json({
      marketClosed,
      candles
    });
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
