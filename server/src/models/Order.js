import pool from '../db.js';

class OrderModel {
  static format(row) {
    if (!row) return null;
    return {
      id: row.id,
      userId: row.user_id,
      customerName: row.customer_name,
      customerEmail: row.customer_email,
      items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
      totalPrice: Number(row.total_price),
      status: row.status,
      notes: row.notes,
      createdAt: row.created_at,
    };
  }

  // Create a new inquiry or print order in database
  static async create({ userId = null, customerName, customerEmail, items = [], totalPrice = 0, notes = null }) {
    const query = `
      INSERT INTO orders (user_id, customer_name, customer_email, items, total_price, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, user_id, customer_name, customer_email, items, total_price, status, notes, created_at;
    `;
    const result = await pool.query(query, [
      userId,
      customerName.trim(),
      customerEmail.trim().toLowerCase(),
      JSON.stringify(items),
      totalPrice,
      notes,
    ]);
    return OrderModel.format(result.rows[0]);
  }

  // Find all orders for a specific user ID
  static async findByUserId(userId) {
    const query = 'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC;';
    const result = await pool.query(query, [userId]);
    return result.rows.map(OrderModel.format);
  }

  // Find all orders (admin view)
  static async findAll() {
    const query = 'SELECT * FROM orders ORDER BY created_at DESC;';
    const result = await pool.query(query);
    return result.rows.map(OrderModel.format);
  }
}

export default OrderModel;
