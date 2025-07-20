import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MegaMenu from '../../components/MegaMenu';
import { useAuth } from '../../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../services/api';
import { FiDollarSign, FiHash, FiRepeat } from 'react-icons/fi';

const Trade = () => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [type, setType] = useState('BUY');
  const [loading, setLoading] = useState(false);

  const handleTrade = async () => {
    if (!symbol || !quantity || quantity <= 0) {
      return toast.error('Enter a valid symbol and quantity');
    }

    setLoading(true);
    try {
      const route = type === 'BUY' ? '/trade/buy' : '/trade/sell';
      const res = await api.post(
        route,
        { symbol, quantity },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      toast.success(res.data.message || 'Trade successful');
      setSymbol('');
      setQuantity('');
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Trade failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Toaster />
      <MegaMenu />

      <div className="flex justify-center items-center py-20 px-4">
        <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-6 space-y-6">
          <h2 className="text-2xl font-bold text-emerald-400 text-center">Trade Stocks</h2>

          {/* Symbol Input */}
          <div>
            <label className="block mb-1 text-sm text-slate-300 flex items-center gap-2">
              <FiHash className="text-emerald-400" /> Stock Symbol
            </label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="e.g. AAPL"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring focus:ring-emerald-500"
            />
          </div>

          {/* Quantity Input */}
          <div>
            <label className="block mb-1 text-sm text-slate-300 flex items-center gap-2">
              <FiDollarSign className="text-blue-400" /> Quantity
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="e.g. 10"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>

          {/* Type Select */}
          <div>
            <label className="block mb-1 text-sm text-slate-300 flex items-center gap-2">
              <FiRepeat className="text-yellow-400" /> Trade Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring focus:ring-yellow-500"
            >
              <option value="BUY">Buy</option>
              <option value="SELL">Sell</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleTrade}
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold text-white transition-colors ${
              type === 'BUY'
                ? 'bg-emerald-500 hover:bg-emerald-600'
                : 'bg-red-500 hover:bg-red-600'
            } ${loading && 'opacity-60 cursor-not-allowed'}`}
          >
            {loading ? 'Processing...' : `${type} Stock`}
          </button>

          {/* View Transactions Button */}
          <button
            onClick={() => navigate('/transactions')}
            className="w-full py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 transition mt-2"
          >
            View Your Transactions
          </button>
        </div>
      </div>
    </div>
  );
};

export default Trade;
  