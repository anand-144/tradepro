const Watchlist = require('../models/Watchlist');

// Add a stock to watchlist
const addToWatchlist = async (req, res) => {
  const { symbol } = req.body;
  if (!symbol) return res.status(400).json({ message: 'Symbol is required' });

  try {
    let watchlist = await Watchlist.findOne({ userId: req.user.id });
    if (!watchlist) {
      watchlist = new Watchlist({ userId: req.user.id, symbols: [] });
    }

    if (!watchlist.symbols.includes(symbol.toUpperCase())) {
      watchlist.symbols.push(symbol.toUpperCase());
      await watchlist.save();
    }

    res.json({ message: 'Added to watchlist', watchlist: watchlist.symbols });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove a stock from watchlist
const removeFromWatchlist = async (req, res) => {
  const { symbol } = req.params;

  try {
    const watchlist = await Watchlist.findOne({ userId: req.user.id });
    if (!watchlist) return res.status(404).json({ message: 'Watchlist not found' });

    watchlist.symbols = watchlist.symbols.filter(s => s !== symbol.toUpperCase());
    await watchlist.save();

    res.json({ message: 'Removed from watchlist', watchlist: watchlist.symbols });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's watchlist
const getWatchlist = async (req, res) => {
  try {
    const watchlist = await Watchlist.findOne({ userId: req.user.id });
    res.json({ symbols: watchlist ? watchlist.symbols : [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching watchlist' });
  }
};

module.exports = {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
};
