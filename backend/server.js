require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// Connect to database
connectDB();

// Create necessary directories
const uploadsDir = path.join(__dirname, 'uploads');
const inventoryUploadsDir = path.join(__dirname, 'uploads', 'inventory');
const projectsUploadsDir = path.join(__dirname, 'uploads', 'projects');
const paymentsUploadsDir = path.join(__dirname, 'uploads', 'payments');

// Create directories if they don't exist
[uploadsDir, inventoryUploadsDir, projectsUploadsDir, paymentsUploadsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// CORS Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Ensure CORS headers are applied to static file responses
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, filePath) => {
    console.log(`Serving static file: ${filePath}`);
    if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (filePath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (filePath.endsWith('.avif')) {
      res.setHeader('Content-Type', 'image/avif');
    }
  }
}));

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Add response timeout middleware
app.use((req, res, next) => {
  res.setTimeout(10000, () => {
    res.status(408).send('Request timeout');
  });
  next();
});

// Routes
console.log('Mounting routes...');
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes')); // User order routes
app.use('/api/admin/orders', require('./routes/adminOrderRoutes')); // Admin order routes
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/financial', require('./routes/financialRoutes'));
console.log('Routes mounted');

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    dbConnection: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));