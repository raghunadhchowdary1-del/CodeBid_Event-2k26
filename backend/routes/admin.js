const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const User = require('../models/User');
const Round = require('../models/Round');
const Bid = require('../models/Bid');

// @route   POST /api/admin/start-round
router.post('/start-round', [auth, admin], async (req, res) => {
  const { questionTitle, category } = req.body;
  try {
    await Round.updateMany({ isActive: true }, { isActive: false, endedAt: Date.now() });

    const round = new Round({
      isActive: true,
      questionTitle,
      category,
      startedAt: new Date()
    });
    await round.save();

    const io = require('../sockets/socketManager').getIO();
    io.emit('round-started', { questionTitle, category, duration: 20 });

    res.json({ msg: 'Bidding round started' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/admin/end-round
router.post('/end-round', [auth, admin], async (req, res) => {
  try {
    const activeRound = await Round.findOne({ isActive: true });
    if (!activeRound) return res.status(400).json({ msg: 'No active round' });

    // Get all teams (participants)
    const teams = await User.find({ role: 'team' }).select('_id');
    const teamIds = teams.map(t => t._id.toString());

    // Get bids already placed in this round
    const existingBids = await Bid.find({ round: activeRound._id }).select('team');
    const biddedTeamIds = existingBids.map(b => b.team.toString());

    // Create zero bids for teams that haven't bid
    const zeroBidPromises = teamIds
      .filter(id => !biddedTeamIds.includes(id))
      .map(teamId => {
        const bid = new Bid({
          team: teamId,
          round: activeRound._id,
          amount: 0,
          timestamp: new Date()
        });
        return bid.save();
      });

    await Promise.all(zeroBidPromises);

    // Determine winner (highest bid, earliest timestamp)
    const allBids = await Bid.find({ round: activeRound._id })
      .populate('team', 'teamName')
      .sort({ amount: -1, timestamp: 1 });

    const winner = allBids.length > 0 ? allBids[0] : null;

    activeRound.isActive = false;
    activeRound.endedAt = new Date();
    activeRound.winner = winner ? { team: winner.team._id, amount: winner.amount } : null;
    await activeRound.save();

    const io = require('../sockets/socketManager').getIO();
    io.emit('round-ended', {
      winner: winner ? {
        team: winner.team.teamName,
        id: winner.team._id,
        amount: winner.amount,
        roundId: activeRound._id   // <-- ADDED roundId for category lookup
      } : null
    });

    res.json({ msg: 'Round ended', winner });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/admin/bids
router.get('/bids', [auth, admin], async (req, res) => {
  try {
    const activeRound = await Round.findOne({ isActive: true });
    if (!activeRound) return res.json([]);

    const bids = await Bid.find({ round: activeRound._id })
      .populate('team', 'teamName')
      .sort({ amount: -1, timestamp: 1 });
    res.json(bids);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// @route   POST /api/admin/mark-result
router.post('/mark-result', [auth, admin], async (req, res) => {
  const { teamId, correct, bidAmount, roundId } = req.body; // now includes roundId

  try {
    const team = await User.findById(teamId);
    if (!team) return res.status(404).json({ msg: 'Team not found' });

    const round = await Round.findById(roundId);
    if (!round) return res.status(404).json({ msg: 'Round not found' });

    // Determine coin adjustment based on category
    let adjustment;
    switch (round.category) {
      case 'Easy':
        adjustment = correct ? 100 : -150;
        break;
      case 'Medium':
        adjustment = correct ? 200 : -250;
        break;
      case 'Hard':
        adjustment = correct ? 400 : -350;
        break;
      default:
        adjustment = 0;
    }

    team.coins += adjustment;
    await team.save();

    const io = require('../sockets/socketManager').getIO();
    io.emit('leaderboard-update');

    res.json({ msg: 'Result processed', newBalance: team.coins });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/admin/teams
router.get('/teams', [auth, admin], async (req, res) => {
  try {
    const teams = await User.find({ role: 'team' }).select('-password');
    res.json(teams);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// @route   POST /api/admin/reset-coins
router.post('/reset-coins', [auth, admin], async (req, res) => {
  try {
    await User.updateMany({ role: 'team' }, { coins: 2000 });
    const io = require('../sockets/socketManager').getIO();
    io.emit('leaderboard-update');
    res.json({ msg: 'All team coins reset to 2000' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;