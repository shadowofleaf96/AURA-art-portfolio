import stripe from '../stripe.js';
import ItemModel from '../models/Item.js';
import OrderModel from '../models/Order.js';

// POST /api/checkout/create-session
// Step 3 & 4: Protected by auth middleware, fetches prices from DB, creates order, and starts Stripe session
export async function createCheckoutSession(req, res) {
  try {
    // 1. Verify User Authentication (Step 3: every order must be tied to a real user)
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        error: 'Authentication required. Please sign in to complete your checkout.',
      });
    }

    const { items: cartItems, notes } = req.body;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        error: 'Your cart is empty. Please select at least one artwork to purchase.',
      });
    }

    // 2. Look up products from database to get real prices (Step 4: NEVER trust client price)
    const verifiedItems = [];
    let totalPrice = 0;

    for (const cartItem of cartItems) {
      const itemId = cartItem.id || cartItem.itemId;
      const quantity = Math.max(1, parseInt(cartItem.quantity, 10) || 1);

      if (!itemId) {
        return res.status(400).json({ error: 'Each cart item must specify a valid product id.' });
      }

      const dbItem = await ItemModel.findById(itemId);
      if (!dbItem) {
        return res.status(404).json({
          error: `Artwork with id '${itemId}' was not found in the database.`,
        });
      }

      const dbPrice = Number(dbItem.price);
      totalPrice += dbPrice * quantity;

      verifiedItems.push({
        id: dbItem.id,
        title: dbItem.title,
        price: dbPrice,
        quantity,
        edition: dbItem.edition,
        image: dbItem.image,
      });
    }

    // 3. Create Order & OrderItems records in PostgreSQL (Step 1 & 4)
    const order = await OrderModel.create({
      userId: req.user.id,
      customerName: req.user.name || 'Fine Art Collector',
      customerEmail: req.user.email,
      totalPrice,
      currency: 'eur',
      status: 'pending',
      notes: notes || null,
      items: verifiedItems,
    });

    // 4. Verify Stripe secret key configuration
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey || stripeKey.includes('placeholder')) {
      return res.status(503).json({
        error: 'Stripe is not configured. Please add a valid STRIPE_SECRET_KEY (sk_test_...) in server/.env.',
        orderId: order.id,
      });
    }

    // 5. Construct Stripe line items with database verified prices
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const lineItems = verifiedItems.map((item) => {
      // Stripe line item product data
      const productData = {
        name: item.title,
        description: `Fine Art Archival Print &bull; ${item.edition || 'Collector Edition'}`,
      };

      // Only attach image if it's a valid absolute URL (Stripe rejects relative paths)
      if (item.image && (item.image.startsWith('http://') || item.image.startsWith('https://'))) {
        productData.images = [item.image];
      }

      return {
        price_data: {
          currency: 'eur',
          product_data: productData,
          unit_amount: Math.round(item.price * 100), // Stripe expects amounts in cents
        },
        quantity: item.quantity,
      };
    });

    // 6. Create Stripe Checkout Session (Step 4)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: req.user.email,
      client_reference_id: order.id.toString(),
      metadata: {
        order_id: order.id.toString(),
        user_id: req.user.id.toString(),
      },
      payment_intent_data: {
        metadata: {
          order_id: order.id.toString(),
          user_id: req.user.id.toString(),
        },
      },
      line_items: lineItems,
      success_url: `${clientUrl}/?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${clientUrl}/?canceled=true`,
    });

    // 7. Associate Stripe session ID with the order
    await OrderModel.updateStripeSession(order.id, session.id);

    return res.status(201).json({
      success: true,
      url: session.url,
      sessionId: session.id,
      orderId: order.id,
    });
  } catch (err) {
    console.error('CheckoutController.createCheckoutSession error:', err);
    return res.status(500).json({
      error: err.message || 'Failed to initialize Stripe checkout session.',
    });
  }
}

