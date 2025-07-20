import React, { useState, useEffect } from 'react';
import {
  FiSearch, FiShoppingCart, FiStar, FiTrendingUp, FiDollarSign, FiTrendingDown
} from 'react-icons/fi';
import { useSpring, animated } from 'react-spring';
import toast, { Toaster } from 'react-hot-toast';
import MegaMenu from '../../components/MegaMenu';
import LivePrice from '../../components/LivePrice';
import Chart from '../../components/Chart';
import StockCardGrid from '../../components/StockCardGrid';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Loader from '../../components/Loader';

const Dashboard = () => {
  const [symbol, setSymbol] = useState('AAPL');
  const [input, setInput] = useState('');
  const [liveData, setLiveData] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [demoTradesCount, setDemoTradesCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    // simulate loading or wait for auth context to resolve
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // Adjust or remove this if AuthContext has its own loading

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  useEffect(() => {
    refreshUser();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setSymbol(input.trim().toUpperCase());
      setInput('');
    }
  };

  const handleAddToWatchlist = async (stockSymbol) => {
    const finalSymbol = typeof stockSymbol === 'string' ? stockSymbol.toUpperCase() : symbol;

    if (watchlist.includes(finalSymbol)) {
      toast('Already in your watchlist');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/watchlist/add', { symbol: finalSymbol });

      // ✅ Handle flexible response
      if (res.data.symbols) {
        const updatedList = res.data.symbols.map((s) => s.toUpperCase());
        setWatchlist(updatedList);
      } else {
        setWatchlist((prev) => [...new Set([...prev, finalSymbol])]);
      }

      toast.success(`✨ ${finalSymbol} added to watchlist`);
    } catch (err) {
      console.error('Add to watchlist failed:', err);
      toast.error(err.response?.data?.message || 'Failed to add to watchlist');
    } finally {
      setLoading(false);
    }
  };

  const handleTrade = async () => {
    try {
      setLoading(true);
      await api.post('/trade/buy', { symbol, quantity: 1 });
      await refreshUser();
      toast.success(`🎯 Bought 1 share of ${symbol}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Trade failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSellTrade = async () => {
    try {
      setLoading(true);
      await api.post('/trade/sell', { symbol, quantity: 1 });
      await refreshUser();
      toast.success(`💸 Sold 1 share of ${symbol}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Sell failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const res = await api.get('/watchlist');
        setWatchlist(res.data.symbols.map((s) => s.toUpperCase()));
      } catch {
        console.error('Failed to load watchlist');
      }
    };
    fetchWatchlist();
  }, []);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const res = await api.get('/transactions');
        const trades = res.data || [];
        setDemoTradesCount(trades.filter((t) => t.type === 'BUY').length);
      } catch {
        console.error('Failed to fetch trades');
      }
    };
    fetchTrades();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTrigger((prev) => prev + 1);
      refreshUser();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const animatedBalance = useSpring({
    val: user?.balance || 0,
    from: { val: 0 },
    reset: true,
    config: { tension: 120, friction: 16 }
  });

  const cards = [
    liveData && {
      ...liveData,
      isWatchable: !watchlist.includes(liveData.symbol),
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corp.',
      price: 378.85,
      previousClose: 375.12,
      change: 3.73,
      changePercent: '0.99',
      isWatchable: !watchlist.includes('MSFT'),
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: 138.21,
      previousClose: 135.67,
      change: 2.54,
      changePercent: '1.87',
      isWatchable: !watchlist.includes('GOOGL'),
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      price: 248.73,
      previousClose: 255.89,
      change: -7.16,
      changePercent: '-2.80',
      isWatchable: !watchlist.includes('TSLA'),
    },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Toaster />
      <MegaMenu />
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
            Welcome to TradePro Dashboard
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Track real-time stock prices, analyze market trends, and manage your portfolio with our advanced trading platform.
          </p>
        </div>

        {/* Search + Actions */}
        <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter stock symbol (e.g., AAPL)"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md"
                >
                  <FiSearch className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleAddToWatchlist(symbol)}
                disabled={loading}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-4 py-3 rounded-lg"
              >
                <FiStar className="w-4 h-4" />
                <span>Add to Watchlist</span>
              </button>
              <button
                onClick={handleTrade}
                disabled={loading}
                className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black px-4 py-3 rounded-lg"
              >
                <FiShoppingCart className="w-4 h-4" />
                <span>Buy 1 Share</span>
              </button>
              <button
                onClick={handleSellTrade}
                disabled={loading}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-4 py-3 rounded-lg"
              >
                <FiTrendingDown className="w-4 h-4" />
                <span>Sell 1 Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Market Highlights */}
        <section>
          <div className="flex items-center space-x-3 mb-6">
            <FiTrendingUp className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-bold text-white">Market Highlights</h2>
          </div>
          <StockCardGrid stocks={cards} onAddToWatchlist={handleAddToWatchlist} />
        </section>

        {/* Live Price */}
        <section>
          <div className="flex items-center space-x-3 mb-6">
            <FiDollarSign className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-bold text-white">Live Price Tracker</h2>
          </div>
          <LivePrice symbol={symbol} onData={setLiveData} key={`live-${refreshTrigger}`} />
        </section>

        {/* Chart */}
        <section>
          <Chart symbol={symbol} key={`chart-${refreshTrigger}`} />
        </section>

        {/* Portfolio Summary */}
        <section className="bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
            <FiDollarSign className="w-6 h-6 text-emerald-400" />
            <span>Portfolio Summary</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className="text-slate-400 text-sm mb-2">Account Balance</div>
              <animated.div className="text-2xl font-bold text-emerald-400">
                {animatedBalance.val.to(val => `$${val.toLocaleString(undefined, { maximumFractionDigits: 2 })}`)}
              </animated.div>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className="text-slate-400 text-sm mb-2">Watchlist Items</div>
              <div className="text-2xl font-bold text-blue-400">{watchlist.length}</div>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className="text-slate-400 text-sm mb-2">Demo Trades</div>
              <div className="text-2xl font-bold text-amber-400">{demoTradesCount}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
