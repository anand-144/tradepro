import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useCurrency } from '../context/CurrencyContext'; // 💱 custom hook for currency sync

const LivePrice = ({ symbol = 'AAPL', onData }) => {
  const [data, setData] = useState(null);
  const [change, setChange] = useState(0);
  const [error, setError] = useState(null);
  const { currency, setCurrency } = useCurrency();
  const [convertedPrice, setConvertedPrice] = useState(null);
  const [conversionRate, setConversionRate] = useState(1);
  const [availableCurrencies, setAvailableCurrencies] = useState(['USD']);

  // ✅ Fetch currency list for dropdown
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await api.get('/currency/list');
        setAvailableCurrencies(res.data);
      } catch (err) {
        console.error('Failed to load currency list');
      }
    };
    fetchCurrencies();
  }, []);

  // ✅ Fetch live stock price
  useEffect(() => {
    const fetchLivePrice = async () => {
      try {
        const res = await api.get(`/stocks/${symbol}`);
        const { price, previousClose } = res.data;
        setData(res.data);
        setChange(price - previousClose);

        // ✅ Pass data up to parent (Dashboard)
        if (onData) onData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch live price');
      }
    };

    fetchLivePrice();
    const interval = setInterval(fetchLivePrice, 15000); // every 15s
    return () => clearInterval(interval);
  }, [symbol]);

  // ✅ Fetch currency conversion rate
  useEffect(() => {
    const fetchConversion = async () => {
      if (currency === 'USD') {
        setConversionRate(1);
        setConvertedPrice(data?.price);
        return;
      }

      try {
        const res = await api.get(`/currency/${currency}`);
        const rate = res.data.rate;
        setConversionRate(rate);
        setConvertedPrice(data?.price * rate);
      } catch (err) {
        console.error('Currency fetch error:', err.message);
        setConversionRate(1);
        setConvertedPrice(data?.price);
      }
    };

    if (data?.price) fetchConversion();
  }, [currency, data?.price]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!data) return <p className="text-white">Loading live price...</p>;

  const changePercent = ((change / data.previousClose) * 100).toFixed(2);
  const isPositive = change >= 0;

  return (
    <div className="bg-slate-800 text-white px-4 py-3 rounded shadow w-full max-w-4xl mx-auto mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-xl font-bold">{symbol}</h2>
        <p className="text-lg">
          ${data.price.toFixed(2)} USD
          <span className={isPositive ? 'text-green-400 ml-2' : 'text-red-400 ml-2'}>
            {isPositive ? '▲' : '▼'} {Math.abs(change).toFixed(2)} ({Math.abs(changePercent)}%)
          </span>
        </p>
        {currency !== 'USD' && convertedPrice && (
          <p className="text-sm text-slate-300">
            ≈ {convertedPrice.toFixed(2)} {currency}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="currency" className="mr-2">Convert to:</label>
        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="text-black px-2 py-1 rounded"
        >
          {availableCurrencies.map((cur) => (
            <option key={cur} value={cur}>{cur}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LivePrice;
