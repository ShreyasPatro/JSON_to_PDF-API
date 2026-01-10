const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const templateStore = require('../utils/templateStore'); 

// 1. PDF Generation Endpoints
router.post('/generate', pdfController.generatePDF);
router.post('/generate-template', pdfController.generateFromTemplate);

// 2. Template Management Endpoints
router.post('/templates', (req, res) => {
    const { id, name, html, css } = req.body;
    try {
        const template = templateStore.createTemplate(id, name, html, css);
        res.status(201).json(template);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/templates', (req, res) => {
    res.json(templateStore.getAllTemplates());
});

// CRITICAL: This MUST be the very last line of the file
module.exports = router;