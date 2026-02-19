const mongoose = require('mongoose');

const BidSchema = new mongoose.Schema({
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  round: { type: mongoose.Schema.Types.ObjectId, ref: 'Round' },
  amount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bid', BidSchema);