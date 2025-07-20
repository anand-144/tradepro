import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { FiTrendingUp } from 'react-icons/fi';

const Home = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-4 overflow-hidden">

        {/* 🌊 Gradient Wave Background */}
        <svg
          className="absolute inset-0 -z-10 opacity-25 animate-pulse blur-sm"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#0ea5e9"
            fillOpacity="0.4"
            d="M0,160L60,170.7C120,181,240,203,360,213.3C480,224,600,224,720,202.7C840,181,960,139,1080,117.3C1200,96,1320,96,1380,96L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          />
        </svg>

        {/* 🧠 Title + Subtitle */}
        <div className="text-center animate-fade-in-up">
          <div className="flex items-center justify-center mb-4 gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center shadow-md">
              <FiTrendingUp className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Welcome to TradePro
            </h1>
          </div>

          <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-xl mx-auto">
            Simulate real-time trading, grow your virtual portfolio, and master the stock market.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 flex-wrap justify-center">
            {user ? (
              <Link
                to="/dashboard"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-transparent border border-white hover:bg-white hover:text-slate-900 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
