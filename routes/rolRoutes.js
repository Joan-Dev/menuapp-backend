import express from 'express';
// Import controllers
import { getRols, getTableRol } from '../controllers/rolControllers.js';
// Import Middleware
import verifyAuth from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all rols neccessaries
router.get('/', verifyAuth, getRols);
// Get table rol
router.get('/table', verifyAuth, getTableRol);

export default router;