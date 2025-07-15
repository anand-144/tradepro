const mongoose = require('mongoose');

const HoldingSchema = new mongoose.Schema({
  symbol: String,
  quantity: Number,
  avgPrice: Number,
}, { _id: false });

const PortfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  holdings: [HoldingSchema],
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', PortfolioSchema);
