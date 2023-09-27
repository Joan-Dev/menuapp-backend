import express from "express";
import { addTable, getTables, editTable, deleteTable } from "../controllers/tablesControllers.js";
import verifyAuth from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/rolMiddleware.js";
const router = express.Router();

// Create tables
router.post('/', verifyAuth, isAdmin, addTable);
// Get All tables
router.get('/', verifyAuth,  getTables);
// Edit a table
router.put('/:id', verifyAuth, isAdmin, editTable);
// Delete a table
router.delete('/:id', verifyAuth, isAdmin, deleteTable);

export default router;