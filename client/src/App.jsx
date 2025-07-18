import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar'
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>               {/* ✅ Auth context wrapper */}
      <BrowserRouter>           {/* ✅ Router wrapper */}
        <Navbar />              {/* ✅ Has access to useAuth() */}
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
