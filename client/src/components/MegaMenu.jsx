import React, { useEffect, useState } from 'react';
import {
  FiMenu,
  FiX,
  FiTrendingUp,
  FiDollarSign,
  FiBarChart2,
  FiLogOut
} from 'react-icons/fi';
import { FaLetterboxd } from "react-icons/fa6";
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

const MegaMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout ,refreshUser } = useAuth();
  const { currency, setCurrency } = useCurrency();

  const menuItems = [
    { icon: FiTrendingUp, label: 'Dashboard', path: '/dashboard' },
    { icon: FiBarChart2, label: 'Portfolio', path: '/portfolio' },
    { icon: FiDollarSign, label: 'Trading', path: '/trade' },
    { icon: FaLetterboxd, label: 'Watchlist', path: '/watchlist' }
  ];

  const currencies = ['USD', 'INR', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];

  useEffect(() => {
  refreshUser();
}, []);

  return (
    <nav className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={"/"}>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
                <FiTrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                TradePro
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-300 hover:text-emerald-400 hover:bg-slate-700/50'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}

            {/* Currency Selector */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-slate-700 text-slate-300 px-3 py-1 rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            >
              {currencies.map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>

            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="text-right text-sm">
                <div className="text-slate-300">{user?.name}</div>
                <div className="text-emerald-400 font-medium">
                  ${user?.balance?.toLocaleString()}
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-semibold">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <button
                onClick={logout}
                className="text-slate-400 hover:text-red-400 transition-colors duration-200"
                title="Logout"
              >
                <FiLogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-slate-700 inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-600 transition-colors duration-200"
            >
              {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50">
          <div className="p-4 space-y-4">
            {menuItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-2 w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'text-slate-300 hover:text-emerald-400 hover:bg-slate-700/50'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}

            {/* Currency Selector */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-slate-700 text-slate-300 px-3 py-2 rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            >
              {currencies.map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>

            {/* User Info + Logout */}
            <div className="flex justify-between items-center border-t border-slate-700 pt-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <div className="text-base font-medium text-white">{user?.name}</div>
                  <div className="text-sm font-medium text-emerald-400">
                    ${user?.balance?.toLocaleString()}

                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="text-red-400 hover:text-red-500"
              >
                <FiLogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default MegaMenu;
