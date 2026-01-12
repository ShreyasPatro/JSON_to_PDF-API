const User = require('../models/User'); // Import the Sequelize User model
const bcrypt = require('bcryptjs');

/**
 * Persistent store for Users using PostgreSQL via Sequelize.
 */
class UserStore {
  /**
   * Create a new user with a hashed password in the database.
   * @param {string} email 
   * @param {string} password 
   * @returns {Object} The created user object (minus password)
   */
  async createUser(email, password) {
    try {
      // 1. Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // 2. Create the user record in PostgreSQL
      const user = await User.create({
        email,
        password: hashedPassword
      });
      
      // 3. Return safe user data
      return { id: user.id, email: user.email };
    } catch (error) {
      // Handle unique constraint errors (e.g., duplicate email)
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('User already exists');
      }
      throw error;
    }
  }

  /**
   * Find a user by their email address.
   * Useful for login and validation.
   * @param {string} email 
   * @returns {Object|null}
   */
  async findByEmail(email) {
    // Perform an async database lookup
    return await User.findOne({ where: { email } });
  }

  /**
   * Find a user by their unique ID.
   * Useful for session validation in middleware.
   * @param {string} id 
   * @returns {Object|null}
   */
  async findById(id) {
    // Efficiently find by Primary Key
    return await User.findByPk(id);
  }
}

// Export a singleton instance
module.exports = new UserStore();