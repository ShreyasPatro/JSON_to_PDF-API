const browserManager = require('./browserManager');

/**
 * Generates a PDF buffer from HTML and CSS.
 * @param {string} html - The HTML body content.
 * @param {string} css - Optional CSS string to style the document.
 * @param {object} options - Puppeteer PDF options (format, landscape, margin, etc.)
 * @returns {Promise<Buffer>} - The generated PDF as a buffer.
 */
const generatePDF = async (html, css = '', options = {}) => {
  let page;
  try {
    // 1. Combine HTML and CSS into a full document structure
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            ${css}
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

    // 2. Get the singleton browser instance
    const browser = await browserManager.getBrowser();
    
    // 3. Open a new tab
    page = await browser.newPage();

    // 4. Load the HTML content
    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

    // 5. Merge default options with user-provided overrides
    const pdfOptions = {
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      },
      ...options // Overrides (e.g., landscape: true, format: 'Letter')
    };

    // 6. Generate and return the buffer
    const pdfBuffer = await page.pdf(pdfOptions);
    return pdfBuffer;

  } catch (error) {
    console.error('[PDF GENERATOR ERROR]:', error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  } finally {
    // 7. Ensure the tab is closed even if an error occurs
    if (page) {
      await page.close();
    }
  }
};

module.exports = { generatePDF };