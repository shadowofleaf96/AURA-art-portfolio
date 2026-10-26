import OrderModel from '../models/Order.js';

// Controller: Submit a booking inquiry or print order (POST /api/orders)
export async function createOrder(req, res) {
  try {
    const { customerName, customerEmail, items, totalPrice, notes } = req.body;

    if (!customerName || !customerEmail) {
      return res.status(400).json({ error: 'Name and email are required to submit an order or inquiry.' });
    }

    const userId = req.user ? req.user.id : null;

    const order = await OrderModel.create({
      userId,
      customerName,
      customerEmail,
      items: items || [],
      totalPrice: totalPrice || 0,
      notes: notes || null,
    });

    return res.status(201).json({
      success: true,
      message: 'Order / inquiry created successfully.',
      order,
    });
  } catch (err) {
    console.error('OrdersController.createOrder error:', err);
    return res.status(500).json({ error: 'Failed to process order.' });
  }
}

// Controller: Get logged-in user's orders (GET /api/orders/my-orders)
export async function getUserOrders(req, res) {
  try {
    const orders = await OrderModel.findByUserId(req.user.id);

    return res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (err) {
    console.error('OrdersController.getUserOrders error:', err);
    return res.status(500).json({ error: 'Failed to retrieve your orders.' });
  }
}
