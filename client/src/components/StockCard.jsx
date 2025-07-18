import React from 'react';
import { useCurrency } from '../context/CurrencyContext';

const StockCard = ({ stock, showButton = true }) => {
  const { currency, conversionRate } = useCurrency();

  if (!stock) return null;

  const price = (stock.price * conversionRate).toFixed(2);
  const change = (stock.price - stock.previousClose).toFixed(2);
  const percentChange = ((change / stock.previousClose) * 100).toFixed(2);
  const isPositive = change >= 0;

  return (
    <div className="bg-slate-800 text-white rounded-lg shadow p-4 w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">{stock.symbol}</h2>
        <span className="text-sm text-slate-400">{stock.name || 'Company'}</span>
      </div>

      <p className="text-lg font-bold">
        {price} {currency}
        <span className={`ml-2 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? '▲' : '▼'} {Math.abs(change)} ({Math.abs(percentChange)}%)
        </span>
      </p>

      {showButton && (
        <button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded">
          + Add to Watchlist
        </button>
      )}
    </div>
  );
};

export default StockCard;
