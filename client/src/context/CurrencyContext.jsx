// context/CurrencyContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('USD');
  const [rate, setRate] = useState(1); // default 1:1 for USD

  useEffect(() => {
    const fetchRate = async () => {
      if (currency === 'USD') return setRate(1);

      try {
        const res = await api.get(`/currency/${currency}`);
        setRate(res.data.rate || 1);
      } catch (err) {
        console.error('Currency conversion failed:', err);
        setRate(1); // fallback
      }
    };

    fetchRate();
  }, [currency]);

  const convertCurrency = (amount) => {
    return parseFloat((amount * rate).toFixed(2));
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
