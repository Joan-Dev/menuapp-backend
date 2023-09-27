import express from 'express';
import { addMeal, deleteMeal, editMeal, getMeals } from '../controllers/mealsControllers.js';
import verifyAuth from '../middleware/authMiddleware.js';
import { upload } from '../helpers/multer.js';
import { isAdmin } from '../middleware/rolMiddleware.js';


const router = express.Router();

// Create a new Meal
router.post('/', [verifyAuth, upload.single('imageMeal'), isAdmin], addMeal);

// Get All meals
router.get('/', [verifyAuth], getMeals);

// Edit a meal
router.put('/:id', [verifyAuth, upload.single('imageMeal'), isAdmin], editMeal);

// Delete a meal
router.delete('/:id', [verifyAuth, isAdmin], deleteMeal);


export default router;