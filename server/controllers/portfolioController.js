const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const { getStockPrice } = require('../utils/twelveData');

const getPortfolio = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('balance');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const portfolio = await Portfolio.findOne({ userId: req.user.id });
    if (!portfolio) {
      return res.json({ balance: user.balance, holdings: [] }); // return empty if no portfolio
    }

    const enhancedHoldings = await Promise.all(
      portfolio.holdings.map(async (h) => {
        try {
          const priceData = await getStockPrice(h.symbol);
          if (!priceData?.price) throw new Error('Invalid price data');

          const currentPrice = priceData.price;
          const gainLossAbsolute = ((currentPrice - h.avgPrice) * h.quantity).toFixed(2);
          const gainLossPercent = (((currentPrice - h.avgPrice) / h.avgPrice) * 100).toFixed(2);

          return {
            ...h.toObject(),
            currentPrice,
            gainLossAbsolute: parseFloat(gainLossAbsolute),
            gainLossPercent: parseFloat(gainLossPercent),
          };
        } catch (innerErr) {
          console.error(`Error fetching price for ${h.symbol}:`, innerErr);
          return {
            ...h.toObject(),
            currentPrice: h.avgPrice,
            gainLossAbsolute: 0,
            gainLossPercent: 0,
          };
        }
      })
    );

    res.json({
      balance: user.balance,
      holdings: enhancedHoldings,
    });
  } catch (err) {
    console.error('Error in getPortfolio:', err);
    res.status(500).json({ message: 'Error fetching portfolio' });
  }
};

module.exports = { getPortfolio };
