import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import MegaMenu from '../components/MegaMenu';
import toast, { Toaster } from 'react-hot-toast';
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import { Sparklines, SparklinesLine } from 'react-sparklines';

const Portfolio = () => {
  const { accessToken } = useAuth();
  const { currency, setCurrency, convertCurrency } = useCurrency();

  const [balance, setBalance] = useState(0);
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchPortfolio = async () => {
    setLoading(true);
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
        gainLossAbsolute: convertCurrency(h.gainLossAbsolute),
        trend: Array.from({ length: 12 }, () => h.currentPrice + Math.random() * 2 - 1),
      }));

      setHoldings(convertedHoldings);
      setBalance(convertCurrency(res.data.balance));
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching portfolio:', err);
      toast.error('Failed to load portfolio. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
    const interval = setInterval(fetchPortfolio, 30000);
    return () => clearInterval(interval);
  }, [accessToken, currency]);

  const totalValue = holdings.reduce((acc, h) => acc + h.currentPrice * h.quantity, 0);
  const totalCost = holdings.reduce((acc, h) => acc + h.avgPrice * h.quantity, 0);
  const totalGainLoss = totalValue - totalCost;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Toaster position="top-right" />
      <MegaMenu />

      <div className="p-6 text-slate-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-2xl font-semibold text-emerald-400">My Portfolio</h1>

          <div className="flex gap-2 items-center">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-slate-700 text-white px-3 py-1 rounded"
            >
              <option value="USD">USD</option>
              <option value="INR">INR</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="CAD">CAD</option>
              <option value="AUD">AUD</option>
            </select>
            <button
              onClick={fetchPortfolio}
              className="bg-slate-700 text-white px-3 py-1 rounded hover:bg-slate-600"
            >
              Refresh
            </button>
          </div>
        </div>

        {lastUpdated && (
          <p className="text-sm text-slate-500 mb-4">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
          </div>
        ) : holdings.length === 0 ? (
          <div className="text-center text-slate-500 py-10">
            You don’t have any stocks in your portfolio yet.
          </div>
        ) : (
          <>
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

            {/* Desktop Table */}
            <div className="hidden md:block bg-slate-900 rounded-xl overflow-x-auto border border-slate-800 shadow">
              <table className="min-w-full divide-y divide-slate-700 text-sm">
                <thead className="bg-slate-800 text-slate-400 text-left">
                  <tr>
                    <th className="px-4 py-3">Symbol</th>
                    <th className="px-4 py-3">Quantity</th>
                    <th className="px-4 py-3">Avg. Price</th>
                    <th className="px-4 py-3">Current Price</th>
                    <th className="px-4 py-3">Value</th>
                    <th className="px-4 py-3">Trend</th>
                    <th className="px-4 py-3">Gain / Loss</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {holdings.map((h) => {
                    const value = h.currentPrice * h.quantity;
                    const gainLoss = (
                      <span className={`flex items-center gap-1 font-medium ${
                        h.gainLossAbsolute > 0
                          ? 'text-green-400'
                          : h.gainLossAbsolute < 0
                          ? 'text-red-400'
                          : 'text-slate-300'
                      }`}>
                        {h.gainLossAbsolute > 0 ? <FiArrowUpRight /> : <FiArrowDownRight />}
                        {currency} {h.gainLossAbsolute.toFixed(2)} ({h.gainLossPercent.toFixed(2)}%)
                      </span>
                    );

                    return (
                      <tr key={h.symbol}>
                        <td className="px-4 py-3 font-medium text-slate-200">{h.symbol}</td>
                        <td className="px-4 py-3">{h.quantity}</td>
                        <td className="px-4 py-3">{currency} {h.avgPrice.toFixed(2)}</td>
                        <td className="px-4 py-3">{currency} {h.currentPrice.toFixed(2)}</td>
                        <td className="px-4 py-3">{currency} {value.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <Sparklines data={h.trend} width={100} height={20}>
                            <SparklinesLine color="cyan" style={{ strokeWidth: 1 }} />
                          </Sparklines>
                        </td>
                        <td className="px-4 py-3">{gainLoss}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden mt-6 space-y-4">
              {holdings.map((h) => (
                <div
                  key={h.symbol}
                  className="border border-slate-800 rounded-lg p-4 bg-slate-800 shadow"
                >
                  <div className="flex justify-between">
                    <p className="font-semibold text-slate-200">{h.symbol}</p>
                    <Sparklines data={h.trend} width={80} height={20}>
                      <SparklinesLine color="cyan" style={{ strokeWidth: 1 }} />
                    </Sparklines>
                  </div>
                  <p className="text-slate-400 text-sm">Qty: {h.quantity}</p>
                  <p className="text-slate-400 text-sm">
                    Avg: {currency} {h.avgPrice.toFixed(2)}
                  </p>
                  <p className="text-slate-400 text-sm">
                    Price: {currency} {h.currentPrice.toFixed(2)}
                  </p>
                  <p className="text-slate-400 text-sm">
                    Value: {currency} {(h.currentPrice * h.quantity).toFixed(2)}
                  </p>
                  <p className={`text-sm mt-1 ${
                    h.gainLossAbsolute > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {h.gainLossAbsolute > 0 ? <FiArrowUpRight /> : <FiArrowDownRight />}
                    {currency} {h.gainLossAbsolute.toFixed(2)} ({h.gainLossPercent.toFixed(2)}%)
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
