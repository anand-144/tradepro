import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import MegaMenu from '../../components/MegaMenu';

const Portfolio = () => {
  const { accessToken } = useAuth();
  const { currency, convertCurrency } = useCurrency();

  const [balance, setBalance] = useState(0);
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchPortfolio = async () => {
    try {
      const res = await api.get('/portfolio', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const convertedHoldings = res.data.holdings.map((h) => ({
        ...h,
        avgPrice: convertCurrency(h.avgPrice),
        currentPrice: convertCurrency(h.currentPrice),
      }));

      setHoldings(convertedHoldings);
      setBalance(convertCurrency(res.data.balance));
    } catch (err) {
      console.error('Error fetching portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchPortfolio(); // initial load

  const interval = setInterval(fetchPortfolio, 30000); // 30s refresh
  return () => clearInterval(interval); // cleanup
}, [accessToken, currency]);


  const totalValue = holdings.reduce((acc, h) => acc + h.currentPrice * h.quantity, 0);
  const totalCost = holdings.reduce((acc, h) => acc + h.avgPrice * h.quantity, 0);
  const totalGainLoss = totalValue - totalCost;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <MegaMenu />
  
    <div className="p-6 text-slate-200">
      <h1 className="text-2xl font-semibold mb-6 text-emerald-400">My Portfolio</h1>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-800 rounded-2xl p-4 shadow border border-slate-700">
          <p className="text-sm text-slate-400">Available Balance</p>
          <p className="text-emerald-400 text-xl font-bold">
            {currency} {balance.toLocaleString()}
          </p>
        </div>
        <div className="bg-slate-800 rounded-2xl p-4 shadow border border-slate-700">
          <p className="text-sm text-slate-400">Current Value</p>
          <p className="text-blue-400 text-xl font-bold">
            {currency} {totalValue.toFixed(2)}
          </p>
        </div>
        <div className="bg-slate-800 rounded-2xl p-4 shadow border border-slate-700">
          <p className="text-sm text-slate-400">Total Gain / Loss</p>
          <p className={`text-xl font-bold ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {currency} {totalGainLoss.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-slate-900 rounded-xl overflow-x-auto border border-slate-800 shadow">
        <table className="min-w-full divide-y divide-slate-700 text-sm">
          <thead className="bg-slate-800 text-slate-400 text-left">
            <tr>
              <th className="px-4 py-3">Symbol</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Avg. Price</th>
              <th className="px-4 py-3">Current Price</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Gain / Loss</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {holdings.map((h) => {
              const value = h.currentPrice * h.quantity;
              const gainLossClass =
                h.gainLossAbsolute > 0
                  ? 'text-green-400'
                  : h.gainLossAbsolute < 0
                  ? 'text-red-400'
                  : 'text-slate-300';

              return (
                <tr key={h.symbol}>
                  <td className="px-4 py-3 font-medium text-slate-200">{h.symbol}</td>
                  <td className="px-4 py-3">{h.quantity}</td>
                  <td className="px-4 py-3">{currency} {h.avgPrice.toFixed(2)}</td>
                  <td className="px-4 py-3">{currency} {h.currentPrice.toFixed(2)}</td>
                  <td className="px-4 py-3">{currency} {value.toFixed(2)}</td>
                  <td className={`px-4 py-3 font-medium ${gainLossClass}`}>
                    {currency} {convertCurrency(h.gainLossAbsolute).toFixed(2)} ({h.gainLossPercent.toFixed(2)}%)
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  );
};

export default Portfolio;
