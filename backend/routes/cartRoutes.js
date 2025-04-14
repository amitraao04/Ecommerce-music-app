const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart,updateCartItemQuantity,clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');
const Cart = require('../models/Cart');

router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.post('/remove', protect, removeFromCart);
router.put('/update', protect, updateCartItemQuantity);
router.delete('/clear', protect, clearCart);
router.delete('/', protect, async (req, res) => {
    try {
      await Cart.findOneAndUpdate(
        { user: req.user._id },
        { $set: { items: [] } },
        { new: true }
      );
      
      res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).json({ message: 'Failed to clear cart' });
    }
  });


module.exports = router;
