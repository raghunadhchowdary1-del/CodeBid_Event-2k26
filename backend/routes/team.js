const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Round = require('../models/Round');
const Bid = require('../models/Bid');

// @route   GET /api/team/me
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error('GET /me error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/team/bid
router.post('/bid', auth, async (req, res) => {
  // Log incoming data for debugging
  console.log('=== BID REQUEST ===');
  console.log('User from token:', req.user);
  console.log('Request body:', req.body);

  const { amount } = req.body;

  // Validate amount
  if (!amount || isNaN(amount) || amount <= 0) {
    console.log('Invalid amount:', amount);
    return res.status(400).json({ msg: 'Please provide a valid positive bid amount' });
  }

  try {
    // Check if round is active
    const activeRound = await Round.findOne({ isActive: true });
    console.log('Active round found:', activeRound ? activeRound._id : 'None');
    
    if (!activeRound) {
      return res.status(400).json({ msg: 'No active bidding round' });
    }

    // Check if team already bid in this round
    const existingBid = await Bid.findOne({ team: req.user.id, round: activeRound._id });
    console.log('Existing bid:', existingBid);
    
    if (existingBid) {
      return res.status(400).json({ msg: 'You have already placed a bid' });
    }

    // Get team details
    const team = await User.findById(req.user.id);
    console.log('Team found:', team ? team.teamName : 'Not found', 'Coins:', team ? team.coins : 'N/A');
    
    if (!team) {
      return res.status(404).json({ msg: 'Team not found' });
    }

    // Check sufficient coins
    if (team.coins < amount) {
      return res.status(400).json({ msg: 'Insufficient coins' });
    }

    // Create bid
    const bid = new Bid({
      team: req.user.id,
      round: activeRound._id,
      amount: parseInt(amount), // ensure number
      timestamp: new Date()
    });
    
    await bid.save();
    console.log('Bid saved successfully with ID:', bid._id);

    // Emit to admin
    const io = require('../sockets/socketManager').getIO();
    io.to('admin').emit('new-bid', { 
      team: team.teamName, 
      amount: bid.amount, 
      timestamp: bid.timestamp 
    });

    res.json({ msg: 'Bid placed successfully' });
  } catch (err) {
    console.error('!!! ERROR in /bid route !!!');
    console.error(err); // This will print the full stack trace
    res.status(500).json({ msg: 'Server error', error: err.message }); // Send error message to client
  }
});

// @route   GET /api/team/leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const teams = await User.find({ role: 'team' }).select('teamName coins').sort({ coins: -1 });
    res.json(teams);
  } catch (err) {
    console.error('Leaderboard error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;