import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-4 overflow-hidden">

      {/* 🌊 Animated SVG Wave Grid */}
      <svg
        className="absolute inset-0 -z-10 opacity-20 animate-pulse"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#38bdf8"
          fillOpacity="0.3"
          d="M0,160L60,170.7C120,181,240,203,360,213.3C480,224,600,224,720,202.7C840,181,960,139,1080,117.3C1200,96,1320,96,1380,96L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
        />
      </svg>

      {/* 🧠 Title & CTA */}
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
        📈 Welcome to StockSim
      </h1>
      <p className="text-lg md:text-xl mb-8 text-center max-w-xl">
        Simulate real trading, grow your virtual portfolio, and learn stock market fundamentals.
      </p>

      <div className="flex gap-4 flex-wrap justify-center">
        {user ? (
          <Link
            to="/dashbaord"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded shadow transition"
          >
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded shadow transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-transparent border border-white hover:bg-white hover:text-slate-900 text-white font-medium px-6 py-3 rounded shadow transition"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
