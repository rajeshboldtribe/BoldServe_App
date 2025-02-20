require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const productRoutes = require('./routes/productRoutes');
const subcategoriesRoute = require('./routes/subcategoriesRoute');
const adminRoute = require('./routes/adminRoute');
const mongoose = require('mongoose');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Update CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.ALLOWED_ORIGINS.split(',')
        : ['http://localhost:3002', 'http://localhost:3000', 'http://localhost:5000', 'http://localhost:5173'], // Added React admin frontend port
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Update MongoDB connection with additional options
const mongoConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('📦 MongoDB Connected Successfully');
        
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err);
        setTimeout(mongoConnect, 5000);
    }
};

mongoConnect();

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working' });
});

// Security middleware
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Debugging middleware
app.use((req, res, next) => {
    console.log('\n🔍 Incoming Request Details:');
    console.log('📍 URL:', req.originalUrl);
    console.log('📝 Method:', req.method);
    console.log('📦 Body:', req.body);
    console.log('🎯 Path:', req.path);
    next();
});

// Mount all routes
app.use('/api/services', serviceRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);  // This includes the dashboard stats endpoint
app.use('/api/payments', paymentRoutes);
app.use('/api/products', productRoutes);
app.use('/api/subcategories', subcategoriesRoute);
app.use('/api/admin', adminRoute);
app.use('/api/dashboard', dashboardRoutes);

// Enhanced error handling middleware
app.use((err, req, res, next) => {
    console.error('🔥 Server Error:', err);
    
    // Handle different types of errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: err.errors,
            type: 'ValidationError'
        });
    }
    
    if (err.name === 'MongoError' || err.name === 'MongoServerError') {
        return res.status(500).json({
            success: false,
            message: 'Database Error',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
            type: 'DatabaseError'
        });
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        type: 'GeneralError'
    });
});

// Enhanced 404 handler
app.use('*', (req, res) => {
    console.log('\n❌ 404 Error Details:');
    console.log('📍 Attempted URL:', req.originalUrl);
    console.log('📝 Method:', req.method);
    
    res.status(404).json({
        status: 'error',
        message: 'Route not found',
        details: {
            requestedUrl: req.originalUrl,
            method: req.method,
            availableRoutes: [
                '/api/services',
                '/api/categories',
                '/api/orders',
                '/api/users',
                '/api/payments',
                '/api/products',
                '/api/subcategories',
                '/api/admin'
            ]
        }
    });
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const PORT = process.env.PORT || 8003;
app.listen(PORT, () => {
    console.log(`
🚀 Server is running on port ${PORT}
📁 Upload directory initialized
🌐 API URL: http://localhost:${PORT}
    `);
});

module.exports = app;