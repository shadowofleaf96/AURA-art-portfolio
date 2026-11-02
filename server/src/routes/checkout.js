import express from 'express';
import {
  createCheckoutSession,
  getOrderById,
} from '../controllers/checkoutController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Step 3 & 4: Create Stripe Checkout Session (Blocked for unauthenticated users)
router.post('/create-session', authenticateToken, createCheckoutSession);

// Step 7: Order lookup endpoint for payment success page confirmation (Walled by login)
router.get('/order/:id', authenticateToken, getOrderById);

export default router;

