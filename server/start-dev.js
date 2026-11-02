import dotenv from 'dotenv';
import { spawn } from 'child_process';

dotenv.config();

const stripeKey = (process.env.STRIPE_SECRET_KEY || '').trim();

console.log('🚀 [Dev Runner] Starting Express Backend and Stripe CLI Webhook Tunnel...\n');

// 1. Start Express Server
const server = spawn('node', ['--watch', 'src/index.js'], {
  stdio: 'inherit',
  shell: true,
});

// 2. Start Stripe CLI Webhook Listener
const stripeArgs = [
  'listen',
  '--forward-to',
  'localhost:5000/api/checkout/webhook',
  '--events',
  'checkout.session.completed',
];

if (stripeKey && !stripeKey.includes('placeholder')) {
  stripeArgs.push('--api-key', stripeKey);
}

const stripe = spawn('stripe', stripeArgs, {
  stdio: 'inherit',
  shell: true,
});

stripe.on('error', (err) => {
  console.warn('⚠️  Could not launch Stripe CLI automatically:', err.message);
  console.warn('   (Make sure the Stripe CLI is installed and in your PATH).');
});

const cleanup = () => {
  console.log('\n🛑 Shutting down server and Stripe listener...');
  try {
    server.kill();
    stripe.kill();
  } catch (e) {}
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
