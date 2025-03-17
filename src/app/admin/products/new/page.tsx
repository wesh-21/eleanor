"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewProduct() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    stock: '',
    image: '',
    currency: 'EUR'
  });
  
  // Check authentication
  useEffect(() => {
    const isAuth = sessionStorage.getItem('adminAuth') === 'true';
    if (!isAuth) {
      router.push('/admin/login');
    }
  }, [router]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert string values to numbers where needed
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock)
    };
    
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      
      const data = await response.json();
      if (data.success) {
        alert('Product created successfully');
        router.push('/admin/products');
      } else {
        throw new Error(data.message || 'Failed to create product');
      }
    } catch (err) {
      console.error('Error creating product:', err);
      alert('Failed to create product');
    }
  };
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Add New Product</h1>
        <Link 
          href="/admin/products" 
          className="px-3 py-1 rounded bg-gray-200 text-sm"
        >
          Back
        </Link>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Price (€)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        {formData.image && (
          <div className="border rounded p-2 flex justify-center">
            <img 
              src={formData.image} 
              alt="Product preview" 
              className="h-32 object-contain"
              onError={(e) => {
                e.target.src = "/api/placeholder/100/100";
                e.target.onerror = null;
              }}
            />
          </div>
        )}
        
        <div className="pt-4">
          <button 
            type="submit"
            className="w-full py-2 px-4 rounded text-white"
            style={{ backgroundColor: '#ECACA1' }}
          >
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
}