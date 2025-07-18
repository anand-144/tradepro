const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const { getStockPrice } = require('../utils/twelveData');

const getPortfolio = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('balance');
    const portfolio = await Portfolio.findOne({ userId: req.user.id });

    const enhancedHoldings = await Promise.all(
      (portfolio?.holdings || []).map(async (h) => {
        const priceData = await getStockPrice(h.symbol);
        const currentPrice = priceData.price;

        const gainLossAbsolute = ((currentPrice - h.avgPrice) * h.quantity).toFixed(2);
        const gainLossPercent = (((currentPrice - h.avgPrice) / h.avgPrice) * 100).toFixed(2);

        return {
          ...h.toObject(),
          currentPrice,
          gainLossAbsolute: parseFloat(gainLossAbsolute),
          gainLossPercent: parseFloat(gainLossPercent),
        };
      })
    );

    res.json({
      balance: user.balance,
      holdings: enhancedHoldings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching portfolio' });
  }
};

module.exports = { getPortfolio };
