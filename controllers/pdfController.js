const { generatePDF } = require('../utils/pdfGenerator');
const templateStore = require('../utils/templateStore');

/**
 * PDF Controller
 * Handles the HTTP request/response logic and delegates 
 * the PDF generation to the utility service.
 */

// 1. Generate PDF from raw HTML/CSS
exports.generatePDF = async (req, res) => {
  const { html, css, options } = req.body;

  if (!html) {
    return res.status(400).json({ 
      error: 'Invalid Request', 
      message: 'HTML content is required to generate a PDF.' 
    });
  }

  try {
    const pdfBuffer = await generatePDF(html, css, options);
    sendPdfResponse(res, pdfBuffer);
  } catch (error) {
    handleError(res, error);
  }
};

// 2. NEW: Generate PDF using a stored template
exports.generateFromTemplate = async (req, res) => {
  const { templateId, options } = req.body;

  try {
    // Retrieve template from memory store
    const template = templateStore.getTemplate(templateId);
    
    // Generate PDF using the stored HTML and CSS
    const pdfBuffer = await generatePDF(template.html, template.css, options);
    
    sendPdfResponse(res, pdfBuffer, `${template.name}.pdf`);
  } catch (error) {
    // If templateId isn't found, getTemplate throws an error which we catch here
    handleError(res, error);
  }
};

// --- Helper Functions to keep code DRY (Don't Repeat Yourself) ---

const sendPdfResponse = (res, buffer, filename = 'generated.pdf') => {
  res.contentType('application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.status(200).send(buffer);
};

const handleError = (res, error) => {
  console.error('Controller Error:', error.message);
  const statusCode = error.message.includes('not found') ? 404 : 500;
  res.status(statusCode).json({ 
    error: 'Generation Failed', 
    message: error.message 
  });
};