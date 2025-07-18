const axios = require('axios');
const API_KEY = process.env.CURRENCY_API_KEY; // Add to .env

const convertCurrency = async (to = 'INR') => {
  const res = await axios.get(`https://api.currencyapi.com/v3/latest`, {
    params: {
      apikey: API_KEY,
      base_currency: 'USD',
      currencies: to
    }
  });

  const rate = res.data?.data?.[to]?.value;
  if (!rate) throw new Error('Currency conversion failed');

  return rate;
};

module.exports = { convertCurrency };
