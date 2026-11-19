const express = require('express');
const User = require('../models/User');
const { protect, adminOnly, generateToken } = require('../middleware/auth');

const router = express.Router();

const sanitize = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  createdAt: user.createdAt,
});

// @route   POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    if (await User.findOne({ email: email.toLowerCase() })) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const user = await User.create({ name, email, password, phone, role: 'user' });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token: generateToken(user._id),
      user: sanitize(user),
    });
  } catch (error) {
    return next(error);
  }
};

// @route   POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    return res.json({
      success: true,
      message: `Welcome back, ${user.name.split(' ')[0]}!`,
      token: generateToken(user._id),
      user: sanitize(user),
    });
  } catch (error) {
    return next(error);
  }
};

// @route   GET /api/auth/me
const getMe = async (req, res) =>
  res.json({ success: true, user: sanitize(req.user) });

// @route   PUT /api/auth/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, password } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
      }
      user.password = password;
    }

    await user.save();
    return res.json({ success: true, message: 'Profile updated', user: sanitize(user) });
  } catch (error) {
    return next(error);
  }
};

// @route   GET /api/auth/admin-check (utility used by the UI)
const adminCheck = [protect, adminOnly, (req, res) => res.json({ success: true, isAdmin: true })];

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.get('/admin-check', ...adminCheck);

module.exports = router;
