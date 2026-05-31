const { generatePDF } = require('../utils/pdfGenerator');
const templateStore = require('../utils/templateStore');
const processor = require('../utils/templateProcessor');
const { pdfQueue } = require('../config/queue');
const Job = require('../models/Job'); // Ensure you have a Job model imported

// 1. Create Template
exports.createTemplate = async (req, res) => {
  try {
    // Map the body and the user ID from the token
    const templateData = {
      name: req.body.name,
      html: req.body.html,
      css: req.body.css,
      userId: req.user.id // This comes from your auth middleware
    };

    const template = await templateStore.createTemplate(templateData);
    res.status(201).json({ message: 'Template saved', data: template });
  } catch (error) {
    // This sends the specific "Missing fields" message back to the frontend alert
    res.status(400).json({ error: 'Save Failed', message: error.message });
  }
};

// 2. Update Template
exports.updateTemplate = async (req, res) => {
  try {
    // FIX: Ensure userId is passed correctly for security (owner check)
    const updated = await templateStore.updateTemplate(req.params.id, req.user.id, req.body);
    res.status(200).json({ message: 'Template updated successfully', data: updated });
  } catch (error) { handleError(res, error); }
};

// 3. Generate PDF (Synchronous)
exports.generateFromTemplate = async (req, res) => {
  const { templateId, data, options } = req.body;
  try {
    // Fetching template specifically for this user
    const template = await templateStore.getTemplate(templateId, req.user.id);
    const processedHtml = processor.replaceVariables(template.html, data || {});
    const pdfBuffer = await generatePDF(processedHtml, template.css, options);
    
    // Optional: Log this sync generation as a 'completed' job in the DB for the dashboard
    await Job.create({ 
      templateId, 
      userId: req.user.id, 
      status: 'completed', 
      type: 'sync' 
    });

    sendPdfResponse(res, pdfBuffer, `${template.name}.pdf`);
  } catch (error) { handleError(res, error); }
};

// 4. Generate PDF (Raw HTML)
exports.generateRawPDF = async (req, res) => {
  const { html, css, options } = req.body;
  if (!html) return res.status(400).json({ error: 'Failed', message: 'HTML is required' });
  try {
    const pdfBuffer = await generatePDF(html, css, options);
    
    // Log raw generation
    await Job.create({ userId: req.user.id, status: 'completed', type: 'raw' });

    sendPdfResponse(res, pdfBuffer);
  } catch (error) { handleError(res, error); }
};

// 5. Generate PDF ASYNC (Returns Job ID immediately)
exports.generateAsync = async (req, res) => {
  const { templateId, data, options, webhookUrl } = req.body;
  try {
    // 1. Add to BullMQ Queue
    const bullJob = await pdfQueue.add('generate-pdf', {
      templateId,
      data,
      options,
      webhookUrl,
      userId: req.user.id
    }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 }
    });

    // 2. Create entry in PostgreSQL for the Dashboard to track
    await Job.create({
      id: bullJob.id, // Matching the BullMQ ID
      templateId,
      userId: req.user.id,
      status: 'pending'
    });

    res.status(202).json({
      message: 'PDF generation started',
      jobId: bullJob.id,
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

    // Security Check: Ensure the job belongs to the user requesting status
    if (job.data.userId !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden', message: 'Unauthorized access to job data' });
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

// 7. NEW: Get All Jobs for Dashboard
exports.getUserJobs = async (req, res) => {
    try {
        const jobs = await Job.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']],
            limit: 20
        });
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ error: 'Database Error', message: error.message });
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