"use client"

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const { productId } = params;
  
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    stock: 0,
    image: ''
  });
  const [loading, setLoading] = useState(true);
  
  // Check authentication
  useEffect(() => {
    const isAuth = sessionStorage.getItem('adminAuth') === 'true';
    if (!isAuth) {
      router.push('/admin/login');
      return;
    }
    
    // Fetch product data
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        const data = await response.json();
        if (data.success) {
          setFormData({
            name: data.data.name,
            price: data.data.price,
            description: data.data.description,
            stock: data.data.stock,
            image: data.data.image
          });
        }
      } catch (err) {
        console.error('Error fetching product:', err instanceof Error ? err.message : 'Unknown error');
        alert('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId, router]);
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value
    });
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (data.success) {
        alert('Product updated successfully');
        router.push('/admin/products');
      } else {
        throw new Error(data.message || 'Failed to update product');
      }
    } catch (err) {
      console.error('Error updating product:', err instanceof Error ? err.message : 'Unknown error');
      alert('Failed to update product');
    }
  };
  
  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Edit Product</h1>
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
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                const target = e.currentTarget;
                target.src = "/api/placeholder/100/100";
                target.onerror = null;
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
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}