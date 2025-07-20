import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiTrendingUp } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo + Title Combined */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
            <FiTrendingUp className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            TradePro
          </h1>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-slate-400 text-sm hidden sm:block">
                Welcome, <span className="text-white font-medium">{user.name}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium hover:text-blue-400 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
