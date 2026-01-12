const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');

/**
 * PDF Generation Routes
 */

// 1. Synchronous Generation (Waits for PDF to be created)
router.post('/generate', pdfController.generateFromTemplate);
router.post('/generate-html', pdfController.generateRawPDF);

// 2. Asynchronous Generation (Returns Job ID immediately)
// Use this for large PDFs or high-traffic scenarios
router.post('/generate-async', pdfController.generateAsync);

// 3. Job Management
// Check the status of an async job or get the download link
router.get('/job/:id', pdfController.getJobStatus);

module.exports = router;
