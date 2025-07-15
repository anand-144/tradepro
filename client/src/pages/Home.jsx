import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white px-6 py-20 flex items-center justify-center relative overflow-hidden">
      
      {/* Background Orbs / Glow Effects */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-purple-600 opacity-30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-52 h-52 bg-blue-500 opacity-30 rounded-full blur-2xl animate-pulse" />
      <div className="absolute top-20 right-60 w-52 h-52 bg-yellow-500 opacity-30 rounded-full blur-2xl animate-pulse" />

      {/* Hero Content */}
      <div className="z-10 text-center max-w-2xl">
        <span className="text-xs uppercase bg-blue-500 text-white px-3 py-1 rounded-full inline-block mb-4">
          🔒 Secure & Fast
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
          Trade Stocks Seamlessly <br /> with <span className="text-blue-400">StockSim</span>
        </h1>
        <p className="text-gray-300 text-sm md:text-base mb-6">
          Simulate trades, manage your virtual portfolio, and learn stock market strategies — all in one platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-md text-white text-sm font-semibold"
          >
            Get Started
          </Link>
          <Link
            to="/dashboard"
            className="bg-gray-700 hover:bg-gray-800 transition px-6 py-3 rounded-md text-sm text-white"
          >
            View Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
