import React, { useEffect, useState } from 'react';
import { FiTrendingUp, FiTrendingDown, FiActivity, FiDollarSign } from 'react-icons/fi';
import api from '../services/api';
import { useCurrency } from '../context/CurrencyContext';

const LivePrice = ({ symbol = 'AAPL', onData }) => {
  const [data, setData] = useState(null);
  const [apiChange, setApiChange] = useState(0);
  const [error, setError] = useState(null);
  const [conversionRate, setConversionRate] = useState(1);
  const [convertedData, setConvertedData] = useState(null);
  const { currency } = useCurrency();

  useEffect(() => {
    const fetchLivePrice = async () => {
      try {
        const res = await api.get(`/stocks/${symbol}`);
        const price = res.data.price;
        const previousClose = res.data.previousClose;
        setData(res.data);
        setApiChange(price - previousClose);
        if (onData) onData(res.data);
        setError(null);
      } catch (err) {
        const msg = err.response?.data?.message?.toLowerCase() || '';
        const isApiLimit = err.response?.status === 429 || msg.includes('limit');
        if (isApiLimit) {
          setData(null);
          setError(null);
        } else {
          setError(msg || 'Failed to fetch live price');
        }
      }
    };

    fetchLivePrice();
    const interval = setInterval(fetchLivePrice, 15000);
    return () => clearInterval(interval);
  }, [symbol]);

  useEffect(() => {
    const convertCurrency = async () => {
      if (!data?.price) return;

      if (currency === 'USD') {
        setConversionRate(1);
        setConvertedData(data);
        return;
      }

      try {
        const res = await api.get(`/currency/${currency}`);
        const rate = res.data.rate;
        setConversionRate(rate);

        const converted = {
          ...data,
          price: data.price * rate,
          previousClose: data.previousClose * rate,
          change: (data.price - data.previousClose) * rate,
        };
        setConvertedData(converted);
      } catch {
        setConvertedData(data);
      }
    };

    if (data?.price) convertCurrency();
  }, [currency, data]);

  if (!convertedData) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <div className="animate-pulse space-y-2">
          <div className="h-6 bg-slate-700 rounded w-48"></div>
          <div className="h-8 bg-slate-700 rounded w-32"></div>
        </div>
      </div>
    );
  }

  const priceChange = convertedData.price - convertedData.previousClose;
  const changePercent = ((priceChange / convertedData.previousClose) * 100).toFixed(2);
  const isPositive = priceChange >= 0;
  const TrendIcon = isPositive ? FiTrendingUp : FiTrendingDown;

  return (
    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">
            {convertedData.symbol} Live Price
          </h2>
          <p className="text-slate-400">{convertedData.name || 'Company'}</p>
        </div>
        <div className="flex items-center space-x-2">
          <FiActivity className="w-5 h-5 text-emerald-400" />
          <span className="text-sm text-emerald-400 font-medium">LIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2">
          <div className="flex items-center space-x-3 mb-2">
            <FiDollarSign className="w-6 h-6 text-slate-400" />
            <span className="text-lg text-slate-400">Current Price ({currency})</span>
          </div>
          <div className="text-4xl font-bold text-white">
            {convertedData.price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-3 mb-2">
            <TrendIcon className={`w-6 h-6 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`} />
            <span className="text-lg text-slate-400">Change</span>
          </div>
          <div className={`text-2xl font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{priceChange.toFixed(2)}
          </div>
          <div className={`text-lg ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            ({isPositive ? '+' : ''}{changePercent}%)
          </div>
        </div>

        <div>
          <div className="space-y-3">
            <div>
              <span className="text-slate-400 text-sm">Previous Close</span>
              <div className="text-xl font-semibold text-white">
                {convertedData.previousClose.toFixed(2)}
              </div>
            </div>
            <div>
              <span className="text-slate-400 text-sm">Volume</span>
              <div className="text-lg font-semibold text-white">
                {convertedData.volume?.toLocaleString() || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {convertedData.marketCap && (
        <div className="mt-6 pt-6 border-t border-slate-700/50">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Market Cap</span>
            <span className="text-xl font-semibold text-white">
              {convertedData.marketCap}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LivePrice;
