const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('./config/config'); 

// Route Imports
const generateRoutes = require('./routes/generate');
const templateRoutes = require('./routes/templates');
const authRoutes = require('./routes/auth');

// Middleware & Manager Imports
const authenticate = require('./middleware/auth');
const browserManager = require('./utils/browserManager'); 

const app = express();

// 1. Security Headers
app.use(helmet());

// 2. Enable CORS
app.use(cors());

// 3. Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// 4. Rate Limiting
const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true, 
  legacyHeaders: false,  
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      message: `Limit exceeded. Please try again later.`,
      status: 429
    });
  }
});
app.use('/api/', apiLimiter);

// 5. Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', environment: config.nodeEnv });
});

// 6. Routes
app.use('/api/auth', authRoutes); // Public
app.use('/api', authenticate, generateRoutes); // Protected
app.use('/api/templates', authenticate, templateRoutes); // Protected

// 7. Start Server
const server = app.listen(config.port, () => {
  console.log('---------------------------------------------------------');
  console.log(`Server running at: http://localhost:${config.port}`);
  console.log('---------------------------------------------------------');
});

// 8. Graceful Shutdown
const gracefulShutdown = async (signal) => {
  console.info(`\n${signal} signal received.`);
  try {
    await browserManager.closeBrowser();
    server.close(() => {
      console.log('HTTP server closed. Process finished.');
      process.exit(0);
    });
  } catch (err) {
    process.exit(1);
  }
};
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));