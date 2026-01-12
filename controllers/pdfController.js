const { generatePDF } = require('../utils/pdfGenerator');
const templateStore = require('../utils/templateStore');
const processor = require('../utils/templateProcessor');

exports.createTemplate = async (req, res) => {
  try {
    const template = await templateStore.createTemplate({ ...req.body, ownerId: req.user.id });
    res.status(201).json({ message: 'Template created successfully', data: template });
  } catch (error) { handleError(res, error); }
};

exports.updateTemplate = async (req, res) => {
  try {
    const updated = await templateStore.updateTemplate(req.params.id, req.user.id, req.body);
    res.status(200).json({ message: 'Template updated successfully', data: updated });
  } catch (error) { handleError(res, error); }
};

exports.generateFromTemplate = async (req, res) => {
  const { templateId, data, options } = req.body;
  try {
    const template = await templateStore.getTemplate(templateId, req.user.id);
    const processedHtml = processor.replaceVariables(template.html, data || {});
    const pdfBuffer = await generatePDF(processedHtml, template.css, options);
    sendPdfResponse(res, pdfBuffer, `${template.name}.pdf`);
  } catch (error) { handleError(res, error); }
};

exports.generateRawPDF = async (req, res) => {
  const { html, css, options } = req.body;
  if (!html) return res.status(400).json({ error: 'Failed', message: 'HTML is required' });
  try {
    const pdfBuffer = await generatePDF(html, css, options);
    sendPdfResponse(res, pdfBuffer);
  } catch (error) { handleError(res, error); }
};

const sendPdfResponse = (res, buffer, filename = 'generated.pdf') => {
  res.contentType('application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.status(200).send(buffer);
};

const handleError = (res, error) => {
  const status = error.message.includes('not found') ? 404 : 400;
  res.status(status).json({ error: 'Failed', message: error.message });
};