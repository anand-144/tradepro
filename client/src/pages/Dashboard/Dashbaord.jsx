import React, { useState, useEffect } from 'react';
import MegaMenu from '../../components/MegaMenu';
import LivePrice from '../../components/LivePrice';
import Chart from '../../components/Chart';
import StockCardGrid from '../../components/StockCardGrid';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Dashboard = () => {
  const [symbol, setSymbol] = useState('AAPL');
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');
  const [liveData, setLiveData] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const { user } = useAuth();

  // 🔍 Search stock
  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setSymbol(input.trim().toUpperCase());
      setMessage('');
    }
  };

  // 💾 Add to watchlist
  const handleAddToWatchlist = async () => {
    try {
      await api.post('/watchlist', { symbol });
      setMessage(`✅ ${symbol} added to your watchlist.`);
      setWatchlist(prev => [...prev, symbol.toUpperCase()]);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Watchlist update failed'}`);
    }
  };

  // 🧪 Demo trade
  const handleTrade = async () => {
    try {
      await api.post('/trade/buy', { symbol, quantity: 1 });
      setMessage(`🧪 Bought 1 share of ${symbol}`);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Trade failed'}`);
    }
  };

  // 📥 Fetch watchlist on load
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const res = await api.get('/watchlist');
        setWatchlist(res.data.map(item => item.symbol.toUpperCase()));
      } catch (err) {
        console.error('❌ Failed to load watchlist');
      }
    };
    fetchWatchlist();
  }, []);

  // 🎴 Create 4 card views with watchable toggle
  const cards = [
    liveData && {
      ...liveData,
      isWatchable: !watchlist.includes(liveData.symbol),
    },
    { symbol: 'MSFT', price: 380, previousClose: 375, isWatchable: !watchlist.includes('MSFT') },
    { symbol: 'GOOGL', price: 138, previousClose: 135, isWatchable: !watchlist.includes('GOOGL') },
    { symbol: 'TSLA', price: 250, previousClose: 255, isWatchable: !watchlist.includes('TSLA') },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <MegaMenu />

      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto space-y-10">

        {/* 🔍 Search + Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <form onSubmit={handleSearch} className="flex gap-2 w-full md:max-w-md">
            <input
              type="text"
              placeholder="Enter stock symbol (e.g. TSLA)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2 rounded bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button type="submit" className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">
              🔍 Search
            </button>
          </form>

          <div className="flex gap-3">
            <button
              onClick={handleAddToWatchlist}
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
            >
              💾 Save to Watchlist
            </button>
            <button
              onClick={handleTrade}
              className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600"
            >
              🧪 Demo Buy 1
            </button>
          </div>
        </div>

        {/* 🔔 Message */}
        {message && (
          <p className="text-sm text-blue-300 font-medium">
            {message}
          </p>
        )}

       {/* 🧱 Stock Cards */}
       
        <section>
          <h2 className="text-xl font-bold mb-2">📦 Market Highlights</h2>
          <StockCardGrid stocks={cards} />
        </section>

        {/* 💹 Live Stock Price */}
        <section>
          <LivePrice symbol={symbol} onData={setLiveData} />
        </section>

     

        {/* 📈 Chart */}
        <section>
          <h2 className="text-xl font-bold mb-2">📈 {symbol} - Historical Chart</h2>
          <Chart symbol={symbol} />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
