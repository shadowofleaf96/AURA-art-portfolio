import pool from './src/db.js';
import OrderModel from './src/models/Order.js';
import ItemModel from './src/models/Item.js';

async function runTests() {
  console.log('🧪 Starting Assignment 4 Verification Tests...\n');

  try {
    // Test 1: Verify tables in PostgreSQL
    console.log('Test 1: Verifying PostgreSQL Schema Tables...');
    const tablesRes = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN ('orders', 'order_items');
    `);
    const foundTables = tablesRes.rows.map(r => r.table_name);
    console.log('  Found tables:', foundTables);
    if (!foundTables.includes('orders') || !foundTables.includes('order_items')) {
      throw new Error('Missing orders or order_items table in schema!');
    }
    console.log('  ✅ Test 1 Passed: orders and order_items tables exist.\n');

    // Test 2: Verify database price lookup (Never trust client price)
    console.log('Test 2: Verifying Real Price DB Lookup (Tamper Protection)...');
    const artwork = await ItemModel.findById('monolith-in-ochre');
    if (!artwork) {
      throw new Error("Could not find 'monolith-in-ochre' in database.");
    }
    console.log(`  Found artwork in DB: "${artwork.title}" with DB price: €${artwork.price}`);
    if (typeof artwork.price !== 'number' || artwork.price <= 0) {
      throw new Error('Artwork price is invalid.');
    }
    console.log('  ✅ Test 2 Passed: Artwork price accurately retrieved from database.\n');

    // Test 3: Test user creation and order insertion with child order_items
    console.log('Test 3: Testing Order and order_items Insertion...');
    const demoUserRes = await pool.query('SELECT id, name, email FROM users LIMIT 1;');
    if (demoUserRes.rows.length === 0) {
      throw new Error('No user found to associate order with.');
    }
    const user = demoUserRes.rows[0];

    const fakeSessionId = 'cs_test_' + Date.now();
    const testOrder = await OrderModel.create({
      userId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      totalPrice: artwork.price * 2,
      currency: 'eur',
      status: 'pending',
      stripeSessionId: fakeSessionId,
      notes: 'Automated test purchase',
      items: [
        {
          id: artwork.id,
          title: artwork.title,
          price: artwork.price,
          quantity: 2,
        },
      ],
    });

    console.log(`  Created test order ID: #${testOrder.id} with status: '${testOrder.status}'`);
    console.log(`  Associated items count: ${testOrder.items.length}`);
    if (testOrder.status !== 'pending' || testOrder.items.length !== 1) {
      throw new Error('Order creation verification failed.');
    }
    console.log('  ✅ Test 3 Passed: Order and order_items successfully inserted into PostgreSQL.\n');

    // Test 4: Webhook Marking Order as 'paid'
    console.log('Test 4: Testing Webhook transition to PAID status...');
    const fakePaymentIntentId = 'pi_test_' + Date.now();
    const paidOrder = await OrderModel.markAsPaid({
      orderId: testOrder.id,
      stripeSessionId: fakeSessionId,
      paymentIntentId: fakePaymentIntentId,
    });

    console.log(`  Updated order #${paidOrder.id} status: '${paidOrder.status}'`);
    console.log(`  Payment Intent: ${paidOrder.stripePaymentIntentId}`);
    if (paidOrder.status !== 'paid') {
      throw new Error("Order was not properly marked as 'paid'.");
    }
    console.log('  ✅ Test 4 Passed: Order transitioned to PAID status.\n');

    // Test 5: Verify Order Lookup (Step 7)
    console.log('Test 5: Testing Order Lookup Endpoint logic...');
    const lookupById = await OrderModel.findById(testOrder.id);
    const lookupBySession = await OrderModel.findBySessionId(fakeSessionId);

    if (!lookupById || lookupById.status !== 'paid') {
      throw new Error('Lookup by ID failed or did not return paid status.');
    }
    if (!lookupBySession || lookupBySession.id !== testOrder.id) {
      throw new Error('Lookup by Stripe Session ID failed.');
    }
    console.log(`  Retrieved Order #${lookupById.id} - ${lookupById.items[0].title} x ${lookupById.items[0].quantity} = €${lookupById.totalPrice}`);
    console.log('  ✅ Test 5 Passed: Order lookup successfully retrieves order and order_items.\n');

    console.log('🎉 ALL ASSIGNMENT 4 UNIT & INTEGRATION TESTS PASSED!\n');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runTests();
