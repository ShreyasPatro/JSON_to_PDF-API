const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userStore = require('../utils/userStore');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userStore.createUser(email, password);
    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    res.status(400).json({ error: 'Registration failed', message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = userStore.findByEmail(email);

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET || 'supersecret', { expiresIn: '1h' });
    const refreshToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET || 'supersecret', { expiresIn: '7d' });
    
    res.json({ token, refreshToken });
  } else {
    res.status(401).json({ error: 'Login failed', message: 'Invalid credentials' });
  }
});

module.exports = router;