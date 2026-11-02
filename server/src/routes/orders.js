import express from 'express';
import { createOrder, getUserOrders, getOrderById } from '../controllers/ordersController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Create order/inquiry (optional authentication to link user if logged in)
router.post('/', optionalAuth, createOrder);

// Get user orders (requires authentication)
router.get('/my-orders', authenticateToken, getUserOrders);

// Get single order by ID (walled by login)
router.get('/:id', authenticateToken, getOrderById);

export default router;
