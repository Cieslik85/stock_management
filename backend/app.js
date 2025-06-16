const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Import routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const stockRoutes = require('./routes/stockRoutes');
const stockMovementRoutes = require('./routes/stockMovementRoutes');
const reportRoutes = require('./routes/reportRoutes');
const orderRoutes = require('./routes/orderRoutes');
// const alertRoutes = require('./routes/alerts'); 

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/stock-movements', stockMovementRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/orders', orderRoutes);
// app.use('/api/alerts', alertRoutes); // enable when implemented

module.exports = app;
