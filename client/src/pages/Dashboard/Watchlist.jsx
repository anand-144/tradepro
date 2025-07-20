import React, { useEffect, useState } from 'react';
import MegaMenu from '../../components/MegaMenu';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import LivePrice from '../../components/LivePrice';
import Chart from '../../components/Chart';
import { FiTrash2 } from 'react-icons/fi';

const Watchlist = () => {
  const { accessToken } = useAuth();
  const [symbols, setSymbols] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState(null);

  const fetchWatchlist = async () => {
    try {
      const res = await api.get('/watchlist', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setSymbols(res.data.symbols || []);
      if (!selectedSymbol && res.data.symbols.length > 0) {
        setSelectedSymbol(res.data.symbols[0]);
      }
    } catch (err) {
      console.error('Failed to fetch watchlist');
    }
  };

  const removeSymbol = async (symbol) => {
    try {
      await api.delete(`/watchlist/remove/${symbol}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setSymbols((prev) => prev.filter((s) => s !== symbol));
      if (selectedSymbol === symbol) {
        setSelectedSymbol(null);
      }
    } catch (err) {
      console.error('Error removing from watchlist');
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <MegaMenu />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-emerald-400 mb-6">📌 Your Watchlist</h1>

        {symbols.length === 0 ? (
          <p className="text-slate-400">Your watchlist is empty. Add stocks from the dashboard.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {symbols.map((symbol) => (
              <div
                key={symbol}
                className={`p-2 border border-slate-700 rounded-xl bg-slate-800 shadow hover:ring-2 hover:ring-emerald-400 transition-all cursor-pointer ${
                  selectedSymbol === symbol ? 'ring-2 ring-emerald-400' : ''
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold">{symbol}</h2>
                  <button
                    onClick={() => removeSymbol(symbol)}
                    className="text-red-400 hover:text-red-500"
                  >
                    <FiTrash2 />
                  </button>
                </div>
                <LivePrice symbol={symbol} />
                <div className="mt-3">
                  <Chart symbol={symbol} compact />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
