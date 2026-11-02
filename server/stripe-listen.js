import dotenv from 'dotenv';
import { spawn } from 'child_process';

dotenv.config();

const stripeKey = (process.env.STRIPE_SECRET_KEY || '').trim();

if (!stripeKey || stripeKey.includes('placeholder')) {
  console.error('❌ Error: STRIPE_SECRET_KEY is missing or invalid in server/.env.');
  process.exit(1);
}

console.log('⚡ Starting Stripe CLI Webhook Tunnel (authenticating with STRIPE_SECRET_KEY from .env)...\n');

const stripeProcess = spawn(
  'stripe',
  [
    'listen',
    '--forward-to',
    'localhost:5000/api/checkout/webhook',
    '--events',
    'checkout.session.completed',
    '--api-key',
    stripeKey,
  ],
  {
    stdio: 'inherit',
    shell: true,
  }
);

stripeProcess.on('error', (err) => {
  console.error('❌ Failed to start Stripe CLI process:', err.message);
});

const cleanup = () => {
  try {
    stripeProcess.kill();
  } catch (e) {}
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
