import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiPlus, FiEye } from 'react-icons/fi';

const StockCard = ({ stock, onAddToWatchlist }) => {
  if (!stock) return null;

  const isPositive = stock.change >= 0;
  const TrendIcon = isPositive ? FiTrendingUp : FiTrendingDown;

  return (
    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300 hover:transform hover:scale-105 group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-200">
            {stock.symbol}
          </h3>
          <p className="text-slate-400 text-sm">{stock.name || 'Stock Name'}</p>
        </div>
        {stock.isWatchable && (
          <button
            onClick={() => onAddToWatchlist?.(stock.symbol)}
            className="p-2 rounded-lg bg-slate-700/50 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 transition-all duration-200 opacity-0 group-hover:opacity-100"
            title="Add to Watchlist"
          >
            <FiPlus className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-white">
            ${stock.price?.toFixed(2) || '0.00'}
          </span>
          <div className={`flex items-center space-x-1 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            <TrendIcon className="w-4 h-4" />
            <span className="font-medium">
              {isPositive ? '+' : ''}{stock.change?.toFixed(2) || '0.00'}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400">Prev Close</span>
          <span className="text-slate-300">${stock.previousClose?.toFixed(2) || '0.00'}</span>
        </div>

        <div className={`text-center py-2 px-3 rounded-lg text-sm font-medium ${
          isPositive 
            ? 'bg-emerald-500/20 text-emerald-400' 
            : 'bg-red-500/20 text-red-400'
        }`}>
          {isPositive ? '+' : ''}{stock.changePercent || '0.00'}%
        </div>
      </div>

      {!stock.isWatchable && (
        <div className="mt-4 flex items-center justify-center space-x-2 text-emerald-400 text-sm">
          <FiEye className="w-4 h-4" />
          <span>In Watchlist</span>
        </div>
      )}
    </div>
  );
};

const StockCardGrid = ({ stocks = [], onAddToWatchlist }) => {
  if (!stocks.length) {
    return (
      <div className="text-center py-12">
        <div className="text-slate-400 text-lg">No stocks to display</div>
        <div className="text-slate-500 text-sm mt-2">Add some stocks to your watchlist to see them here</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stocks.map((stock, index) => (
        <StockCard 
          key={stock?.symbol || index} 
          stock={stock} 
          onAddToWatchlist={onAddToWatchlist}
        />
      ))}
    </div>
  );
};

export default StockCardGrid;