const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userStore = require('../utils/userStore');

// 1. POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Uses your class-based UserStore to hash and save
    const user = await userStore.createUser(email, password);
    
    res.status(201).json({ 
      message: 'User registered successfully', 
      user 
    });
  } catch (err) {
    res.status(400).json({ 
      error: 'Registration failed', 
      message: err.message 
    });
  }
});

// 2. POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userStore.findByEmail(email);

    // Verify hashed password
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { id: user.id, email: user.email };
      const secret = process.env.JWT_SECRET || 'supersecret';

      const token = jwt.sign(payload, secret, { expiresIn: '1h' });
      const refreshToken = jwt.sign(payload, secret, { expiresIn: '7d' });
      
      res.json({ token, refreshToken });
    } else {
      res.status(401).json({ 
        error: 'Login failed', 
        message: 'Invalid email or password' 
      });
    }
  } catch (err) {
    res.status(500).json({ 
      error: 'Server Error', 
      message: 'An internal error occurred.' 
    });
  }
});

module.exports = router;