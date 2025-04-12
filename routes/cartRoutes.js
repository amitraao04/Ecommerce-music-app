const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart,updateCartItemQuantity,clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.post('/remove', protect, removeFromCart);
router.put('/update', protect, updateCartItemQuantity);
router.delete('/clear', protect, clearCart);


module.exports = router;
