"use client"

import { useState, useEffect } from "react";
import ShopHeader from "../components/ShopHeader";
import Cart from "../components/Cart";

// Define interfaces for our data types
interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  currency: string;
  stock: number;
  category?: string;
  featured?: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

export default function Shop() {
  // State for products from MongoDB
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for cart items with proper typing
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  
  // Fetch products from API on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.data);
        } else {
          throw new Error(data.message || 'Error fetching products');
        }
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Add to cart function
  const addToCart = (product: Product) => {
    // First check if item is in stock
    if (product.stock <= 0) {
      alert('This product is out of stock');
      return;
    }
    
    const existingItem = cartItems.find(item => item._id === product._id);
    
    if (existingItem) {
      // Check if we're trying to add more than what's in stock
      if (existingItem.quantity >= product.stock) {
        alert('Cannot add more of this item - stock limit reached');
        return;
      }
      
      setCartItems(cartItems.map(item => 
        item._id === product._id ? {...item, quantity: item.quantity + 1} : item
      ));
    } else {
      setCartItems([...cartItems, {...product, quantity: 1}]);
    }
  };
  
  // Remove from cart function
  const removeFromCart = (productId: string) => {
    setCartItems(cartItems.filter(item => item._id !== productId));
  };
  
  // Update quantity function
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    // Find the product to check stock
    const product = products.find(p => p._id === productId);
    
    if (product && newQuantity > product.stock) {
      alert(`Sorry, only ${product.stock} items available in stock`);
      newQuantity = product.stock;
    }
    
    setCartItems(cartItems.map(item => 
      item._id === productId ? {...item, quantity: newQuantity} : item
    ));
  };
  
  // Clear cart function
  const clearCart = () => {
    setCartItems([]);
  };
  
  // Calculate total items in cart
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  
  // Function to toggle cart visibility
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shop Header Component */}
      <ShopHeader itemCount={itemCount} toggleCart={toggleCart} />
      
      {/* Main content - add top padding to account for fixed header */}
      <main className="container mx-auto px-4 py-6 pt-24">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Os Nossos Produtos</h2>
        
        {/* Loading and error states */}
        {loading && (
          <div className="text-center py-10">
            <p>Loading products...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-10 text-red-500">
            <p>Error: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Try Again
            </button>
          </div>
        )}
        
        {/* Product grid */}
        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="h-32 sm:h-60 relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/api/placeholder/300/300";
                      target.onerror = null;
                    }}
                  />
                  {product.stock <= 0 && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs">
                      Out of Stock
                    </div>
                  )}
                </div>
                <div className="p-2 sm:p-4">
                  <h3 className="text-sm sm:text-lg font-medium text-gray-800">{product.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2 sm:line-clamp-none">{product.description}</p>
                  <div className="flex justify-between items-center mt-2 sm:mt-4">
                    <p className="text-sm sm:text-lg font-semibold">
                      {product.currency === "EUR" ? "€" : product.currency}{product.price.toFixed(2)}
                    </p>
                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.stock <= 0}
                      className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-white font-medium text-xs sm:text-sm transition-colors duration-200 ${
                        product.stock <= 0 ? 'bg-gray-400 cursor-not-allowed' : ''
                      }`}
                      style={{ 
                        backgroundColor: product.stock <= 0 ? '#cccccc' : '#ECACA1', 
                        borderColor: product.stock <= 0 ? '#cccccc' : '#ECACA1' 
                      }}
                      onMouseOver={(e) => {
                        if (product.stock > 0) {
                          e.currentTarget.style.backgroundColor = '#e09c91';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (product.stock > 0) {
                          e.currentTarget.style.backgroundColor = '#ECACA1';
                        }
                      }}
                    >
                      {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {product.stock > 0 ? `${product.stock} in stock` : 'Currently unavailable'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Empty state when no products */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No products available at the moment.</p>
          </div>
        )}
      </main>
      
      {/* Shopping Cart Component */}
      <Cart 
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        clearCart={clearCart}
      />
    </div>
  );
}