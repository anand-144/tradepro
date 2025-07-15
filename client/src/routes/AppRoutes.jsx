
import { Routes, Route } from 'react-router-dom'; // ✅ Add this line

import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Navbar from '../components/Navbar';

const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </>
  );
};

export default AppRoutes;
