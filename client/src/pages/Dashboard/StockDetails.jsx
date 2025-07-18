import React from 'react';
import LivePrice from '../../components/LivePrice';
import Chart from '../../components/Chart';

const StockDetails = () => {
  const symbol = 'AAPL'; // you can replace this with a route param

  return (
    <div className="p-6">
      <LivePrice symbol={symbol} />
      <Chart symbol={symbol} />
    </div>
  );
};

export default StockDetails;
