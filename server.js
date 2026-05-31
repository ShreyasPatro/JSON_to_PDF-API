require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('./config/config'); 
const sequelize = require('./config/database'); 

// Model Imports (Ensures they are registered for syncing)
require('./models/User');
require('./models/Job'); 
require('./models/Template');

// Route Imports
const generateRoutes = require('./routes/generate');
const templateRoutes = require('./routes/templates');
const authRoutes = require('./routes/auth');

// Middleware & Manager Imports
const authenticate = require('./middleware/auth');
const browserManager = require('./utils/browserManager'); 

const app = express();
let server; // Define server variable in higher scope for graceful shutdown

// 1. Security Headers
app.use(helmet());

// 2. Enable CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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

// 7. Sync Database and Start Server
sequelize.sync({ alter: true })
  .then(() => {
    console.log('---------------------------------------------------------');
    console.log('✅ Database & Tables Synced');
    server = app.listen(config.port, () => {
      console.log(`🚀 Server running at: http://localhost:${config.port}`);
      console.log(`🌐 CORS enabled for: http://localhost:5173`);
      console.log('---------------------------------------------------------');
    });
  })
  .catch(err => {
    console.error('❌ Failed to sync database:', err);
    process.exit(1);
  });

// 8. Graceful Shutdown
const gracefulShutdown = async (signal) => {
  console.info(`\n${signal} signal received.`);
  try {
    // Close browser manager (Puppeteer/Playwright)
    await browserManager.closeBrowser();
    
    if (server) {
      server.close(() => {
        console.log('🛑 HTTP server closed.');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('⚠️ Error during shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));