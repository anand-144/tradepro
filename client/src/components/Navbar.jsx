import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import { GiBullHorns } from "react-icons/gi";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setDropdownOpen(false);
    navigate('/login');
  };

  const hideSearch = ['/login', '/register'].includes(location.pathname);

  return (
    <nav
      className="
        sticky top-0 z-50
        px-6 py-3
        backdrop-blur-md
        text-white bg-slate-800/95  shadow
        flex items-center justify-between
        transition-all duration-300
      "
    >
      {/* Left: Logo */}
      <div className="text-xl font-bold tracking-wide">
        <Link to="/" className="flex items-center gap-2 text-white">
          <GiBullHorns size={25} />
          StockSim
        </Link>
      </div>


      {/* Center: Search bar (hidden on auth pages) */}
      {!hideSearch && (
        <div className="hidden md:flex items-center relative w-1/2">
          <input
            type="text"
            placeholder="Search stocks (e.g., AAPL, TSLA)"
            className="w-full px-4 py-2 rounded-md bg-gray-800 text-sm text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute right-3 top-2.5 text-gray-400" />
        </div>
      )}

      {/* Right: Profile dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 focus:outline-none"
        >
          <FaUserCircle size={22} />
          <span className="hidden sm:inline">My Account</span>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 bg-gray-600 text-black rounded shadow-md w-40 z-10">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 hover:bg-gray-500"
                  onClick={() => setDropdownOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 hover:bg-gray-500"
                  onClick={() => setDropdownOpen(false)}
                >
                  Settings
                </Link>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-500"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 hover:bg-gray-500"
                  onClick={() => setDropdownOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 hover:bg-gray-500"
                  onClick={() => setDropdownOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
