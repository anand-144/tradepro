import React, { useEffect, useState } from 'react';
import CanvasJSReact from '@canvasjs/react-stockcharts';
import api from '../services/api';
import { useCurrency } from '../context/CurrencyContext';

const Chart = ({ symbol = 'AAPL' }) => {
  const { currency } = useCurrency();
  const [data, setData] = useState([]);
  const [conversionRate, setConversionRate] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/stocks/history/candle/${symbol}`);
        setData(res.data); // Format: [{ x, y: [open, high, low, close] }]
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load chart');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [symbol]);

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
      color: close >= open ? "#4ade80" : "#ef4444", // green if up, red if down
      borderColor: close >= open ? "#4ade80" : "#ef4444"
    };
  });

  if (loading) return <p className="text-white">Loading chart...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

const options = {
  theme: 'dark2',
  backgroundColor: "#1e293b", // Tailwind's slate-800
  exportEnabled: false,
  animationEnabled: true,
  charts: [{
    toolTip: {
      shared: true,
      backgroundColor: "#0f172a",
      borderColor: "#334155",
      fontColor: "#e2e8f0",
      contentFormatter: e => {
        const d = e.entries[0].dataPoint;
        const date = d.x.toDateString();
        const [o, h, l, c] = d.y;
        return `<strong>${symbol} - ${currency}</strong><br/>
          ${date}<br/>
          Open: ${o}<br/>
          High: ${h}<br/>
          Low: ${l}<br/>
          Close: ${c}`;
      }
    },
    axisX: {
      valueFormatString: "MMM DD",
      labelFontColor: "#e2e8f0", // 🔵 Brighter date labels
      lineColor: "#475569",
      tickColor: "#475569",
      gridColor: "#334155",
      labelFontSize: 12,
    },
    axisY: {
      prefix: '',
      title: `Price (${currency})`,
      titleFontColor: "#f1f5f9",
      labelFontColor: "#e2e8f0", // 🔵 Brighter price labels
      lineColor: "#475569",
      tickColor: "#475569",
      gridColor: "#334155",
      labelFontSize: 12,
    },
    data: [{
      type: "candlestick",
      risingColor: "#4ade80",   // ✅ green
      fallingColor: "#ef4444",  // ✅ red
      dataPoints: formattedData
    }]
  }]
};


  return (
    <div className="bg-slate-800 rounded shadow w-full max-w-6xl mx-auto p-4">
     <h2 className="text-xl font-bold text-cyan-400 mb-4">
  {symbol} Candlestick Chart ({currency})
</h2>

      <CanvasJSStockChart options={options} />
    </div>
  );
};

export default Chart;
