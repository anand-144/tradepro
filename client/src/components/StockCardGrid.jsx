import React from 'react';
import StockCard from './StockCard';

const StockCardGrid = ({ stocks }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
      {stocks.map((stock) => (
        <StockCard
          key={stock.symbol}
          stock={stock}
          showButton={stock.isWatchable !== false}
        />
      ))}
    </div>
  );
};

export default StockCardGrid;
