import express from "express";
// Import middlewares
import verifyAuth from "../middleware/authMiddleware.js";
import { checkOrder, createOrder, deleteMealOrder, deleteOneMealOrder, deleteOrder, editOrder, finishOrder, getOrders, payOrder } from "../controllers/ordersControllers.js";
import { isCaja, isCocina, isWaiter } from "../middleware/rolMiddleware.js";
const router = express.Router();

router.post('/', verifyAuth, isWaiter, createOrder);

router.put('/:id', verifyAuth, isWaiter, editOrder);

router.put('/deleteOne/:id', verifyAuth, isWaiter, deleteOneMealOrder);

router.put('/meal/:id', verifyAuth, isWaiter, deleteMealOrder);

router.delete('/order/:id', verifyAuth, isWaiter, deleteOrder);

router.get('/', verifyAuth, getOrders)

router.put('/check/:id', verifyAuth, isCocina, checkOrder);

router.put('/finish/:id', verifyAuth, isWaiter, finishOrder);

router.put('/pay/:id', verifyAuth, isCaja, payOrder);
 

export default router;