// app/api/inventory/stock/route.js
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { products } = await request.json();
    
    if (!products || !Array.isArray(products)) {
      return NextResponse.json(
        { success: false, message: 'Invalid request format' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    const results = await Promise.all(
      products.map(async ({ _id, stock }) => {
        if (!_id || stock === undefined) {
          return { _id, success: false, message: 'Invalid product data' };
        }
        
        const updatedProduct = await Product.findByIdAndUpdate(
          _id,
          { stock },
          { new: true }
        );
        
        if (!updatedProduct) {
          return { _id, success: false, message: 'Product not found' };
        }
        
        return { 
          _id, 
          success: true, 
          stock: updatedProduct.stock 
        };
      })
    );
    
    return NextResponse.json({ 
      success: true, 
      results 
    });
    
  } catch (error) {
    console.error('Error updating stock:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update stock' },
      { status: 500 }
    );
  }
}