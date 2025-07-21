import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { FiActivity, FiTrendingUp, FiMaximize2 } from 'react-icons/fi';
import api from '../services/api';
import { useCurrency } from '../context/CurrencyContext';

const Chart = ({ symbol = 'AAPL' }) => {
  const { currency } = useCurrency();
  const [data, setData] = useState([]);
  const [conversionRate, setConversionRate] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('1M');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMarketClosed, setIsMarketClosed] = useState(false);

  const timeframes = [
    { label: '1D', value: '1D', days: 1 },
    { label: '1W', value: '1W', days: 7 },
    { label: '1M', value: '1M', days: 30 },
    { label: '3M', value: '3M', days: 90 },
    { label: '1Y', value: '1Y', days: 365 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/stocks/history/candle/${symbol}`);
        setData(res.data.candles || []);
        setIsMarketClosed(res.data.marketClosed || false);
        setError(null);
      } catch (err) {
        const msg = err.response?.data?.message?.toLowerCase() || '';
        if (err.response?.status === 429 || msg.includes('limit')) {
          setData([]);
          setError(null);
        } else {
          setError(msg || 'Error fetching stock price');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [symbol]);

  useEffect(() => {
    const convert = async () => {
      if (currency === 'USD') return setConversionRate(1);
      try {
        const res = await api.get(`/currency/${currency}`);
        setConversionRate(res.data.rate);
      } catch {
        setConversionRate(1);
      }
    };
    convert();
  }, [currency]);

  const slicedData = (() => {
    const days = timeframes.find(tf => tf.value === timeframe)?.days || 30;
    return data.slice(-days);
  })();

  const chartSeries = [
    {
      data: slicedData.map((point) => {
        const [o, h, l, c] = point.y.map(v =>
          parseFloat((v * conversionRate).toFixed(2))
        );
        return {
          x: new Date(point.x),
          y: [o, h, l, c],
        };
      }),
    },
  ];

  const chartOptions = {
    chart: {
      type: 'candlestick',
      height: isFullscreen ? 500 : 300,
      background: 'transparent',
      toolbar: { show: false },
      animations: { enabled: true },
    },
    theme: { mode: 'dark' },
    xaxis: {
      type: 'datetime',
      labels: {
        style: { colors: '#94a3b8', fontSize: '12px' },
      },
    },
    yaxis: {
      tooltip: { enabled: true },
      labels: {
        formatter: val => `${currency === 'USD' ? '$' : ''}${val.toFixed(2)}${currency !== 'USD' ? ' ' + currency : ''}`,
        style: { colors: '#94a3b8', fontSize: '12px' },
      },
    },
    tooltip: {
      theme: 'dark',
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const d = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
        const [o, h, l, c] = d.y;
        return `
          <div style="padding:8px">
            <strong style="color:#10b981;">${symbol} - ${currency}</strong><br/>
            <div style="font-size:12px; color:#94a3b8;">${new Date(d.x).toLocaleDateString()}</div>
            <div style="font-size:12px;">
              <span style="color:#94a3b8;">Open:</span> ${o}<br/>
              <span style="color:#10b981;">High:</span> ${h}<br/>
              <span style="color:#ef4444;">Low:</span> ${l}<br/>
              <span style="color:#e2e8f0;">Close:</span> ${c}
            </div>
          </div>`;
      },
    },
    grid: {
      borderColor: '#334155',
    },
  };

  if (loading) {
    return (
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 animate-pulse h-64" />
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-red-400 flex items-center space-x-2">
        <FiActivity className="w-5 h-5" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div
      className={`relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl border border-slate-700/50 shadow-xl ${
        isFullscreen ? 'fixed inset-4 z-[9999]' : ''
      }`}
    >
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black/70 z-[9990]"
          onClick={() => setIsFullscreen(false)}
        />
      )}

      {isMarketClosed && (
        <div className="bg-yellow-500/10 text-yellow-400 border border-yellow-400/20 px-4 py-2 text-sm rounded-t-lg text-center">
          Market Closed — Data may not reflect real-time prices.
        </div>
      )}

      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700/50">
        <div className="flex items-center space-x-3">
          <FiTrendingUp className="w-6 h-6 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">{symbol} Chart</h2>
          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">
            {currency}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1 bg-slate-700/40 rounded p-1">
            {timeframes.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setTimeframe(tf.value)}
                className={`px-2 py-1 text-xs rounded ${
                  timeframe === tf.value
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-400 hover:text-emerald-400'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg bg-slate-700/40 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            <FiMaximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <ReactApexChart
          options={chartOptions}
          series={chartSeries}
          type="candlestick"
          height={isFullscreen ? 500 : 300}
        />
      </div>
    </div>
  );
};

export default Chart;
