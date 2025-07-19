import React, { useEffect, useState } from 'react';
import CanvasJSReact from '@canvasjs/react-stockcharts';
import { FiActivity, FiTrendingUp, FiCalendar, FiMaximize2 } from 'react-icons/fi';
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

  const CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

  const timeframes = [
    { label: '1W', value: '1W', days: 7 },
    { label: '1M', value: '1M', days: 30 },
    { label: '3M', value: '3M', days: 90 },
    { label: '1Y', value: '1Y', days: 365 }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/stocks/history/candle/${symbol}`);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load chart');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [symbol, timeframe]);

  useEffect(() => {
    const convert = async () => {
      if (currency === 'USD') {
        setConversionRate(1);
        return;
      }
      try {
        const res = await api.get(`/currency/${currency}`);
        setConversionRate(res.data.rate);
      } catch (err) {
        console.error('Currency conversion failed');
        setConversionRate(1);
      }
    };
    convert();
  }, [currency]);

  const formattedData = data.map(point => {
    const [open, high, low, close] = point.y.map(v => parseFloat((v * conversionRate).toFixed(2)));
    return {
      x: new Date(point.x),
      y: [open, high, low, close],
      color: close >= open ? "#10b981" : "#ef4444",
      borderColor: close >= open ? "#10b981" : "#ef4444"
    };
  });

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-64 mb-6"></div>
          <div className="h-96 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8">
        <div className="flex items-center space-x-2 text-red-400">
          <FiActivity className="w-5 h-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  const options = {
    theme: 'dark2',
    backgroundColor: "transparent",
    exportEnabled: false,
    animationEnabled: true,
    height: isFullscreen ? 600 : 400,
    charts: [{
      toolTip: {
        shared: true,
        backgroundColor: "#0f172a",
        borderColor: "#334155",
        fontColor: "#e2e8f0",
        contentFormatter: e => {
          const d = e.entries[0].dataPoint;
          const date = d.x.toLocaleDateString();
          const [o, h, l, c] = d.y;
          return `<div style="text-align: center;">
            <strong style="color: #10b981;">${symbol} - ${currency}</strong><br/>
            <div style="margin: 8px 0; font-size: 12px; color: #94a3b8;">${date}</div>
            <table style="margin: 0 auto; font-size: 12px;">
              <tr><td style="padding: 2px 8px; color: #94a3b8;">Open:</td><td style="padding: 2px 8px; color: #e2e8f0;">${o}</td></tr>
              <tr><td style="padding: 2px 8px; color: #94a3b8;">High:</td><td style="padding: 2px 8px; color: #10b981;">${h}</td></tr>
              <tr><td style="padding: 2px 8px; color: #94a3b8;">Low:</td><td style="padding: 2px 8px; color: #ef4444;">${l}</td></tr>
              <tr><td style="padding: 2px 8px; color: #94a3b8;">Close:</td><td style="padding: 2px 8px; color: #e2e8f0; font-weight: bold;">${c}</td></tr>
            </table>
          </div>`;
        }
      },
      axisX: {
        valueFormatString: "MMM DD",
        labelFontColor: "#94a3b8",
        labelFontSize: 11,
        lineColor: "#475569",
        tickColor: "#475569",
        gridColor: "#334155",
        gridThickness: 0.5,
      },
      axisY: {
        prefix: currency === 'USD' ? '$' : '',
        suffix: currency !== 'USD' ? ` ${currency}` : '',
        title: `Price (${currency})`,
        titleFontColor: "#10b981",
        titleFontSize: 12,
        labelFontColor: "#94a3b8",
        labelFontSize: 11,
        lineColor: "#475569",
        tickColor: "#475569",
        gridColor: "#334155",
        gridThickness: 0.5,
      },
      data: [{
        type: "candlestick",
        risingColor: "#10b981",
        fallingColor: "#ef4444",
        dataPoints: formattedData
      }]
    }]
  };

  return (
    <div className={`bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-xl transition-all duration-300 ${
      isFullscreen ? 'fixed inset-4 z-50' : 'relative'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 border-b border-slate-700/50">
        <div className="flex items-center space-x-3 mb-4 sm:mb-0">
          <div className="flex items-center space-x-2">
            <FiTrendingUp className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-bold text-white">
              {symbol} Chart
            </h2>
          </div>
          <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium">
            {currency}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Timeframe Selector */}
          <div className="flex items-center space-x-2">
            <FiCalendar className="w-4 h-4 text-slate-400" />
            <div className="flex bg-slate-700/50 rounded-lg p-1">
              {timeframes.map((tf) => (
                <button
                  key={tf.value}
                  onClick={() => setTimeframe(tf.value)}
                  className={`px-3 py-1 text-sm font-medium rounded transition-all duration-200 ${
                    timeframe === tf.value
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : 'text-slate-400 hover:text-emerald-400'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg bg-slate-700/50 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 transition-all duration-200"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            <FiMaximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="p-6">
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
          <CanvasJSStockChart options={options} />
        </div>
      </div>

      {/* Chart Statistics */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {formattedData.length > 0 && (() => {
            const latest = formattedData[formattedData.length - 1];
            const [open, high, low, close] = latest.y;
            return (
              <>
                <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                  <div className="text-slate-400 text-sm">Open</div>
                  <div className="text-white font-semibold">{open}</div>
                </div>
                <div className="text-center p-3 bg-emerald-500/10 rounded-lg">
                  <div className="text-slate-400 text-sm">High</div>
                  <div className="text-emerald-400 font-semibold">{high}</div>
                </div>
                <div className="text-center p-3 bg-red-500/10 rounded-lg">
                  <div className="text-slate-400 text-sm">Low</div>
                  <div className="text-red-400 font-semibold">{low}</div>
                </div>
                <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                  <div className="text-slate-400 text-sm">Close</div>
                  <div className="text-white font-semibold">{close}</div>
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsFullscreen(false)}
        />
      )}
    </div>
  );
};

export default Chart;