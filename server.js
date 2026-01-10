const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('./config/config'); 
const generateRoutes = require('./routes/generate'); // Updated for generation logic
const templateRoutes = require('./routes/templates'); // For CRUD management
const browserManager = require('./utils/browserManager'); 

const app = express();

// 1. Security Headers
app.use(helmet());

// 2. Enable CORS
app.use(cors());

// 3. Parse JSON bodies up to 10mb
app.use(express.json({ limit: '10mb' }));

// 4. Rate Limiting (Applied specifically to /api/ routes)
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

// 5. Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'UP', 
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv 
  });
});

// 6. Routes
// Mount generation endpoints (POST /api/generate and POST /api/generate-html)
app.use('/api', generateRoutes); 

// Mount template management endpoints (GET, POST, PUT, DELETE /api/templates)
app.use('/api/templates', templateRoutes); 

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
    // Close the shared browser instance first
    await browserManager.closeBrowser();
    
    // Then close the HTTP server
    server.close(() => {
      console.log('HTTP server and Browser closed. Process finished.');
      process.exit(0);
    });
  } catch (err) {
    console.error('Error during graceful shutdown:', err);
    process.exit(1);
  }
};

// Listen for termination signals (Ctrl+C or System Kill)
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));