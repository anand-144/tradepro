// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();




const authRoutes = require('./routes/auth')
const tradeRoutes = require('./routes/trade')
const portfolioRoutes = require('./routes/portfolio');
const transactionRoutes = require('./routes/transactions');
const stockRoutes = require('./routes/stocks');
const watchlistRoutes = require('./routes/watchlist');
const currencyRoutes = require('./routes/currency');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173' || 'https://tradepro-phi.vercel.app',
  credentials: true,
}));

app.use(cookieParser());

// Routes (will add soon)
app.get("/", (req, res) => res.send("API is running..."));

app.use('/api/auth',  authRoutes);
app.use('/api/trade', tradeRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/currency', currencyRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
