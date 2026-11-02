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

// Controller: Get single order by ID (GET /api/orders/:id)
export async function getOrderById(req, res) {
  try {
    const { id } = req.params;
    const { session_id: sessionId } = req.query;

    let order;
    if (sessionId) {
      order = await OrderModel.findBySessionId(sessionId);
    }
    if (!order && id) {
      order = await OrderModel.findById(id);
    }

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    // Security check: verify authenticated user owns this order
    if (req.user && order.userId && order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied. You do not have permission to view this order.' });
    }

    return res.json({
      success: true,
      order,
    });
  } catch (err) {
    console.error('OrdersController.getOrderById error:', err);
    return res.status(500).json({ error: 'Failed to retrieve order details.' });
  }
}
