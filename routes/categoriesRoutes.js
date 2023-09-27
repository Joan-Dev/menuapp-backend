import express from "express";
// Import middlewares
import verifyAuth from "../middleware/authMiddleware.js";
// Import Controllers
import { addCategory, deleteCategory, editCategory, getCategories } from "../controllers/categoriesControllers.js";
import { isAdmin } from "../middleware/rolMiddleware.js";

const router = express.Router();

// Create category
router.post('/', verifyAuth, isAdmin , addCategory);
// Get all categories
router.get('/', verifyAuth,  getCategories);
// Edit categories
router.put('/:id', verifyAuth, isAdmin, editCategory);
// Delete category
router.delete('/:id', verifyAuth,isAdmin, deleteCategory);


export default router;