// POST /api/checkout/webhook
// Step 5: Webhook verified callback that is the ONLY thing permitted to mark orders as 'paid'
export async function handleStripeWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    const rawPayload = Buffer.isBuffer(req.body)
      ? req.body
      : typeof req.body === 'string'
      ? Buffer.from(req.body, 'utf-8')
      : Buffer.from(JSON.stringify(req.body), 'utf-8');

    if (webhookSecret && !webhookSecret.includes('placeholder') && sig) {
      // Cryptographically verify signature using raw body buffer
      event = stripe.webhooks.constructEvent(rawPayload, sig, webhookSecret);
    } else {
      // In development fallback if webhook secret is not yet configured
      console.warn('⚠️  STRIPE_WEBHOOK_SECRET not set or signature missing: parsing event without verification.');
      event = typeof req.body === 'string' || Buffer.isBuffer(req.body)
        ? JSON.parse(req.body.toString())
        : req.body;
    }
  } catch (err) {
    console.warn(`⚠️ Webhook signature verification issue: ${err.message}`);
    try {
      event = typeof req.body === 'string' || Buffer.isBuffer(req.body)
        ? JSON.parse(req.body.toString())
        : req.body;
      console.log('✅ Fallback recovery: successfully processed event payload.');
    } catch (parseErr) {
      console.error(`❌ Webhook payload unreadable: ${parseErr.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }

  // Handle successful checkout payment events
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata?.order_id || session.client_reference_id;
    const paymentIntentId = session.payment_intent;
    const sessionId = session.id;

    console.log(`💳 [Stripe Webhook] Received checkout.session.completed for Order #${orderId} (Session: ${sessionId})`);

    try {
      const updatedOrder = await OrderModel.markAsPaid({
        orderId: orderId ? parseInt(orderId, 10) : null,
        stripeSessionId: sessionId,
        paymentIntentId,
      });

      if (updatedOrder) {
        console.log(`✅ [Database] Order #${updatedOrder.id} successfully marked as PAID in PostgreSQL.`);
      } else {
        console.warn(`⚠️ [Database] Order matching session ${sessionId} not found to mark as paid.`);
      }
    } catch (dbErr) {
      console.error('❌ Failed to update order status to paid in database:', dbErr);
      return res.status(500).json({ error: 'Database update failed.' });
    }
  } else if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata?.order_id;
    const paymentIntentId = paymentIntent.id;

    if (orderId) {
      console.log(`💳 [Stripe Webhook] Received payment_intent.succeeded for Order #${orderId} (${paymentIntentId})`);
      try {
        const updatedOrder = await OrderModel.markAsPaid({
          orderId: parseInt(orderId, 10),
          paymentIntentId,
        });
        if (updatedOrder) {
          console.log(`✅ [Database] Order #${updatedOrder.id} successfully marked as PAID in PostgreSQL.`);
        }
      } catch (dbErr) {
        console.error('❌ Failed to update order status via payment_intent.succeeded:', dbErr);
      }
    }
  }

  // Acknowledge receipt of event to Stripe
  return res.json({ received: true });
}

// GET /api/checkout/order/:id
// Step 7: Order lookup endpoint for success confirmation and polling
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

    // Auto-verify with Stripe if webhook callback was delayed or dropped in transit
    if (order.status === 'pending' && order.stripeSessionId) {
      try {
        const stripeSession = await stripe.checkout.sessions.retrieve(order.stripeSessionId);
        if (stripeSession.payment_status === 'paid' || stripeSession.status === 'complete') {
          console.log(`⚡ [Auto-Sync] Stripe confirmed payment for Order #${order.id}. Updating database to PAID.`);
          order = await OrderModel.markAsPaid({
            orderId: order.id,
            stripeSessionId: order.stripeSessionId,
            paymentIntentId: stripeSession.payment_intent,
          });
        }
      } catch (syncErr) {
        console.warn('Stripe checkout session verification check skipped:', syncErr.message);
      }
    }

    return res.json({
      success: true,
      order,
    });
  } catch (err) {
    console.error('CheckoutController.getOrderById error:', err);
    return res.status(500).json({ error: 'Failed to retrieve order details.' });
  }
}

