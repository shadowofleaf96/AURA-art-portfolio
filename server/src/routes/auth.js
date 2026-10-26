import express from 'express';
import { signup, login, getMe } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public Authentication Routes
router.post('/signup', signup);
router.post('/login', login);

// Protected Session Route (survives page refresh via JWT Bearer token)
router.get('/me', authenticateToken, getMe);

export default router;
