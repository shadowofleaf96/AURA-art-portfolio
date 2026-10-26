import express from 'express';
import { getItems, getItemById, createItem } from '../controllers/itemsController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// GET all items (supports optional ?category= query parameter)
router.get('/', getItems);

// GET single item by unique ID
router.get('/:id', getItemById);

// POST create a new artwork in PostgreSQL
router.post('/', optionalAuth, createItem);

export default router;
