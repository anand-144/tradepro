const Watchlist = require('../models/Watchlist');

// ✅ Add a stock to watchlist
const addToWatchlist = async (req, res) => {
  const { symbol } = req.body;
  if (!symbol) return res.status(400).json({ message: 'Symbol is required' });

  const upperSymbol = symbol.toUpperCase();

  try {
    let watchlist = await Watchlist.findOne({ userId: req.user.id });
    if (!watchlist) {
      watchlist = new Watchlist({ userId: req.user.id, symbols: [] });
    }

    if (!watchlist.symbols.includes(upperSymbol)) {
      watchlist.symbols.push(upperSymbol);
      await watchlist.save();
      return res.status(200).json({
        message: `${upperSymbol} added to watchlist`,
        symbols: watchlist.symbols,
      });
    } else {
      return res.status(200).json({
        message: `${upperSymbol} already in watchlist`,
        symbols: watchlist.symbols,
      });
    }
  } catch (err) {
    console.error('Add to watchlist error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Remove a stock from watchlist
const removeFromWatchlist = async (req, res) => {
  const { symbol } = req.params;
  if (!symbol) return res.status(400).json({ message: 'Symbol is required' });

  const upperSymbol = symbol.toUpperCase();

  try {
    const watchlist = await Watchlist.findOne({ userId: req.user.id });
    if (!watchlist) {
      return res.status(404).json({ message: 'Watchlist not found' });
    }

    const updatedSymbols = watchlist.symbols.filter(s => s !== upperSymbol);
    watchlist.symbols = updatedSymbols;
    await watchlist.save();

    res.status(200).json({
      message: `${upperSymbol} removed from watchlist`,
      symbols: updatedSymbols,
    });
  } catch (err) {
    console.error('Remove from watchlist error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get user's watchlist
const getWatchlist = async (req, res) => {
  try {
    const watchlist = await Watchlist.findOne({ userId: req.user.id });
    res.status(200).json({
      symbols: watchlist ? watchlist.symbols : [],
    });
  } catch (err) {
    console.error('Get watchlist error:', err);
    res.status(500).json({ message: 'Error fetching watchlist' });
  }
};

module.exports = {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
};
