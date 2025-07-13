
const express = require('express');
const { query } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

// Search users by email (for sharing features)
router.get('/search', [
  query('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required')
], async (req, res) => {
  try {
    const { email } = req.query;
    
    const user = await User.findOne({ email }).select('name email');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Search user error:', error);
    res.status(500).json({ message: 'Error searching user' });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        preferences: req.user.preferences,
        createdAt: req.user.createdAt,
        lastLogin: req.user.lastLogin
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

module.exports = router;
