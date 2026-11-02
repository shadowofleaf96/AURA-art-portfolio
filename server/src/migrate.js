import pool from './db.js';

async function migrate() {
  console.log('🔄 Running Assignment 4 database migrations...');
  try {
    // 1. Ensure orders table exists and has all Assignment 4 Stripe fields
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        total_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
        currency VARCHAR(10) NOT NULL DEFAULT 'eur',
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        stripe_session_id VARCHAR(255) UNIQUE,
        stripe_payment_intent_id VARCHAR(255),
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add columns if table already existed from previous assignments
    await pool.query(`
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_session_id VARCHAR(255);
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_payment_intent_id VARCHAR(255);
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'eur';
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    `);

    // Ensure stripe_session_id has unique constraint if not already
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'orders_stripe_session_id_key'
        ) THEN
          BEGIN
            ALTER TABLE orders ADD CONSTRAINT orders_stripe_session_id_key UNIQUE (stripe_session_id);
          EXCEPTION WHEN others THEN
            NULL;
          END;
        END IF;
      END $$;
    `);

    // 2. Create order_items table (Step 1 requirement)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        item_id VARCHAR(100) REFERENCES items(id) ON DELETE SET NULL,
        title VARCHAR(255) NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Create or replace alias view "orderItems"
    await pool.query(`
      CREATE OR REPLACE VIEW "orderItems" AS 
      SELECT * FROM order_items;
    `);

    console.log('✅ Database migration completed successfully!');
    console.log('   - orders table updated with Stripe session tracking');
    console.log('   - order_items & orderItems tables/views created');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();

