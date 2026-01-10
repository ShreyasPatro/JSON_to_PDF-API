const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

class UserStore {
  constructor() {
    this.filePath = path.join(__dirname, '../data/users.json');
    this.users = new Map();
    this._ensureDirectory();
    this._loadFromFile();
  }

  _ensureDirectory() {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  _loadFromFile() {
    if (fs.existsSync(this.filePath)) {
      const data = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
      data.forEach(user => this.users.set(user.email, user));
    }
  }

  _saveToFile() {
    const data = JSON.stringify(Array.from(this.users.values()), null, 2);
    fs.writeFileSync(this.filePath, data, 'utf8');
  }

  async createUser(email, password) {
    if (this.users.has(email)) throw new Error('User already exists');
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { email, password: hashedPassword, createdAt: new Date() };
    this.users.set(email, user);
    this._saveToFile();
    return { email: user.email };
  }

  findByEmail(email) {
    return this.users.get(email);
  }
}

module.exports = new UserStore();