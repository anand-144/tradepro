const axios = require('axios');
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

// 🔵 Live price
const getStockPrice = async (symbol) => {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
  const response = await axios.get(url);
  const data = response.data["Global Quote"];

  if (!data || !data["05. price"]) {
    throw new Error("Invalid symbol or API limit reached");
  }

  return {
    symbol: data["01. symbol"],
    price: parseFloat(data["05. price"]),
    previousClose: parseFloat(data["08. previous close"]),
  };
};

// 📈 Historical prices
const getHistoricalPrices = async (symbol) => {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&outputsize=compact&apikey=${API_KEY}`;
  const response = await axios.get(url);
  const data = response.data;

  if (!data['Time Series (Daily)']) {
    throw new Error(data['Error Message'] || 'Failed to fetch historical prices');
  }

  const raw = data['Time Series (Daily)'];
  const history = Object.entries(raw)
    .slice(0, 30)
    .map(([date, values]) => ({
      date,
      close: parseFloat(values['4. close']),
    }))
    .reverse();

  return history;
};

module.exports = {
  getStockPrice,
  getHistoricalPrices
};
