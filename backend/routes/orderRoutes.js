const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // Adjust import path as needed
const Order = require('../models/orderModel'); // You'll need to create this model
const Cart = require('../models/Cart'); // Adjust import path as needed
const crypto = require('crypto');

router.post('/verify', protect, async (req, res) => {
  console.log('Received orderDetails:', JSON.stringify(req.body.orderDetails, null, 2));
  console.log('Order items:', JSON.stringify(req.body.orderDetails?.items, null, 2));
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDetails
    } = req.body;

    // Debug logging
    console.log('Received verification request:', {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      orderDetails: orderDetails
    });

    // Verify signature
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
      return res.status(400).json({ 
        message: 'Transaction not legitimate!' 
      });
    }

    if (!orderDetails || !orderDetails.items || orderDetails.items.length === 0) {
      return res.status(400).json({ message: 'No items in order details' });
    }

    // Create new order using the orderDetails from the request
    const newOrder = new Order({
      user: req.user._id,
      orderItems: orderDetails.items.map(item => ({
        product: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress: orderDetails.shippingInfo,
      paymentMethod: 'Razorpay',
      paymentResult: {
        id: razorpay_payment_id,
        status: 'completed',
        update_time: Date.now(),
        order_id: razorpay_order_id,
      },
      itemsPrice: orderDetails.itemsPrice,
      shippingPrice: orderDetails.shippingPrice,
      totalPrice: orderDetails.totalPrice,
      isPaid: true,
      paidAt: Date.now(),
    });

    const createdOrder = await newOrder.save();

    // Clear the user's cart
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [] } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      order: createdOrder
    });
  } catch (error) {
    console.error('Order verification error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Create a new order
// router.post('/verify', protect, async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       shippingInfo
//     } = req.body;

//     // Verify signature
//     const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
//     shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
//     const digest = shasum.digest('hex');

//     // If verification fails
//     if (digest !== razorpay_signature) {
//       return res.status(400).json({ 
//         message: 'Transaction not legitimate!' 
//       });
//     }

//     // Get the user's cart
//     const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
//     if (!cart || !cart.items.length) {
//       return res.status(400).json({ message: 'No items in cart' });
//     }



//     // Calculate total amount
//     const cartTotal = cart.items.reduce((sum, item) => {
//       return sum + (item.price * item.quantity);
//     }, 0);

//     // Create new order
//     const newOrder = new Order({
//       user: req.user._id,
//       orderItems: cart.items.map(item => ({
//         product: item.product,
//         name: item.name,
//         quantity: item.quantity,
//         price: item.price,
//       })),
//       shippingAddress: {
//         fullName: shippingInfo.name,
//         address: shippingInfo.address,
//         city: shippingInfo.city,
//         state: shippingInfo.state,
//         postalCode: shippingInfo.pincode,
//         country: 'India',
//       },
//       paymentMethod: 'Razorpay',
//       paymentResult: {
//         id: razorpay_payment_id,
//         status: 'completed',
//         update_time: Date.now(),
//         order_id: razorpay_order_id,
//       },
//       itemsPrice: cartTotal,
//       shippingPrice: 50, // Fixed shipping price
//       totalPrice: cartTotal + 50,
//       isPaid: true,
//       paidAt: Date.now(),
//     });

//     const createdOrder = await newOrder.save();

//     // Clear the cart
//     cart.items = [];
//     await cart.save();

//     res.status(201).json(createdOrder);
//   } catch (error) {
//     console.error('Order creation error:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// Get user orders
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort('-createdAt');
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single order by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Make sure user is the owner of the order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;