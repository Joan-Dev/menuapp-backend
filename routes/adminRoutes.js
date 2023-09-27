// Import dependencies
import express from 'express';
// Import Controllers
import { getProfile, registerUser, verifyAccount, authUser, forgotPassword, verifyPassword, newPassword, updateProfile } from '../controllers/adminControllers.js';
// Import middlewares
import verifyAuth from '../middleware/authMiddleware.js';
import { upload } from '../helpers/multer.js';
// Create Router
const router = express.Router();

/********************** Publics Routes ******************************/

// Register user admin
router.post('/', registerUser);

// Verify user by token 
router.get('/verify/:token', verifyAccount);

// Login account
router.post('/login', authUser);

// Password lost
router.post('/forgot-password', forgotPassword);
router.get('/forgot-password/:token', verifyPassword);
router.post('/forgot-password/:token', newPassword);

// router.route('/fotgot-password/:token').get(verifyPassword).post(newPassword);


/********************  Privates Routes ******************/
router.put('/:id', [verifyAuth, upload.single('image')] , updateProfile);
// Get profile user
router.get('/profile',  verifyAuth, getProfile);


export default router;