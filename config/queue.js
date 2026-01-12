const { Queue } = require('bullmq');
const IORedis = require('ioredis');

// Setup Redis connection
const connection = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null, // Required by BullMQ
});

// Create the PDF generation queue
const pdfQueue = new Queue('pdf-generation', { connection });

module.exports = { pdfQueue, connection };