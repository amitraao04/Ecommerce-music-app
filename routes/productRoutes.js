const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, createProduct); // Ideally check for admin
router.put('/:id', protect, updateProduct); // Ideally check for admin
router.delete('/:id', protect, deleteProduct); // Ideally check for admin

module.exports = router;
