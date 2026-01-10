const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access Denied', message: 'No token provided.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid Token', message: 'Token is expired or malformed.' });
  }
};