// app/api/inventory/update/route.js
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { items } = await request.json();
    
    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { success: false, message: 'Invalid request format. Expected array of items.' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Process each item in the order
    const updateResults = await Promise.all(
      items.map(async (item) => {
        const { _id, quantity } = item;
        
        if (!_id || !quantity || quantity <= 0) {
          return { 
            _id, 
            success: false, 
            message: 'Invalid item data' 
          };
        }
        
        // Find the product
        const product = await Product.findById(_id);
        
        if (!product) {
          return { 
            _id, 
            success: false, 
            message: 'Product not found' 
          };
        }
        
        // Check if enough stock is available
        if (product.stock < quantity) {
          return { 
            _id, 
            success: false, 
            message: `Insufficient stock. Only ${product.stock} available.`,
            availableStock: product.stock 
          };
        }
        
        // Update the stock
        const newStock = product.stock - quantity;
        product.stock = newStock;
        await product.save();
        
        return { 
          _id, 
          success: true, 
          newStock 
        };
      })
    );
    
    // Check if all updates were successful
    const allSuccessful = updateResults.every(result => result.success);
    
    if (allSuccessful) {
      return NextResponse.json({ 
        success: true, 
        message: 'Inventory updated successfully',
        results: updateResults 
      });
    } else {
      // If any update failed, return details about failures
      return NextResponse.json({ 
        success: false, 
        message: 'Some inventory updates failed',
        results: updateResults 
      }, { status: 400 });
    }
    
  } catch (error) {
    console.error('Error updating inventory:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update inventory' },
      { status: 500 }
    );
  }
}