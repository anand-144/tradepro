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
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  message: '⚠️ Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 10 });

app.use(limiter);

// Routes (will add soon)
app.get("/", (req, res) => res.send("API is running..."));

app.use('/api/auth', authLimiter , authRoutes);
app.use('/api/trade', tradeRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/stocks', limiter ,stockRoutes);
app.use('/api/watchlist', watchlistRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
