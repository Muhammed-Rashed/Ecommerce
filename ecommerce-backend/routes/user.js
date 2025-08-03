const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../utils/middleware/authMiddleWare');

// GET all users — admin only
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
