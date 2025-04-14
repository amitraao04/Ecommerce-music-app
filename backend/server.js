const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes'); // Add this line
const Razorpay = require('razorpay');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/images', express.static('public/images'));
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes); 

app.post("/order", async (req, res) => {
  try {
    // Check for credentials
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
      return res.status(500).send("Server configuration error: Razorpay credentials missing");
    }

    // Initialize Razorpay with correct variable names
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET, // Match your .env variable name
    });
    
    // Validate request
    if (!req.body.amount) {
      return res.status(400).json({ error: "Amount is required" });
    }
    
    // Ensure amount is a number and convert to paise (smallest currency unit)
    const amount = parseInt(Math.round(parseFloat(req.body.amount))*100); // Convert to paise
    
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount value" });
    }
    
    // Create order with required parameters
    const orderOptions = {
      amount: (amount/100).toString(), // Amount in rupees
      currency: req.body.currency || "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1 // Auto-capture payment
    };
    
    console.log("Creating order with options:", orderOptions);
    
    // Create the order
    const order = await razorpay.orders.create(orderOptions);
    
    console.log("Order created:", order);
    res.status(200).json(order);
    
  } catch (error) {
    console.error("Detailed Razorpay Error:", error);
    
    // Provide a more descriptive error response
    res.status(500).json({
      message: "Razorpay Order Creation Failed",
      error: error.message,
      details: error.stack
    });
  }
});

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));