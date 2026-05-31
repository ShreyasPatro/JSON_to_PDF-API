const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // 1. Get the token from the Authorization header (Bearer <token>)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      error: 'Access Denied', 
      message: 'No token provided.' 
    });
  }

  try {
    // 2. VERIFICATION - This MUST match the secret in your authController
    // We use the same fallback string we put in the Controller
    const secret = process.env.JWT_SECRET || 'YOUR_JWT_SECRET';
    
    const verified = jwt.verify(token, secret);
    
    // 3. Attach the user data (id, email) to the request object
    req.user = verified;
    
    next();
  } catch (err) {
    // 4. Detailed error logging for development
    console.error("JWT Verification Error:", err.message);
    
    res.status(401).json({ 
      error: 'Invalid Token', 
      message: 'Token is expired or malformed.' 
    });
  }
};