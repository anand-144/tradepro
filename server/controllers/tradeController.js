const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { getStockPrice } = require('../utils/alphaVantage');

const buyStock = async (req, res) => {
  const { symbol, quantity } = req.body;
  if (!symbol || !quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Invalid symbol or quantity' });
  }

  try {
    const user = await User.findById(req.user.id);
    const priceData = await getStockPrice(symbol);
    const totalCost = priceData.price * quantity;

    if (user.balance < totalCost) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    user.balance -= totalCost;
    await user.save();

    let portfolio = await Portfolio.findOne({ userId: user._id }) || new Portfolio({ userId: user._id, holdings: [] });

    const holding = portfolio.holdings.find(h => h.symbol === symbol.toUpperCase());
    if (holding) {
      const totalShares = holding.quantity + quantity;
      holding.avgPrice = ((holding.avgPrice * holding.quantity) + totalCost) / totalShares;
      holding.quantity = totalShares;
    } else {
      portfolio.holdings.push({
        symbol: symbol.toUpperCase(),
        quantity,
        avgPrice: priceData.price,
      });
    }

    await portfolio.save();

    await Transaction.create({
      userId: user._id,
      symbol: symbol.toUpperCase(),
      quantity,
      price: priceData.price,
      type: 'BUY',
    });

    res.json({ message: 'Stock purchased', balance: user.balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const sellStock = async (req, res) => {
  const { symbol, quantity } = req.body;
  if (!symbol || !quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Invalid symbol or quantity' });
  }

  try {
    const user = await User.findById(req.user.id);
    const portfolio = await Portfolio.findOne({ userId: user._id });
    if (!portfolio) return res.status(400).json({ message: 'No holdings found' });

    const holding = portfolio.holdings.find(h => h.symbol === symbol.toUpperCase());
    if (!holding || holding.quantity < quantity) {
      return res.status(400).json({ message: 'Not enough shares to sell' });
    }

    const priceData = await getStockPrice(symbol);
    const totalSale = priceData.price * quantity;

    user.balance += totalSale;
    await user.save();

    holding.quantity -= quantity;
    if (holding.quantity === 0) {
      portfolio.holdings = portfolio.holdings.filter(h => h.symbol !== symbol.toUpperCase());
    }

    await portfolio.save();

    await Transaction.create({
      userId: user._id,
      symbol: symbol.toUpperCase(),
      quantity,
      price: priceData.price,
      type: 'SELL',
    });

    res.json({ message: 'Stock sold', balance: user.balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { buyStock, sellStock };
