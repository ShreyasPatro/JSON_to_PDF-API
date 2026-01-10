const { generatePDF } = require('../utils/pdfGenerator');
const templateStore = require('../utils/templateStore');
const processor = require('../utils/templateProcessor'); // Import the new processor

/**
 * PDF Controller
 * Handles the HTTP request/response logic and delegates 
 * the PDF generation to the utility service.
 */

// 1. Generate PDF from raw HTML/CSS (No template needed)
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

// 2. NEW & UPDATED: Generate PDF using a stored template with Dynamic Data
exports.generateFromTemplate = async (req, res) => {
  // Now extracting 'data' from the request body
  const { templateId, data, options } = req.body;

  try {
    // 1. Retrieve base template from memory store
    const template = templateStore.getTemplate(templateId);
    
    // 2. Process HTML: Replace {{variables}} with the provided data
    // This supports nested objects like {{user.name}}
    const processedHtml = processor.replaceVariables(template.html, data || {});
    
    // 3. Generate PDF using the processed HTML and original CSS
    const pdfBuffer = await generatePDF(processedHtml, template.css, options);
    
    sendPdfResponse(res, pdfBuffer, `${template.name}.pdf`);
  } catch (error) {
    handleError(res, error);
  }
};

// --- Helper Functions to keep code DRY ---

const sendPdfResponse = (res, buffer, filename = 'generated.pdf') => {
  res.contentType('application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.status(200).send(buffer);
};

const handleError = (res, error) => {
  console.error('Controller Error:', error.message);
  // Use 404 for missing templates, otherwise 500
  const statusCode = error.message.includes('not found') ? 404 : 500;
  res.status(statusCode).json({ 
    error: 'Generation Failed', 
    message: error.message 
  });
};