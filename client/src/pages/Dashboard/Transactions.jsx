import React, { useEffect, useState } from 'react';
import MegaMenu from '../../components/MegaMenu';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../../components/Loader'; // ✅ Loader imported
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
  const [loading, setLoading] = useState(true); // ✅ loading state
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
    } finally {
      setLoading(false); // ✅ end loading
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

  if (loading) return <Loader />; // ✅ show loader

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Toaster />
      <MegaMenu />

      <div className="p-6 max-w-6xl mx-auto">
        {/* ...rest remains unchanged... */}
      </div>
    </div>
  );
};

export default Transactions;
