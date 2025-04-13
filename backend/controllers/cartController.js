const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get user cart
// exports.getCart = async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
//     res.json(cart || { userId: req.user._id, items: [] });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// @desc Get user's cart
exports.getCart = async (req, res) => {
    try {
      let cart = await Cart.findOne({ userId: req.user._id });
  
      if (!cart) {
        // If cart doesn't exist, create one
        cart = await Cart.create({ userId: req.user._id, items: [] });
      }
  
      res.json(cart);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };


//   exports.getCart = async (req, res) => {
//   try {
//     let cart = await Cart.findOne({ userId: req.user._id });

//     if (!cart) {
//       cart = await Cart.create({ userId: req.user._id, items: [] });
//     }

//     res.json(cart);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

  

// Add item to cart
// exports.addToCart = async (req, res) => {
//   const { productId, quantity } = req.body;

//   try {
//     let cart = await Cart.findOne({ userId: req.user._id });

//     if (!cart) {
//       cart = new Cart({ userId: req.user._id, items: [] });
//     }

//     const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

//     if (itemIndex > -1) {
//       cart.items[itemIndex].quantity += quantity;
//     } else {
//       cart.items.push({ productId, quantity });
//     }

//     await cart.save();
//     res.status(200).json(cart);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    const product = await Product.findById(productId); // Get product details
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        price: product.price, // Store price
        name: product.name,   // Optional: store name
        image: product.image  // Optional: store image
      });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Remove item from cart
exports.removeFromCart = async (req, res) => {
  const { productId } = req.body;

  try {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateCartItemQuantity = async (req, res) => {
    const { productId, quantity } = req.body;
  
    try {
      const cart = await Cart.findOne({ userId: req.user._id });
  
      if (!cart) return res.status(404).json({ message: 'Cart not found' });
  
      const itemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId
      );
  
      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found in cart' });
      }
  
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
  
      await cart.save();
      res.json(cart);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

// Clear cart
exports.clearCart = async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.user._id });
  
      if (!cart) return res.status(404).json({ message: 'Cart not found' });
  
      cart.items = [];
      await cart.save();
  
      res.json({ message: 'Cart cleared successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
