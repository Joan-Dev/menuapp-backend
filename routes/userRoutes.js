import express from "express";
import { addUser, getUsers, editUser, deleteUser } from "../controllers/userControllers.js";
import verifyAuth from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/rolMiddleware.js";
const router = express.Router();

// Create tables
router.post('/', verifyAuth, isAdmin, addUser);
// Get All tables
router.get('/', verifyAuth, getUsers);
// Edit a table
router.put('/:id', verifyAuth,isAdmin, editUser);
// Delete a table
router.delete('/:id', verifyAuth,isAdmin, deleteUser);

export default router;