/**
 * In-memory store for PDF templates using a Map.
 * Templates are stored with an ID as the key.
 */
class TemplateStore {
  constructor() {
    this.templates = new Map();
  }

  // 1. Create a template
  createTemplate(id, name, html, css = '') {
    if (!id || !name || !html) {
      throw new Error('Missing required fields: id, name, and html are mandatory.');
    }

    if (this.templates.has(id)) {
      throw new Error(`Template with ID "${id}" already exists.`);
    }

    const now = new Date();
    const newTemplate = {
      id,
      name,
      html,
      css,
      createdAt: now,
      updatedAt: now,
    };

    this.templates.set(id, newTemplate);
    return newTemplate;
  }

  // 2. Retrieve a template by ID
  getTemplate(id) {
    const template = this.templates.get(id);
    if (!template) {
      throw new Error(`Template with ID "${id}" not found.`);
    }
    return template;
  }

  // 3. Return array of all templates
  getAllTemplates() {
    return Array.from(this.templates.values());
  }

  // 4. Remove a template
  deleteTemplate(id) {
    if (!this.templates.has(id)) {
      throw new Error(`Cannot delete: Template with ID "${id}" not found.`);
    }
    return this.templates.delete(id);
  }

  // 5. Update template fields
  updateTemplate(id, updates) {
    const template = this.getTemplate(id); // Throws if not found

    const updatedTemplate = {
      ...template,
      ...updates,
      id: template.id, // Ensure ID cannot be changed via update
      updatedAt: new Date(),
    };

    this.templates.set(id, updatedTemplate);
    return updatedTemplate;
  }
}

// Export a singleton instance
module.exports = new TemplateStore();