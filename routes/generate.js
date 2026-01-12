const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');

router.post('/generate', pdfController.generateFromTemplate);
router.post('/generate-html', pdfController.generateRawPDF);

module.exports = router;
