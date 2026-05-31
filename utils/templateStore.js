const Template = require('../models/Template');

class TemplateStore {
  async createTemplate(data) {
    const { name, html, css, userId } = data;

    if (!name || !html || !userId) {
      throw new Error(`Missing required fields: name=${!!name}, html=${!!html}, userId=${!!userId}`);
    }

    try {
      return await Template.create({
        name,
        html,
        css: css || '',
        userId 
      });
    } catch (error) {
      console.error('Sequelize Insert Error:', error);
      throw error;
    }
  }

  async updateTemplate(id, userId, updates) {
    const template = await Template.findOne({ where: { id, userId } });
    if (!template) throw new Error('Template not found or unauthorized.');
    return await template.update(updates);
  }

  async getTemplate(id, userId) {
    const template = await Template.findOne({ where: { id, userId } });
    if (!template) throw new Error('Template not found.');
    return template;
  }

  async getAllTemplates(userId) {
    return await Template.findAll({ 
      where: { userId },
      order: [['createdAt', 'DESC']] 
    });
  }

  async deleteTemplate(id, userId) {
    const deletedCount = await Template.destroy({ where: { id, userId } });
    if (deletedCount === 0) throw new Error('Template not found.');
    return true;
  }
}

module.exports = new TemplateStore();