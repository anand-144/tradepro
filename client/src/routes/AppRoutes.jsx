import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from '../pages/Home';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';

import Portfolio from '../pages/Dashboard/Portfolio';
import Trade from '../pages/Dashboard/Trade';
import Watchlist from '../pages/Dashboard/Watchlist';
import Transactions from '../pages/Dashboard/Transactions';
import StockDetails from '../pages/Dashboard/StockDetails';

import ProtectedRoute from '../components/ProtectedRoute';
import Dashboard from '../pages/Dashboard/Dashbaord';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/trade" element={<Trade />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/stocks/:symbol" element={<StockDetails />} />
      </Route>

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
