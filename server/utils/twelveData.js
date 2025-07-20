const axios = require('axios');
const API_KEY = process.env.TWELVE_DATA_API_KEY;

const cache = {};
const TTL = {
  price: 60 * 1000,         // 1 min
  candle: 2 * 60 * 1000,    // 2 min
};

// 🔵 Live Quote
const getStockPrice = async (symbol) => {
  const now = Date.now();
  if (cache[symbol]?.price && now - cache[symbol].price.timestamp < TTL.price) {
    return cache[symbol].price.data;
  }

  const url = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${API_KEY}`;
  const { data } = await axios.get(url);
  if (!data.close) throw new Error(data.message || 'Invalid symbol');

  const result = {
    symbol: data.symbol,
    name: data.name,
    price: parseFloat(data.close),
    previousClose: parseFloat(data.previous_close),
    volume: parseFloat(data.volume),
    marketCap: data.market_cap,
  };

  cache[symbol] = {
    ...cache[symbol],
    price: { data: result, timestamp: now }
  };
  return result;
};

// 📊 Daily Candles (up to 365 days, no intraday)
const getCandleData = async (symbol) => {
  const now = Date.now();
  if (cache[symbol]?.candle && now - cache[symbol].candle.timestamp < TTL.candle) {
    return cache[symbol].candle.data;
  }

  const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&outputsize=365&apikey=${API_KEY}`;
  const { data } = await axios.get(url);
  if (!data.values) throw new Error(data.message || 'No candle data');

  const today = new Date().toISOString().split('T')[0];

  const candles = data.values
    .map(point => ({
      x: point.datetime,
      y: [
        parseFloat(point.open),
        parseFloat(point.high),
        parseFloat(point.low),
        parseFloat(point.close)
      ]
    }))
    .filter(c => c.x < today) // remove today's incomplete candle
    .reverse(); // oldest to newest

  cache[symbol] = {
    ...cache[symbol],
    candle: { data: candles, timestamp: now }
  };
  return candles;
};

// 📈 Historical Close Prices (line chart)
const getHistoricalPrices = async (symbol) => {
  const candles = await getCandleData(symbol);
  return candles.map(c => ({
    date: c.x,
    close: c.y[3] // close
  }));
};

// 📆 Check if market is closed
const isMarketClosed = () => {
  const today = new Date();
  const day = today.getUTCDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
};

module.exports = {
  getStockPrice,
  getHistoricalPrices,
  getCandleData,
  isMarketClosed,
};
