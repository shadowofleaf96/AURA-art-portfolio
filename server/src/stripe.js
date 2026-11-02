import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

if (!stripeSecretKey || stripeSecretKey.includes('placeholder')) {
  console.warn('⚠️  [Stripe] STRIPE_SECRET_KEY is not configured or using placeholder. Stripe checkout will require a valid test key (sk_test_...).');
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
});

export default stripe;

