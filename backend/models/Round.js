const mongoose = require('mongoose');

const RoundSchema = new mongoose.Schema({
  isActive: { type: Boolean, default: false },
  questionTitle: { type: String, default: '' },
  category: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
  startedAt: Date,
  endedAt: Date,
  winner: {
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: Number
  }
});

module.exports = mongoose.model('Round', RoundSchema);