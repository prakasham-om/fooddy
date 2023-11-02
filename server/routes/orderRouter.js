import express from 'express';


import { createOrder,getOrdersByUser,removeAllOrders,removeAllSimilarOrder,removeOrder } from '../controllers/orderController.js';
import { protectUser } from '../controllers/userController.js';

const orderRouter=express.Router();

//api:   https://localhost:8080/api/order/
orderRouter.route('/').post(protectUser,createOrder).get(protectUser,getOrdersByUser);

//api:   https://localhost:8080/api/order/:orderid  (for remove one by one)
orderRouter.route('/:id').delete(protectUser,removeOrder);

//api:   https://localhost:8080/api/order/:orderid (remove all similar product that match with id)
orderRouter.route('/similarorder/:id').delete(protectUser,removeAllSimilarOrder);

//api:   https://localhost:8080/api/order/all/delete
orderRouter.delete('/all/delete',protectUser,removeAllOrders)

export default orderRouter;
