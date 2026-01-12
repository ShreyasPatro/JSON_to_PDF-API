const puppeteer = require('puppeteer');
const browserManager = require('./browserManager');

const generatePDF = async (html, css = '', options = {}) => {
  const browser = await browserManager.getBrowser();
  const page = await browser.newPage();
  
  try {
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head><style>${css}</style></head>
        <body>${html}</body>
      </html>
    `;

    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
    
    return await page.pdf({
      format: 'A4',
      printBackground: true,
      ...options
    });
  } finally {
    await page.close();
  }
};

module.exports = { generatePDF };