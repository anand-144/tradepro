const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
} = require('../controllers/watchlistController');

router.post('/add', auth, addToWatchlist);
router.delete('/remove/:symbol', auth, removeFromWatchlist);
router.get('/', auth, getWatchlist);

module.exports = router;
