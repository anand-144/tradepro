import React, { useEffect, useState } from 'react';
import CanvasJSReact from '@canvasjs/react-stockcharts';
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

  const CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

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
        setError(err.response?.data?.message || 'Error fetching stock price');
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

  // ⏳ Slice historical candles based on selected timeframe (latest N days)
  const slicedData = (() => {
    const days = timeframes.find(tf => tf.value === timeframe)?.days || 30;
    return data.slice(-days);
  })();

  const formattedData = slicedData.map(point => {
    const [open, high, low, close] = point.y.map(v =>
      parseFloat((v * conversionRate).toFixed(2))
    );
    return {
      x: new Date(point.x),
      y: [open, high, low, close],
      color: close >= open ? '#10b981' : '#ef4444',
      borderColor: close >= open ? '#10b981' : '#ef4444',
    };
  });

  const chartOptions = {
    theme: 'dark2',
    backgroundColor: 'transparent',
    height: isFullscreen ? 500 : 300,
    exportEnabled: false,
    animationEnabled: true,
    charts: [
      {
        toolTip: {
          shared: true,
          backgroundColor: '#0f172a',
          borderColor: '#334155',
          fontColor: '#e2e8f0',
          contentFormatter: e => {
            const d = e.entries[0].dataPoint;
            const date = d.x.toLocaleDateString();
            const [o, h, l, c] = d.y;
            return `
              <div style="text-align: center;">
                <strong style="color: #10b981;">${symbol} - ${currency}</strong><br/>
                <div style="margin: 8px 0; font-size: 12px; color: #94a3b8;">${date}</div>
                <table style="margin: 0 auto; font-size: 12px;">
                  <tr><td style="padding: 2px 8px; color: #94a3b8;">Open:</td><td style="color: #e2e8f0;">${o}</td></tr>
                  <tr><td style="padding: 2px 8px; color: #94a3b8;">High:</td><td style="color: #10b981;">${h}</td></tr>
                  <tr><td style="padding: 2px 8px; color: #94a3b8;">Low:</td><td style="color: #ef4444;">${l}</td></tr>
                  <tr><td style="padding: 2px 8px; color: #94a3b8;">Close:</td><td style="color: #e2e8f0; font-weight: bold;">${c}</td></tr>
                </table>
              </div>`;
          },
        },
        axisX: {
          valueFormatString: 'MMM DD',
          labelFontColor: '#94a3b8',
          labelFontSize: 11,
          lineColor: '#475569',
          tickColor: '#475569',
          gridColor: '#334155',
          gridThickness: 0.5,
        },
        axisY: {
          prefix: currency === 'USD' ? '$' : '',
          suffix: currency !== 'USD' ? ` ${currency}` : '',
          title: `Price (${currency})`,
          titleFontColor: '#10b981',
          titleFontSize: 12,
          labelFontColor: '#94a3b8',
          labelFontSize: 11,
          lineColor: '#475569',
          tickColor: '#475569',
          gridColor: '#334155',
          gridThickness: 0.5,
        },
        data: [
          {
            type: 'candlestick',
            risingColor: '#10b981',
            fallingColor: '#ef4444',
            dataPoints: formattedData,
          },
        ],
      },
    ],
  };

  if (loading) {
    return (
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 animate-pulse h-64">
        <div className="h-8 w-40 bg-slate-700 rounded mb-4"></div>
        <div className="h-full bg-slate-700 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
        <div className="flex items-center space-x-2 text-red-400">
          <FiActivity className="w-5 h-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl border border-slate-700/50 shadow-xl transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-50' : 'relative'
      }`}
    >
      {isMarketClosed && (
        <div className="bg-yellow-500/10 text-yellow-400 border border-yellow-400/20 px-4 py-2 text-sm rounded-t-lg text-center">
          Market Closed — Data may not reflect real-time prices.
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b border-slate-700/50">
        <div className="flex items-center space-x-3 mb-4 sm:mb-0">
          <FiTrendingUp className="w-6 h-6 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">{symbol} Chart</h2>
          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">{currency}</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-slate-700/40 rounded p-1">
            {timeframes.map(tf => (
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

      {/* Chart Canvas */}
      <div className="overflow-x-auto px-4 pb-4">
        <div className="w-full max-w-[900px] mx-auto">
          <CanvasJSStockChart options={chartOptions} />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="px-4 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {formattedData.length > 0 && (() => {
            const latest = formattedData.at(-1);
            const [o, h, l, c] = latest.y;
            return (
              <>
                <div className="bg-slate-700/30 p-3 rounded text-center">
                  <div className="text-slate-400 text-sm">Open</div>
                  <div className="text-white font-semibold">{o}</div>
                </div>
                <div className="bg-emerald-500/10 p-3 rounded text-center">
                  <div className="text-slate-400 text-sm">High</div>
                  <div className="text-emerald-400 font-semibold">{h}</div>
                </div>
                <div className="bg-red-500/10 p-3 rounded text-center">
                  <div className="text-slate-400 text-sm">Low</div>
                  <div className="text-red-400 font-semibold">{l}</div>
                </div>
                <div className="bg-slate-700/30 p-3 rounded text-center">
                  <div className="text-slate-400 text-sm">Close</div>
                  <div className="text-white font-semibold">{c}</div>
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* Fullscreen Exit Overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setIsFullscreen(false)} />
      )}
    </div>
  );
};

export default Chart;
