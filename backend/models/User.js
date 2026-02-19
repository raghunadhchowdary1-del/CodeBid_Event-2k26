const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  teamName: { type: String, required: true, unique: true },
  repName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  coins: { type: Number, default: 2000 },
  role: { type: String, default: 'team' } // 'team' or 'admin'
});

module.exports = mongoose.model('User', UserSchema);