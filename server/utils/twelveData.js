const axios = require('axios');
const API_KEY = process.env.TWELVE_DATA_API_KEY;

// 🔵 Get latest stock price
const getStockPrice = async (symbol) => {
  const url = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${API_KEY}`;
  const response = await axios.get(url);
  const data = response.data;

if (data.code || !data.close) {
  throw new Error(data.message || 'Invalid symbol or quota exceeded');
}

return {
  symbol: data.symbol,
  price: parseFloat(data.close),
  previousClose: parseFloat(data.previous_close),
};

};

// 📈 Get last 30 days historical prices
const getHistoricalPrices = async (symbol) => {
  const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&outputsize=30&apikey=${API_KEY}`;
  const response = await axios.get(url);
  const data = response.data;

  if (!data || !data.values) {
    throw new Error(data.message || 'Failed to fetch historical prices');
  }

  const history = data.values.map(entry => ({
    date: entry.datetime,
    close: parseFloat(entry.close),
  })).reverse(); // earliest date first

  return history;
};

const getIntradayPrices = async (symbol) => {
  const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=5min&apikey=${API_KEY}`;
  const response = await axios.get(url);
  const values = response.data.values;

  if (!values) throw new Error("Intraday data unavailable");

  return values.reverse().map(item => ({
    date: item.datetime,
    close: parseFloat(item.close),
  }));
};

const getCandleData = async (symbol) => {
  const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&outputsize=30&apikey=${API_KEY}`;
  const res = await axios.get(url);

  if (res.data.status === 'error') {
    throw new Error(res.data.message || 'Failed to fetch candle data');
  }

  const series = res.data.values;

  return series.map(point => ({
    x: point.datetime,
    y: [
      parseFloat(point.open),
      parseFloat(point.high),
      parseFloat(point.low),
      parseFloat(point.close)
    ]
  })).reverse(); // oldest to newest
};


module.exports = {
  getStockPrice,
  getHistoricalPrices,
  getIntradayPrices,
  getCandleData,
};
