const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Use an environment variable for the secret, with a fallback
// IMPORTANT: This same secret must be used in your auth middleware
const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_JWT_SECRET';

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create the user
    await User.create({
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Generate JWT
    // We include id and email in the payload
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' } // Token lasts for 1 day
    );

    // Send the token back to the frontend
    res.json({ 
      token, 
      user: { id: user.id, email: user.email },
      message: "Login successful" 
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: error.message });
  }
};