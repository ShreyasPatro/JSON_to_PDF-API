const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const authenticate = require('../middleware/auth'); // Import the middleware

/**
 * PDF Generation Routes (Protected by Auth)
 */

// 1. Synchronous Generation (Waits for PDF to be created)
// Now extracts user context from the token via 'authenticate'
router.post('/generate', authenticate, pdfController.generateFromTemplate);
router.post('/generate-html', authenticate, pdfController.generateRawPDF);

// 2. Asynchronous Generation (Returns Job ID immediately)
router.post('/generate-async', authenticate, pdfController.generateAsync);

// 3. Job Management
// Fetch all jobs belonging specifically to the logged-in user for the dashboard
router.get('/jobs', authenticate, pdfController.getUserJobs);

// Check status/download link for a specific job
router.get('/job/:id', authenticate, pdfController.getJobStatus);

module.exports = router;