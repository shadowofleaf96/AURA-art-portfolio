import express from 'express';
import { getServices } from '../controllers/servicesController.js';

const router = express.Router();

// GET all photography commission service packages
router.get('/', getServices);

export default router;
