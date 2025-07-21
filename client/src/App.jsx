import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />

        {/* ✅ Copyright */}
        <div className="fixed bottom-2 right-2 text-xs text-gray-500 bg-white/80 px-3 py-1 rounded-md shadow-sm z-50">
          © {new Date().getFullYear()} TradePro by Anand Singh
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
