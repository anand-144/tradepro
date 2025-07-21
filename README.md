# 📈 TradePro - Stock Market Simulation Platform

**TradePro** is a full-stack web application that simulates real-time stock trading. It provides a dynamic and interactive platform for users to experience trading with virtual money, track their portfolio, analyze market trends, and manage watchlists — all in real-time.

---

## 🌐 Live Demo

[🔗 Visit TradePro](https://tradepro-phi.vercel.app/)  

---

## ⚙️ Tech Stack

### Frontend
- **React + Vite**
- **Tailwind CSS**
- **GSAP / REACT-BITS** for animations
- **React Router**
- **ApexCharts** for charting
- **JWT Auth (Access + Refresh tokens)**
- **Context API** for auth and currency management

### Backend
- **Node.js + Express**
- **MongoDB / Mongoose**
- **Twelve Data** for stock data
- **CurrencyAPI** for currency conversion
- **In-memory caching** for efficient API usage
- **JWT Authentication**
- **CORS + Cookie-based secure tokens**

---

## 📸 Screenshot

![Dashboard](https://jmp.sh/s/X48AOfA8e0HzKRvZacmQ)

---

## 🧩 Features

- 🔐 Secure JWT authentication with refresh tokens
- 📊 Real-time stock prices, charting, and market status
- 💸 Simulated trading, portfolio tracking, and gain/loss analytics
- 🔎 Transactions history with filtering & search
- ⭐ Watchlist support
- 🌐 Multi-currency conversion (USD, INR, EUR, etc.)
- 📥 Export portfolio to CSV
- ⚡ Caching and refresh control to optimize API usage

---

## 🚀 Getting Started

### 📦 Clone the Repo
```bash
git clone https://github.com/anand-144/tradepro.git
cd tradepro

 🔧 Setup Environment
Create .env files in both /client and /server folders.

/client/.env
VITE_API_URL=http://localhost:5000/api

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
REFRESH_SECRET=your_refresh_secret
TWELVE_DATA_API_KEY=your_twelve_key
CURRENCY_API_KEY=your_currency_api_key

▶️ Run Backend

cd server
npm install
npm run dev

▶️ Run Frontend

cd client
npm install
npm run dev

📜 License
This project is licensed under the MIT License.
Made with 💻 and 📈 by @anand-144

