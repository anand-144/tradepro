import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { path: '/dashbaord', label: 'Dashbaord' },
  { path: '/portfolio', label: 'Portfolio' },
  { path: '/trade', label: 'Trade' },
  { path: '/watchlist', label: 'Watchlist' },
  { path: '/transactions', label: 'Transactions' },
];

const MegaMenu = () => {
  const { pathname } = useLocation();

  return (
    <div className="bg-slate-800 text-white px-6 py-3 shadow-md flex gap-6">
      {navLinks.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={`transition hover:text-blue-400 ${
            pathname === link.path ? 'text-blue-400 font-semibold' : ''
          }`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
};

export default MegaMenu;
