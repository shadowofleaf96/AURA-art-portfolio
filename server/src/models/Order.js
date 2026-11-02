import pool from '../db.js';

class OrderModel {
  static format(row, items = []) {
    if (!row) return null;
    return {
      id: row.id,
      userId: row.user_id,
      customerName: row.customer_name,
      customerEmail: row.customer_email,
      totalPrice: Number(row.total_price),
      currency: row.currency || 'eur',
      status: row.status,
      stripeSessionId: row.stripe_session_id,
      stripePaymentIntentId: row.stripe_payment_intent_id,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      items: items.map((item) => ({
        id: item.id,
        orderId: item.order_id,
        itemId: item.item_id,
        title: item.title,
        price: Number(item.price),
        quantity: item.quantity,
        createdAt: item.created_at,
      })),
    };
  }

  // Create a new purchase order and child line items in PostgreSQL transaction
  static async create({
    userId,
    customerName,
    customerEmail,
    totalPrice = 0,
    currency = 'eur',
    status = 'pending',
    stripeSessionId = null,
    notes = null,
    items = [],
  }) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Insert into orders table (Step 1 requirement)
      // Populates both the legacy JSONB column and the normalized order_items table
      const orderQuery = `
        INSERT INTO orders (
          user_id, customer_name, customer_email, items, total_price, currency, status, stripe_session_id, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *;
      `;
      const orderResult = await client.query(orderQuery, [
        userId,
        customerName.trim(),
        customerEmail.trim().toLowerCase(),
        JSON.stringify(items),
        totalPrice,
        currency.toLowerCase(),
        status,
        stripeSessionId,
        notes,
      ]);
      const createdOrder = orderResult.rows[0];

      // 2. Insert into order_items table (Step 1 requirement)
      const createdItems = [];
      for (const item of items) {
        const itemQuery = `
          INSERT INTO order_items (order_id, item_id, title, price, quantity)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *;
        `;
        const itemResult = await client.query(itemQuery, [
          createdOrder.id,
          item.id || null,
          item.title,
          Number(item.price),
          item.quantity || 1,
        ]);
        createdItems.push(itemResult.rows[0]);
      }

      await client.query('COMMIT');
      return OrderModel.format(createdOrder, createdItems);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  // Update stripe_session_id once Stripe Checkout Session is initialized
  static async updateStripeSession(orderId, stripeSessionId) {
    const query = `
      UPDATE orders
      SET stripe_session_id = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [stripeSessionId, orderId]);
    if (result.rows.length === 0) return null;
    return OrderModel.format(result.rows[0]);
  }

  // Find order by ID including all associated order_items
  static async findById(id) {
    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1;', [id]);
    if (orderResult.rows.length === 0) return null;

    const itemsResult = await pool.query(
      'SELECT * FROM order_items WHERE order_id = $1 ORDER BY id ASC;',
      [id]
    );

    return OrderModel.format(orderResult.rows[0], itemsResult.rows);
  }

  // Find order by Stripe Checkout Session ID
  static async findBySessionId(sessionId) {
    const orderResult = await pool.query(
      'SELECT * FROM orders WHERE stripe_session_id = $1;',
      [sessionId]
    );
    if (orderResult.rows.length === 0) return null;

    const itemsResult = await pool.query(
      'SELECT * FROM order_items WHERE order_id = $1 ORDER BY id ASC;',
      [orderResult.rows[0].id]
    );

    return OrderModel.format(orderResult.rows[0], itemsResult.rows);
  }

  // Mark order as paid via verified Stripe Webhook (Step 5 requirement)
  // This is the only function allowed to transition order status to 'paid'
  static async markAsPaid({ orderId = null, stripeSessionId = null, paymentIntentId = null }) {
    let query;
    let params;

    if (orderId && stripeSessionId) {
      query = `
        UPDATE orders
        SET status = 'paid',
            stripe_payment_intent_id = COALESCE($1, stripe_payment_intent_id),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2 OR stripe_session_id = $3
        RETURNING *;
      `;
      params = [paymentIntentId, orderId, stripeSessionId];
    } else if (stripeSessionId) {
      query = `
        UPDATE orders
        SET status = 'paid',
            stripe_payment_intent_id = COALESCE($1, stripe_payment_intent_id),
            updated_at = CURRENT_TIMESTAMP
        WHERE stripe_session_id = $2
        RETURNING *;
      `;
      params = [paymentIntentId, stripeSessionId];
    } else {
      query = `
        UPDATE orders
        SET status = 'paid',
            stripe_payment_intent_id = COALESCE($1, stripe_payment_intent_id),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *;
      `;
      params = [paymentIntentId, orderId];
    }

    const result = await pool.query(query, params);
    if (result.rows.length === 0) return null;

    const itemsResult = await pool.query(
      'SELECT * FROM order_items WHERE order_id = $1 ORDER BY id ASC;',
      [result.rows[0].id]
    );

    return OrderModel.format(result.rows[0], itemsResult.rows);
  }

  // Find all orders for a specific user ID
  static async findByUserId(userId) {
    const orderResult = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC;',
      [userId]
    );

    const orders = [];
    for (const row of orderResult.rows) {
      const itemsResult = await pool.query(
        'SELECT * FROM order_items WHERE order_id = $1 ORDER BY id ASC;',
        [row.id]
      );
      orders.push(OrderModel.format(row, itemsResult.rows));
    }
    return orders;
  }

  // Find all orders (admin view)
  static async findAll() {
    const orderResult = await pool.query('SELECT * FROM orders ORDER BY created_at DESC;');
    const orders = [];
    for (const row of orderResult.rows) {
      const itemsResult = await pool.query(
        'SELECT * FROM order_items WHERE order_id = $1 ORDER BY id ASC;',
        [row.id]
      );
      orders.push(OrderModel.format(row, itemsResult.rows));
    }
    return orders;
  }
}

export default OrderModel;
