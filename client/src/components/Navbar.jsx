import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">
        <Link to="/" className="hover:text-blue-400">📈 StockSim</Link>
      </h1>

      <div className="flex gap-4 items-center">
        {user ? (
          <button
            onClick={handleLogout}
            className="border border-white px-3 py-1 rounded hover:bg-white hover:text-slate-900 transition"
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-400">Login</Link>
            <Link to="/register" className="hover:text-blue-400">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
