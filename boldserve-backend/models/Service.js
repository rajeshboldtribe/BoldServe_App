const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true
    },
    subCategory: {
        type: String,
        required: [true, 'SubCategory is required'],
        trim: true
    },
    productName: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    offers: {
        type: String,
        trim: true
    },
    review: {
        type: String,
        trim: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    images: [{
        type: String,
        required: false
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema); 