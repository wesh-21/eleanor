"use client"

import { useState } from "react";

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
  
  // Calculate total price
  const totalPrice = cartItems.reduce((sum, item) => 
    sum + item.price * item.quantity, 0
  );
  
  // Calculate total items in cart
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  
  // Function to handle checkout
  const handleCheckout = () => {
    alert(`Processing order for ${itemCount} items totaling $${totalPrice.toFixed(2)}`);
    // Here you would typically integrate with a payment processor
    setCartItems([]);
    setIsCartOpen(false);
  };
  
  // Function to handle back button
  const handleBackClick = () => {
    // You can replace this with your navigation method
    window.history.back();
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-[#ECACA1] via-[#F3CEC6] to-[#ECACA1] bg-opacity-70 shadow-md h-16 z-10">
  <div className="container mx-auto px-4 h-full relative flex items-center">
    
    {/* Back Button (Left-Aligned) */}
    <div className="absolute left-0 flex items-center h-full px-4">
      <button 
        onClick={handleBackClick}
        className="p-2 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-gray-100"
        style={{ color: '#ECACA1' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="ml-1 text-gray-700 font-medium">Back</span>
      </button>
    </div>

    {/* Logo (Centered and Fixed) */}
    <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center h-full">
      <img
        src="/logo.png"
        alt="Company Logo"
        className="h-16 object-contain"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/api/placeholder/120/60";
          target.onerror = null;
        }}
      />
    </div>

    {/* Cart Button (Right-Aligned) */}
    <div className="absolute right-0 flex items-center h-full px-4">
      <button 
        onClick={() => setIsCartOpen(!isCartOpen)}
        className="relative p-2 rounded-full transition-all duration-200"
        style={{ backgroundColor: '#F3CEC6' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gray-700 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {itemCount}
          </span>
        )}
      </button>
    </div>

  </div>
</header>


      
      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Our Products</h2>
        
        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="h-64 relative">
                <img 
                  src={product.image}
                  alt={product.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/api/placeholder/300/300";
                    target.onerror = null;
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-lg font-semibold">${product.price.toFixed(2)}</p>
                  <button 
                    onClick={() => addToCart(product)}
                    className="px-4 py-2 rounded-lg text-white font-medium text-sm transition-colors duration-200"
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
      
      {/* Shopping Cart Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-20 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsCartOpen(false)}></div>
          
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300">
            <div className="flex flex-col h-full">
              {/* Cart header */}
              <div className="px-4 py-3 border-b flex justify-between items-center" style={{ backgroundColor: '#F3CEC6' }}>
                <h2 className="text-lg font-semibold text-gray-800">Your Cart ({itemCount} items)</h2>
                <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Cart items */}
              <div className="flex-grow overflow-y-auto p-4">
                {cartItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Your cart is empty</p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {cartItems.map(item => (
                      <li key={item.id} className="py-4 flex">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="h-16 w-16 rounded-md object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/api/placeholder/300/300";
                            target.onerror = null;
                          }}
                        />
                        <div className="ml-3 flex-grow">
                          <div className="flex justify-between">
                            <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)}</p>
                          <div className="mt-2 flex items-center">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="text-gray-500 hover:text-gray-700 h-6 w-6 flex items-center justify-center rounded-full border border-gray-300"
                            >
                              -
                            </button>
                            <span className="mx-2 text-gray-700">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-gray-500 hover:text-gray-700 h-6 w-6 flex items-center justify-center rounded-full border border-gray-300"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              {/* Cart footer with checkout */}
              <div className="border-t p-4">
                <div className="flex justify-between mb-4">
                  <span className="font-medium text-gray-800">Total:</span>
                  <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                  className="w-full py-3 rounded-lg text-white font-medium transition-colors duration-200 disabled:opacity-50"
                  style={{ backgroundColor: cartItems.length === 0 ? '#cccccc' : '#ECACA1' }}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}