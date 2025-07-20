import React, { useEffect, useState } from 'react';
import MegaMenu from '../../components/MegaMenu';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const Transactions = () => {
  const { accessToken } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [runningBalances, setRunningBalances] = useState([]);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load transactions');
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    const filtered = transactions.filter((tx) => {
      const symbolMatch = tx.symbol.toLowerCase().includes(search.toLowerCase());
      const typeMatch = typeFilter ? tx.type === typeFilter : true;
      return symbolMatch && typeMatch;
    });
    setFiltered(filtered);
  }, [transactions, search, typeFilter]);

  useEffect(() => {
    // Running balance calculation
    let balance = 100000;
    const balances = [...filtered]
      .slice()
      .reverse()
      .map((tx) => {
        const total = tx.price * tx.quantity;
        balance = tx.type === 'BUY' ? balance - total : balance + total;
        return { ...tx, balance };
      })
      .reverse();
    setRunningBalances(balances);
  }, [filtered]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pageData = runningBalances.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const volumeByDay = transactions.reduce((acc, tx) => {
    const date = new Date(tx.date).toLocaleDateString();
    acc[date] = (acc[date] || 0) + tx.quantity;
    return acc;
  }, {});

  const volumeByWeek = transactions.reduce((acc, tx) => {
    const date = new Date(tx.date);
    const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
    const weekKey = weekStart.toLocaleDateString();
    acc[weekKey] = (acc[weekKey] || 0) + tx.quantity;
    return acc;
  }, {});

  const dailyChartData = Object.entries(volumeByDay).map(([date, volume]) => ({ date, volume }));
  const weeklyChartData = Object.entries(volumeByWeek).map(([week, volume]) => ({ week, volume }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Toaster />
      <MegaMenu />

      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-emerald-400 mb-4">Transaction History</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by symbol..."
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded w-full md:w-1/3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded w-full md:w-1/3"
          >
            <option value="">All Types</option>
            <option value="BUY">Buy</option>
            <option value="SELL">Sell</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-700 shadow mb-10">
          <table className="min-w-full divide-y divide-slate-700 text-sm">
            <thead className="bg-slate-800 text-left text-slate-400">
              <tr>
                <th className="px-4 py-3">Symbol</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {pageData.map((tx, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 font-semibold">{tx.symbol}</td>
                  <td
                    className={`px-4 py-3 font-medium ${
                      tx.type === 'BUY' ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {tx.type}
                  </td>
                  <td className="px-4 py-3">{tx.quantity}</td>
                  <td className="px-4 py-3">${tx.price.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    {new Date(tx.date).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-3 text-blue-300">
                    ${tx.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mb-10">
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow">
            <h3 className="text-white font-semibold mb-2">Daily Trade Volume</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dailyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="volume" fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow">
            <h3 className="text-white font-semibold mb-2">Weekly Trade Volume</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="volume" fill="#34d399" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
