const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Cart = require('../models/Cart');
const Product = require('../models/Product'); // Import your product models
const ITService = require('../models/ITService');
const PrintDemand = require('../models/PrintDemand');

// Get cart items
router.get('/items', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id });
        
        if (!cart) {
            return res.json({ items: [] });
        }

        // Fetch items from all categories
        const cartItems = await Promise.all(cart.items.map(async (item) => {
            let product;
            
            switch (item.category) {
                case 'Office Stationaries':
                    product = await Product.findById(item.productId);
                    break;
                case 'IT Services and Repair':
                    product = await ITService.findById(item.productId);
                    break;
                case 'Print and Demands':
                    product = await PrintDemand.findById(item.productId);
                    break;
                default:
                    return null;
            }

            if (!product) return null;

            return {
                _id: item.productId,
                productName: product.productName || product.name,
                price: product.price,
                quantity: item.quantity,
                stockQuantity: product.stockQuantity,
                image: product.image,
                category: item.category
            };
        }));

        // Filter out any null values from deleted products
        const validCartItems = cartItems.filter(item => item !== null);

        res.json({ items: validCartItems });
    } catch (error) {
        console.error('Cart fetch error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
    try {
        const { productId, quantity, category } = req.body;
        
        // Validate product exists in the correct category
        let product;
        switch (category) {
            case 'Office Stationaries':
                product = await Product.findById(productId);
                break;
            case 'IT Services and Repair':
                product = await ITService.findById(productId);
                break;
            case 'Print and Demands':
                product = await PrintDemand.findById(productId);
                break;
            default:
                return res.status(400).json({ message: 'Invalid category' });
        }

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ userId: req.user.id });
        
        if (!cart) {
            cart = new Cart({
                userId: req.user.id,
                items: [{
                    productId,
                    quantity,
                    category
                }]
            });
        } else {
            const itemIndex = cart.items.findIndex(item => 
                item.productId.toString() === productId && item.category === category
            );

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ productId, quantity, category });
            }
        }

        await cart.save();
        res.json({ message: 'Item added to cart' });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update cart item quantity
router.put('/:itemId', auth, async (req, res) => {
    try {
        const { quantity, category } = req.body;
        const cart = await Cart.findOne({ userId: req.user.id });
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => 
            item.productId.toString() === req.params.itemId && 
            item.category === category
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        res.json({ message: 'Cart updated' });
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Remove item from cart
router.delete('/:itemId', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id });
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => 
            item.productId.toString() !== req.params.itemId
        );

        await cart.save();
        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get cart summary
router.get('/summary', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id });
        
        if (!cart) {
            return res.json({
                subtotal: 0,
                gst: 0,
                total: 0
            });
        }

        // Calculate total from all categories
        let subtotal = 0;
        
        for (const item of cart.items) {
            let product;
            switch (item.category) {
                case 'Office Stationaries':
                    product = await Product.findById(item.productId);
                    break;
                case 'IT Services and Repair':
                    product = await ITService.findById(item.productId);
                    break;
                case 'Print and Demands':
                    product = await PrintDemand.findById(item.productId);
                    break;
            }
            
            if (product) {
                subtotal += product.price * item.quantity;
            }
        }

        const gst = subtotal * 0.18;
        const total = subtotal + gst;

        res.json({
            subtotal: parseFloat(subtotal.toFixed(2)),
            gst: parseFloat(gst.toFixed(2)),
            total: parseFloat(total.toFixed(2))
        });
    } catch (error) {
        console.error('Cart summary error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;