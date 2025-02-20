const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const userController = require('../controllers/userController');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Add debugging log
router.use((req, res, next) => {
    console.log('User Route accessed:', req.method, req.url);
    next();
});

// Admin routes
router.get('/admin/dashboard/stats', adminAuth, async (req, res) => {
    try {
        // Get total users count
        const totalUsers = await userController.getTotalUsers();
        
        res.json({
            success: true,
            totalUsers: totalUsers
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching user statistics',
            error: error.message 
        });
    }
});

// Add a route to get all users count
router.get('/users/count', adminAuth, async (req, res) => {
    try {
        const totalUsers = await userController.getTotalUsers();
        res.json({ success: true, count: totalUsers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Public routes (no auth required)
router.post('/login', userController.loginUser);
router.get('/login', userController.loginUser);
router.post('/register', userController.createUser);
router.get('/verify', userController.verifyUser);

// Protected routes that require admin access
router.get('/', adminAuth, userController.getUsers);
router.get('/check-user/:id', adminAuth, userController.checkUserExists);
router.get('/check-user', adminAuth, userController.checkUserExists);

// Regular user routes
router.get('/profile', auth, userController.getUserProfile);

// Add this route to debug token issues
router.get('/debug-token', async (req, res) => {
    const authHeader = req.headers.authorization;
    console.log('Debug Token Header:', authHeader);
    
    try {
        if (!authHeader) {
            return res.status(401).json({ message: 'No authorization header' });
        }

        const token = authHeader.startsWith('Bearer ')
            ? authHeader.slice(7)
            : authHeader;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ 
            valid: true, 
            decoded,
            originalHeader: authHeader
        });
    } catch (error) {
        res.status(401).json({ 
            valid: false, 
            error: error.message,
            originalHeader: authHeader
        });
    }
});

// Add this route if it doesn't exist
router.get('/count', async (req, res) => {
    try {
        const count = await User.countDocuments({ isAdmin: false }); // Count only non-admin users
        res.json({ 
            success: true, 
            count: count 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.json({ 
            success: true, 
            data: users 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

module.exports = router;