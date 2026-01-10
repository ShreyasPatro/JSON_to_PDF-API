/**
 * Utility to replace placeholders in HTML with actual data.
 */
const templateProcessor = {
  /**
   * Replaces placeholders like {{key}} or {{user.name}} with data values.
   * @param {string} html - The HTML string containing placeholders.
   * @param {object} data - The data object containing replacement values.
   * @returns {string} - The processed HTML.
   */
  replaceVariables(html, data = {}) {
    if (!html) return '';

    // Regex to match {{anything}}
    return html.replace(/\{\{(.*?)\}\}/g, (match, path) => {
      const trimmedPath = path.trim();
      
      // Resolve nested dot notation (e.g., "user.name")
      const value = trimmedPath.split('.').reduce((obj, key) => {
        return (obj && obj[key] !== undefined) ? obj[key] : undefined;
      }, data);

      // 1. If value exists, return it
      // 2. Handle special characters by ensuring string conversion
      // 3. If missing, return empty string (or you could return the match to keep it)
      return value !== undefined ? String(value) : '';
    });
  },

  /**
   * Simple test suite for the processor
   */
  runTests() {
    const testHtml = "<h1>Hello {{user.name}}</h1><p>Balance: {{amount}}</p><p>Status: {{meta.status}}</p>";
    const testData = {
      user: { name: "John & Doe" },
      amount: 500,
      meta: { status: "Active" }
    };

    const result = this.replaceVariables(testHtml, testData);
    console.log("--- Template Processor Test ---");
    console.log("Input:", testHtml);
    console.log("Result:", result);
    
    // Check edge case: Missing data
    const missing = this.replaceVariables("{{missing}}", {});
    console.log("Missing Data Test (should be empty):", `"${missing}"`);
    
    // Check edge case: Special characters
    const special = this.replaceVariables("{{char}}", { char: "<script>" });
    console.log("Special Char Test:", special);
  }
};

module.exports = templateProcessor;