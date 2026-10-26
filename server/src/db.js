import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Strip sslmode from query params so our explicit ssl configuration takes precedence
const rawConnectionString = process.env.DATABASE_URL || '';
const cleanConnectionString = rawConnectionString.replace(/(\?|&)sslmode=[^&]*/g, '');

// PostgreSQL Connection Pool using DATABASE_URL
// Configured with SSL support for cloud databases (Aiven / Neon)
const pool = new Pool({
  connectionString: cleanConnectionString,
  ssl: {
    rejectUnauthorized: false,
    checkServerIdentity: () => undefined,
  },
});

pool.on('connect', () => {
  // Connected successfully
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle database client', err);
});

export default pool;
