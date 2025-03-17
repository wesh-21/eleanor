// scripts/seed-products.js
// This script will help you seed your initial product data into MongoDB
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Setup to allow __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
console.log("Connection string:", MONGODB_URI ? "Found" : "Not found");

// Define Product Schema (same as in your app)
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

const Product = mongoose.model('Product', ProductSchema);

// Initial product data
const initialProducts = [
  {
    name: "Shampoo",
    price: 15,
    image: "/shampoo.png",
    description: "Nourishing shampoo for all hair types",
    currency: "EUR",
    stock: 25,
    category: "Hair Care"
  },
  {
    name: "Conditioner",
    price: 18,
    image: "/conditioner.png",
    description: "Hydrating conditioner for smooth, silky hair",
    currency: "EUR",
    stock: 20,
    category: "Hair Care"
  },
  {
    name: "Hair Mask",
    price: 22,
    image: "/mask.jpg",
    description: "Deep conditioning treatment for damaged hair",
    currency: "EUR",
    stock: 15,
    category: "Hair Care"
  },
  {
    name: "Hair Oil",
    price: 25,
    image: "/oil.jpg",
    description: "Lightweight oil for shine and frizz control",
    currency: "EUR",
    stock: 18,
    category: "Hair Care"
  },
];

// Connect to MongoDB and seed data
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });
   
    console.log('Connected to MongoDB');
   
    // Delete all existing products (optional)
    // Uncomment the next line if you want to start fresh
    // await Product.deleteMany({});
   
    // Insert initial products
    const insertedProducts = await Product.insertMany(initialProducts);
   
    console.log(`Successfully seeded ${insertedProducts.length} products`);
   
    // Print each inserted product
    insertedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - €${product.price} - Stock: ${product.stock}`);
    });
   
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

// Run the seeding function
seedDatabase();