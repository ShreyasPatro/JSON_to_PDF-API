const fs = require('fs');
const path = require('path');

/**
 * Persistent store for PDF templates using a local JSON file.
 */
class TemplateStore {
  constructor() {
    // Define the file path for storage
    this.filePath = path.join(__dirname, '../data/templates.json');
    this.templates = new Map();
    
    // Ensure the data directory exists and load existing data
    this._ensureDirectory();
    this._loadFromFile();
  }

  // Helper: Create data directory if it doesn't exist
  _ensureDirectory() {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // Helper: Load data from JSON file into the Map
  _loadFromFile() {
    try {
      if (fs.existsSync(this.filePath)) {
        const fileData = fs.readFileSync(this.filePath, 'utf8');
        const jsonData = JSON.parse(fileData);
        // Convert the array of templates back into a Map
        jsonData.forEach(template => {
          this.templates.set(template.id, template);
        });
        console.log(`Loaded ${this.templates.size} templates from storage.`);
      }
    } catch (error) {
      console.error('Failed to load templates from file:', error.message);
    }
  }

  // Helper: Save the current Map state to the JSON file
  _saveToFile() {
    try {
      const data = JSON.stringify(this.getAllTemplates(), null, 2);
      fs.writeFileSync(this.filePath, data, 'utf8');
    } catch (error) {
      console.error('Failed to save templates to file:', error.message);
    }
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
    const newTemplate = { id, name, html, css, createdAt: now, updatedAt: now };

    this.templates.set(id, newTemplate);
    this._saveToFile(); // Persist changes
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
    const result = this.templates.delete(id);
    this._saveToFile(); // Persist changes
    return result;
  }

  // 5. Update template fields
  updateTemplate(id, updates) {
    const template = this.getTemplate(id);

    const updatedTemplate = {
      ...template,
      ...updates,
      id: template.id,
      updatedAt: new Date(),
    };

    this.templates.set(id, updatedTemplate);
    this._saveToFile(); // Persist changes
    return updatedTemplate;
  }
}

module.exports = new TemplateStore();