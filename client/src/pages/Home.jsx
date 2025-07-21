import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { FiTrendingUp } from 'react-icons/fi';


const Home = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-4 overflow-hidden">

        <img
          src="/HeroBg.jpeg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover opacity-6 z-0"
        />


        {/* 🧠 Title + Subtitle */}
        <div className="relative z-10 text-center animate-fade-in-up">
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
