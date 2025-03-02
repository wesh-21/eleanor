"use client"

import { useState } from "react";
import ShopHeader from "@/components/ShopHeader";
import Cart from "@/components/Cart";

// Define interfaces for our data types
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

// Sample product data with correct image paths
const products: Product[] = [
  { id: 1, name: "Shampoo", price: 15, image: "/shampoo.png", description: "Nourishing shampoo for all hair types" },
  { id: 2, name: "Conditioner", price: 18, image: "/conditioner.png", description: "Hydrating conditioner for smooth, silky hair" },
  { id: 3, name: "Hair Mask", price: 22, image: "/mask.jpg", description: "Deep conditioning treatment for damaged hair" },
  { id: 4, name: "Hair Oil", price: 25, image: "/oil.jpg", description: "Lightweight oil for shine and frizz control" },
];

export default function Shop() {
  // State for cart items with proper typing
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  
  // Add to cart function
  const addToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === product.id ? {...item, quantity: item.quantity + 1} : item
      ));
    } else {
      setCartItems([...cartItems, {...product, quantity: 1}]);
    }
  };
  
  // Remove from cart function
  const removeFromCart = (productId: number) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };
  
  // Update quantity function
  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === productId ? {...item, quantity: newQuantity} : item
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
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Our Products</h2>
        
        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
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
              </div>
              <div className="p-2 sm:p-4">
                <h3 className="text-sm sm:text-lg font-medium text-gray-800">{product.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2 sm:line-clamp-none">{product.description}</p>
                <div className="flex justify-between items-center mt-2 sm:mt-4">
                  <p className="text-sm sm:text-lg font-semibold">${product.price.toFixed(2)}</p>
                  <button
                    onClick={() => addToCart(product)}
                    className="px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-white font-medium text-xs sm:text-sm transition-colors duration-200"
                    style={{ backgroundColor: '#ECACA1', borderColor: '#ECACA1' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e09c91'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ECACA1'}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
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