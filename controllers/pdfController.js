const { generatePDF } = require('../utils/pdfGenerator');
const templateStore = require('../utils/templateStore');
const processor = require('../utils/templateProcessor');
const { pdfQueue } = require('../config/queue'); // New Import

// 1. Create Template
exports.createTemplate = async (req, res) => {
  try {
    const template = await templateStore.createTemplate({ ...req.body, ownerId: req.user.id });
    res.status(201).json({ message: 'Template created successfully', data: template });
  } catch (error) { handleError(res, error); }
};

// 2. Update Template
exports.updateTemplate = async (req, res) => {
  try {
    const updated = await templateStore.updateTemplate(req.params.id, req.user.id, req.body);
    res.status(200).json({ message: 'Template updated successfully', data: updated });
  } catch (error) { handleError(res, error); }
};

// 3. Generate PDF (Synchronous - Waits for completion)
exports.generateFromTemplate = async (req, res) => {
  const { templateId, data, options } = req.body;
  try {
    const template = await templateStore.getTemplate(templateId, req.user.id);
    const processedHtml = processor.replaceVariables(template.html, data || {});
    const pdfBuffer = await generatePDF(processedHtml, template.css, options);
    sendPdfResponse(res, pdfBuffer, `${template.name}.pdf`);
  } catch (error) { handleError(res, error); }
};

// 4. Generate PDF (Raw HTML)
exports.generateRawPDF = async (req, res) => {
  const { html, css, options } = req.body;
  if (!html) return res.status(400).json({ error: 'Failed', message: 'HTML is required' });
  try {
    const pdfBuffer = await generatePDF(html, css, options);
    sendPdfResponse(res, pdfBuffer);
  } catch (error) { handleError(res, error); }
};

// 5. Generate PDF ASYNC (Returns Job ID immediately)
exports.generateAsync = async (req, res) => {
  const { templateId, data, options, webhookUrl } = req.body;
  try {
    const job = await pdfQueue.add('generate-pdf', {
      templateId,
      data,
      options,
      webhookUrl,
      userId: req.user.id
    }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 }
    });

    res.status(202).json({
      message: 'PDF generation started',
      jobId: job.id,
      status: 'pending'
    });
  } catch (error) { 
    res.status(500).json({ error: 'Queue Error', message: error.message }); 
  }
};

// 6. Check Job Status
exports.getJobStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await pdfQueue.getJob(id);
    if (!job) {
      return res.status(404).json({ error: 'Not Found', message: 'Job not found' });
    }

    const state = await job.getState();
    const result = job.returnvalue;

    res.json({
      jobId: job.id,
      status: state,
      progress: job.progress,
      result: state === 'completed' ? result : null,
      error: state === 'failed' ? job.failedReason : null
    });
  } catch (error) { 
    res.status(500).json({ error: 'Status Check Error', message: error.message }); 
  }
};

// --- Helpers ---

const sendPdfResponse = (res, buffer, filename = 'generated.pdf') => {
  res.contentType('application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.status(200).send(buffer);
};

const handleError = (res, error) => {
  const status = error.message.includes('not found') ? 404 : 400;
  res.status(status).json({ error: 'Failed', message: error.message });
};