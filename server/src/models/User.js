import pool from '../db.js';

class UserModel {
  // Find a user by their email address (case-insensitive)
  static async findByEmail(email) {
    const query = `
      SELECT id, name, email, password_hash, role, created_at 
      FROM users 
      WHERE LOWER(email) = LOWER($1);
    `;
    const result = await pool.query(query, [email.trim()]);
    return result.rows[0] || null;
  }

  // Find a user by primary key ID
  static async findById(id) {
    const query = `
      SELECT id, name, email, role, created_at 
      FROM users 
      WHERE id = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Create a new user record in PostgreSQL
  static async create({ name, email, passwordHash, role = 'client' }) {
    const query = `
      INSERT INTO users (name, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, created_at;
    `;
    const result = await pool.query(query, [name.trim(), email.trim().toLowerCase(), passwordHash, role]);
    return result.rows[0];
  }
}

export default UserModel;
