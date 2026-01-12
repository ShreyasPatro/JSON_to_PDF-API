const { Worker } = require('bullmq');
const { connection } = require('../config/queue');
const { generatePDF } = require('../utils/pdfGenerator');
const templateStore = require('../utils/templateStore');
const processor = require('../utils/templateProcessor');
const path = require('path');
const fs = require('fs');

const worker = new Worker('pdf-generation', async (job) => {
  console.log(`[Worker] Processing job ${job.id}...`);
  const { templateId, data, options, userId } = job.data;

  try {
    const template = await templateStore.getTemplate(templateId, userId);
    const html = processor.replaceVariables(template.html, data);
    const pdfBuffer = await generatePDF(html, template.css, options);

    const filename = `pdf-${job.id}.pdf`;
    const folderPath = path.join(__dirname, '../generated-pdfs');
    
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
    
    const filePath = path.join(folderPath, filename);
    fs.writeFileSync(filePath, pdfBuffer);

    console.log(`[Worker] Job ${job.id} completed. Saved to ${filename}`);

    return { filename, status: 'success' };
  } catch (error) {
    console.error(`[Worker] Job ${job.id} failed:`, error.message);
    throw error;
  }
}, { connection });

console.log('--- PDF Worker is running and waiting for jobs ---');