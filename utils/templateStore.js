const Template = require('../models/Template');

class TemplateStore {
  async createTemplate({ id, name, html, ownerId, css = '' }) {
    if (!id || !name || !html || !ownerId) {
      throw new Error('Missing required fields.');
    }
    try {
      return await Template.create({ id, name, html, css, ownerId });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error(`Template with ID "${id}" already exists.`);
      }
      throw error;
    }
  }

  async updateTemplate(id, ownerId, updates) {
    const template = await Template.findOne({ where: { id, ownerId } });
    if (!template) throw new Error('Template not found or unauthorized.');
    return await template.update(updates);
  }

  async getTemplate(id, ownerId) {
    const template = await Template.findOne({ where: { id, ownerId } });
    if (!template) throw new Error('Template not found.');
    return template;
  }

  async getAllTemplates(ownerId) {
    return await Template.findAll({ where: { ownerId } });
  }

  async deleteTemplate(id, ownerId) {
    const deletedCount = await Template.destroy({ where: { id, ownerId } });
    if (deletedCount === 0) throw new Error('Template not found.');
    return true;
  }
}

module.exports = new TemplateStore();