const puppeteer = require('puppeteer');

let browserInstance = null;

/**
 * Manages the Puppeteer browser instance using a Singleton pattern.
 */
const getBrowser = async () => {
  try {
    if (browserInstance && browserInstance.connected) {
      return browserInstance;
    }

    console.log('Starting a new Puppeteer browser instance...');

    /**
     * DOCKER ADAPTATION:
     * In Docker (Alpine), we use the system-installed Chromium.
     * Locally, we let Puppeteer use its default path.
     */
    const isDocker = process.env.PUPPETEER_EXECUTABLE_PATH;
    
    const launchOptions = {
      headless: 'new',
      // If the environment variable is set (Docker), use that path. 
      // Otherwise, use Puppeteer's default.
      executablePath: isDocker || puppeteer.executablePath(),
      args: [
        '--no-sandbox',                
        '--disable-setuid-sandbox',    
        '--disable-dev-shm-usage', // Important: Docker containers often have limited shared memory (/dev/shm)
        '--disable-gpu',               
        '--no-zygote',
        '--remote-debugging-port=9222' 
      ],
      ignoreHTTPSErrors: true
    };

    browserInstance = await puppeteer.launch(launchOptions);

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