const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const templateStore = require('../utils/templateStore');

// 1. Create
router.post('/', pdfController.createTemplate);

// 2. Get All
router.get('/', async (req, res) => {
    try {
        const templates = await templateStore.getAllTemplates(req.user.id);
        res.json({ data: templates });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 3. Get Single
router.get('/:id', async (req, res) => {
    try {
        const template = await templateStore.getTemplate(req.params.id, req.user.id);
        res.json({ data: template });
    } catch (err) { res.status(404).json({ error: err.message }); }
});

// 4. Update (PUT)
router.put('/:id', pdfController.updateTemplate);

// 5. Delete
router.delete('/:id', async (req, res) => {
    try {
        await templateStore.deleteTemplate(req.params.id, req.user.id);
        res.json({ message: `Template ${req.params.id} deleted successfully` });
    } catch (err) { res.status(404).json({ error: err.message }); }
});

module.exports = router;