const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('./config/config'); 

// Route Imports
const generateRoutes = require('./routes/generate');
const templateRoutes = require('./routes/templates');
const authRoutes = require('./routes/auth'); // New Auth Routes

// Middleware & Manager Imports
const authenticate = require('./middleware/auth'); // New Auth Middleware
const browserManager = require('./utils/browserManager'); 

const app = express();

// 1. Security Headers
app.use(helmet());

// 2. Enable CORS
app.use(cors());

// 3. Parse JSON bodies up to 10mb
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
      message: `You have exceeded the limit of ${config.rateLimit.max} requests per ${config.rateLimit.windowMs / 60000} minutes. Please try again later.`,
      status: 429
    });
  }
});

app.use('/api/', apiLimiter);

// 5. Health Check Endpoint (Public)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'UP', 
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv 
  });
});

// 6. Routes

// A. Auth Endpoints (Public - used to Register/Login)
app.use('/api/auth', authRoutes);

/**
 * PROTECTED ROUTES
 * The 'authenticate' middleware is added here.
 * Any request to these endpoints MUST include a valid JWT in the Header:
 * Authorization: Bearer <your_token>
 */

// B. Generation endpoints
app.use('/api', authenticate, generateRoutes); 

// C. Template management endpoints
app.use('/api/templates', authenticate, templateRoutes); 

// 7. Start Server
const server = app.listen(config.port, () => {
  console.log('---------------------------------------------------------');
  console.log(`Server running in [${config.nodeEnv}] mode`);
  console.log(`Access it at: http://localhost:${config.port}`);
  console.log(`Rate Limit: ${config.rateLimit.max} requests / ${config.rateLimit.windowMs / 60000} minutes`);
  console.log('---------------------------------------------------------');
});

// 8. Graceful Shutdown Handling
const gracefulShutdown = async (signal) => {
  console.info(`\n${signal} signal received.`);
  
  try {
    await browserManager.closeBrowser();
    
    server.close(() => {
      console.log('HTTP server and Browser closed. Process finished.');
      process.exit(0);
    });
  } catch (err) {
    console.error('Error during graceful shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));