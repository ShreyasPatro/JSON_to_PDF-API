const express = require('express');
const router = express.Router();
const templateStore = require('../utils/templateStore');

/**
 * Middleware: Input Validation
 * Ensures required fields are present before hitting the store logic.
 */
const validateTemplate = (req, res, next) => {
  const { id, name, html } = req.body;
  if (!id || !name || !html) {
    return res.status(400).json({
      error: 'Validation Failed',
      message: 'Fields "id", "name", and "html" are required.'
    });
  }
  next();
};

// 1. POST /api/templates - Create new template
router.post('/', validateTemplate, (req, res) => {
  const { id, name, html, css } = req.body;
  try {
    const template = templateStore.createTemplate(id, name, html, css);
    res.status(201).json({
      message: 'Template created successfully',
      data: template
    });
  } catch (err) {
    res.status(409).json({ error: 'Conflict', message: err.message });
  }
});

// 2. GET /api/templates - List all templates
router.get('/', (req, res) => {
  try {
    const templates = templateStore.getAllTemplates();
    res.status(200).json({ data: templates });
  } catch (err) {
    res.status(500).json({ error: 'Server Error', message: err.message });
  }
});

// 3. GET /api/templates/:id - Get single template
router.get('/:id', (req, res) => {
  try {
    const template = templateStore.getTemplate(req.params.id);
    res.status(200).json({ data: template });
  } catch (err) {
    res.status(404).json({ error: 'Not Found', message: err.message });
  }
});

// 4. PUT /api/templates/:id - Update template
router.put('/:id', (req, res) => {
  try {
    const updated = templateStore.updateTemplate(req.params.id, req.body);
    res.status(200).json({
      message: 'Template updated successfully',
      data: updated
    });
  } catch (err) {
    const status = err.message.includes('not found') ? 404 : 400;
    res.status(status).json({ error: 'Update Failed', message: err.message });
  }
});

// 5. DELETE /api/templates/:id - Delete template
router.delete('/:id', (req, res) => {
  try {
    templateStore.deleteTemplate(req.params.id);
    res.status(200).json({ message: `Template ${req.params.id} deleted successfully` });
  } catch (err) {
    res.status(404).json({ error: 'Not Found', message: err.message });
  }
});

module.exports = router;