"use client"
import { useState, useEffect, ChangeEvent, SyntheticEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Define the Product interface
interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  description?: string;
}

export default function AdminProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
 
  // Check authentication
  useEffect(() => {
    const isAuth = sessionStorage.getItem('adminAuth') === 'true';
    if (!isAuth) {
      router.push('/admin/login');
      return;
    }
   
    // Fetch products
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        if (data.success) {
          setProducts(data.data);
        }
      } catch (err) {
        console.error('Error fetching products:', err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
   
    fetchProducts();
  }, [router]);
 
  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    router.push('/admin/login');
  };
 
  const updateStock = async (productId: string, stock: number) => {
    try {
      await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock })
      });
     
      // Update local state to reflect the change
      setProducts(products.map(product =>
        product._id === productId ? {...product, stock} : product
      ));
    } catch (err) {
      console.error('Error updating stock:', err instanceof Error ? err.message : 'Unknown error');
      alert('Failed to update stock');
    }
  };
 
  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }
 
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Products</h1>
        <div className="flex gap-2">
          <Link
            href="/admin/products/new"
            className="px-3 py-1 rounded text-white bg-green-500 text-sm"
          >
            Add Product
          </Link>
          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded bg-gray-200 text-sm"
          >
            Logout
          </button>
        </div>
      </div>
     
      <div className="space-y-4">
        {products.map(product => (
          <div key={product._id} className="bg-white p-3 rounded shadow">
            <div className="flex items-center gap-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover rounded"
                onError={(e: SyntheticEvent<HTMLImageElement, Event>) => {
                  const target = e.currentTarget;
                  target.src = "/api/placeholder/100/100";
                  target.onerror = null;
                }}
              />
              <div className="flex-1">
                <h2 className="font-medium">{product.name}</h2>
                <p className="text-sm text-gray-600">€{product.price.toFixed(2)}</p>
              </div>
            </div>
           
            <div className="mt-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm">Stock:</label>
                <input
                  type="number"
                  min="0"
                  value={product.stock}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => updateStock(product._id, parseInt(e.target.value))}
                  className="w-16 p-1 border rounded text-center"
                />
              </div>
              <Link
                href={`/admin/products/edit/${product._id}`}
                className="px-3 py-1 rounded text-white text-sm"
                style={{ backgroundColor: '#ECACA1' }}
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
       
        {products.length === 0 && (
          <p className="text-center py-8 text-gray-500">No products found</p>
        )}
      </div>
    </div>
  );
}