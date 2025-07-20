import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiUser, FiMail, FiLock, FiUserPlus, FiLogIn, FiEye, FiEyeOff
} from 'react-icons/fi';
import Squares from '../../animations/Squares';

const getPasswordStrength = (password) => {
  if (password.length < 6) return { label: 'Too short', color: 'text-red-500' };
  if (password.length < 8) return { label: 'Weak', color: 'text-red-500' };

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  const checks = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;

  if (checks >= 3) return { label: 'Strong', color: 'text-green-500' };
  if (checks === 2) return { label: 'Moderate', color: 'text-yellow-500' };

  return { label: 'Weak', color: 'text-red-500' };
};

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-slate-900 text-white px-4 overflow-hidden">

      {/* 🔲 Squares Background */}
      <div className="absolute inset-0 z-0">
        <Squares
          speed={0.5}
          squareSize={40}
          direction="diagonal"
          borderColor="#ffffff"
          hoverFillColor="#800080"
        />
      </div>

      {/* 📝 Registration Card */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-slate-800 backdrop-blur-md border border-slate-700 p-8 rounded-xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Create an Account
        </h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <div className="relative mb-4">
          <FiUser className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Name"
            className="w-full px-10 py-3 rounded-lg bg-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-slate-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="relative mb-4">
          <FiMail className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-10 py-3 rounded-lg bg-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-slate-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="relative mb-2">
          <FiLock className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="w-full px-10 py-3 rounded-lg bg-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-slate-400"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError('');
            }}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        {password && (
          <div className={`text-xs font-medium mt-1 mb-4 text-right ${strength.color}`}>
            Strength: {strength.label}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 py-3 rounded-lg text-white font-semibold transition"
        >
          <div className="flex items-center justify-center gap-2">
            <FiUserPlus />
            Register
          </div>
        </button>

        <p className="text-sm text-center mt-6 text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:underline inline-flex items-center gap-1">
            <FiLogIn className="inline w-4 h-4" />
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
