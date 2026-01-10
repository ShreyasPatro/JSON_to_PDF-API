const puppeteer = require('puppeteer');

let browserInstance = null;

/**
 * Manages the Puppeteer browser instance using a Singleton pattern.
 */
const getBrowser = async () => {
  try {
    // If a browser already exists and is still connected, return it
    if (browserInstance && browserInstance.connected) {
      return browserInstance;
    }

    console.log('Starting a new Puppeteer browser instance...');

    // Launch a new browser instance with optimized flags
    browserInstance = await puppeteer.launch({
      headless: 'new',
      // CRITICAL: Force Puppeteer to use its own downloaded browser
      executablePath: puppeteer.executablePath(), 
      args: [
        '--no-sandbox',                
        '--disable-setuid-sandbox',    
        '--disable-dev-shm-usage',     
        '--disable-gpu',               
        //'--no-first-run',
        '--no-zygote',
       // '--single-process',
        '--remote-debugging-port=9222' 
      ],
      ignoreHTTPSErrors: true
    });

    // Listen for unexpected disconnects
    browserInstance.on('disconnected', () => {
      console.warn('Puppeteer browser disconnected. Resetting instance.');
      browserInstance = null;
    });

    return browserInstance;
  } catch (error) {
    console.error('FAILED TO LAUNCH BROWSER:', error);
    browserInstance = null;
    throw error;
  }
};

/**
 * Closes the browser instance gracefully.
 */
const closeBrowser = async () => {
  if (browserInstance) {
    console.log('Closing Puppeteer browser...');
    await browserInstance.close();
    browserInstance = null;
  }
};

module.exports = {
  getBrowser,
  closeBrowser
};