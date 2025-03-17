// First, let's create a MongoDB schema for your products

// models/Product.js
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Please provide a product price'],
  },
  image: {
    type: String,
    required: [true, 'Please provide an image path'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
  },
  currency: {
    type: String,
    required: [true, 'Please provide a currency'],
    default: 'EUR',
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    default: 0,
  },
  category: {
    type: String,
    required: false,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Check if the model is already defined to prevent overwriting
export default mongoose.models.Product || mongoose.model('Product', ProductSchema);