const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const ADMIN_EMAILS = [
  '238w1a12a8@vrsec.ac.in',
  '238w1a1283@vrsec.ac.in',
  '238w1a12a7@vrsec.ac.in',
  '238w1a12a2@vrsec.ac.in'
];

// @route   POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { teamName, repName, email, password } = req.body;

  try {
    let user = await User.findOne({ $or: [{ email }, { teamName }] });
    if (user) return res.status(400).json({ msg: 'Team or email already exists' });

    const role = ADMIN_EMAILS.includes(email) ? 'admin' : 'team';

    user = new User({ teamName, repName, email, password, role });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, role: user.role });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    // Admin: skip password check if email is in admin list
    if (ADMIN_EMAILS.includes(email)) {
      // Admin can login with any password (or no password) – just check email exists
      const payload = { user: { id: user.id, role: user.role } };
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
        if (err) throw err;
        return res.json({ token, role: user.role });
      });
    } else {
      // Participant: password required
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

      const payload = { user: { id: user.id, role: user.role } };
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
        if (err) throw err;
        res.json({ token, role: user.role });
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;