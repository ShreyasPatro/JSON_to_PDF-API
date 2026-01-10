const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');

/**
 * PDF Generation Routes
 * Handles the conversion of templates or raw HTML into PDF files.
 */

// 1. POST /api/generate
// - Generates a PDF using a stored template and dynamic data injection.
// - Body: { templateId, data, options }
router.post('/generate', async (req, res, next) => {
    const { templateId } = req.body;

    // Validation: Ensure templateId is provided
    if (!templateId) {
        return res.status(400).json({
            error: 'Validation Failed',
            message: 'A "templateId" is required to generate from a template.'
        });
    }

    // Hand off to controller
    return pdfController.generateFromTemplate(req, res);
});

// 2. POST /api/generate-html
// - Generates a PDF directly from provided HTML and CSS strings.
// - Body: { html, css, options }
router.post('/generate-html', async (req, res, next) => {
    const { html } = req.body;

    // Validation: Ensure HTML content is provided
    if (!html) {
        return res.status(400).json({
            error: 'Validation Failed',
            message: 'The "html" field is required for direct generation.'
        });
    }

    // Hand off to controller
    return pdfController.generatePDF(req, res);
});

module.exports = router;