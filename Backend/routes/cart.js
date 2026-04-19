import express from 'express';
import {
    addToCart,
    removeFromCart,
    updateQuantity,
    getCart,


} from '../Controller/cartController.js';

const router = express.Router();


//add item to cart
router.post('/add', addToCart);

//remove item from cart
router.post('/remove', removeFromCart);

//update cart item quantity
router.post('/update', updateQuantity); 


//get cart items
router.get('/:userId', getCart);

export default router;