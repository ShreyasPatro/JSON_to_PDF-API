require('dotenv').config();

// Define required environment variables for the app to function safely
const requiredVars = [
  'NODE_ENV',
  'RATE_LIMIT_WINDOW_MS',
  'RATE_LIMIT_MAX_REQUESTS'
];

// Check for missing variables immediately
requiredVars.forEach((name) => {
  if (!process.env[name]) {
    console.error(`\x1b[31m[CONFIG ERROR]: Missing required environment variable: ${name}\x1b[0m`);
    process.exit(1); 
  }
});

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV,
  rateLimit: {
    // 10 is the radix (base-10) to ensure proper integer parsing
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10),
  }
};

module.exports = config;