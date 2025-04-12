const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');

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

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
