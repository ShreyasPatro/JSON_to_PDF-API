const Handlebars = require('handlebars');

/**
 * Replaces placeholders using the Handlebars engine.
 * Supports loops, conditionals, and nested objects.
 */
exports.replaceVariables = (html, data = {}) => {
  try {
    // 1. Compile the HTML into a template function
    const template = Handlebars.compile(html);
    
    // 2. Execute the function with your dynamic data
    return template(data);
  } catch (error) {
    console.error('Handlebars Compilation Error:', error.message);
    // Fallback to original HTML if compilation fails
    return html;
  }
};