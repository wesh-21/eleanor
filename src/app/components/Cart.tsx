"use client"

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

// Replace with your Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

// Define types
interface Product {
  _id: string; // Changed from id: number to _id: string for MongoDB
  name: string;
  price: number;
  image: string;
  description: string;
  currency: string;
  stock?: number; // Added stock property
}

interface CartItem extends Product {
  quantity: number;
}

interface CartProps {
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cartItems: CartItem[];
  removeFromCart: (productId: string) => void; // Changed from number to string
  updateQuantity: (productId: string, newQuantity: number) => void; // Changed from number to string
  clearCart: () => void;
}

// Function to get currency symbol
const getCurrencySymbol = (currency: string): string => {
  switch (currency) {
    case "EUR":
      return "€";
    case "USD":
      return "$";
    case "GBP":
      return "£";
    default:
      return currency;
  }
};

// Main Cart component
const Cart: React.FC<CartProps> = ({
  isCartOpen,
  setIsCartOpen,
  cartItems,
  removeFromCart,
  updateQuantity,
  clearCart
}) => {
  const [checkoutMode, setCheckoutMode] = useState(false);
  
  // Calculate total price
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity, 
    0
  );
  
  // Calculate total items in cart
  const itemCount = cartItems.reduce(
    (count, item) => count + item.quantity, 
    0
  );

  // Get currency from first item (assuming all items have same currency)
  const currency = cartItems.length > 0 ? cartItems[0].currency : "EUR";
  const currencySymbol = getCurrencySymbol(currency);

  const handleBackToCart = () => {
    setCheckoutMode(false);
  };

  const handleProceedToCheckout = () => {
    setCheckoutMode(true);
  };

  return (
    <>
      {isCartOpen && (
        <div className="fixed inset-0 z-20 overflow-hidden">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50" 
            onClick={() => setIsCartOpen(false)}
          ></div>
          
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300">
            <div className="flex flex-col h-full">
              {/* Cart header */}
              <div className="px-4 py-3 border-b flex justify-between items-center" style={{ backgroundColor: '#F3CEC6' }}>
                <h2 className="text-lg font-semibold text-gray-800">
                  {checkoutMode ? 'Checkout' : `Your Cart (${itemCount} items)`}
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Cart items or checkout form */}
              <div className="flex-grow overflow-y-auto p-4">
                {cartItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Your cart is empty</p>
                ) : checkoutMode ? (
                  <div>
                    <button 
                      onClick={handleBackToCart}
                      className="flex items-center text-gray-600 mb-4"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      Back to cart
                    </button>
                    
                    <div className="mb-4 border-b pb-4">
                      <h3 className="font-medium text-gray-800 mb-2">Order Summary</h3>
                      {cartItems.map(item => (
                        <div key={item._id} className="flex justify-between text-sm mb-1">
                          <span>{item.name} (x{item.quantity})</span>
                          <span>{getCurrencySymbol(item.currency)}{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-medium mt-2 pt-2 border-t">
                        <span>Total:</span>
                        <span>{currencySymbol}{totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <Elements stripe={stripePromise}>
                      <CheckoutForm 
                        cartItems={cartItems} 
                        totalPrice={totalPrice} 
                        clearCart={clearCart}
                        setIsCartOpen={setIsCartOpen}
                        currency={currency}
                      />
                    </Elements>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {cartItems.map(item => (
                      <li key={item._id} className="py-4 flex">
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
                              onClick={() => removeFromCart(item._id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">{getCurrencySymbol(item.currency)}{item.price.toFixed(2)}</p>
                          <div className="mt-2 flex items-center">
                            <button 
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="text-gray-500 hover:text-gray-700 h-6 w-6 flex items-center justify-center rounded-full border border-gray-300"
                            >
                              -
                            </button>
                            <span className="mx-2 text-gray-700">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
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
              {!checkoutMode && (
                <div className="border-t p-4">
                  <div className="flex justify-between mb-4">
                    <span className="font-medium text-gray-800">Total:</span>
                    <span className="font-semibold">{currencySymbol}{totalPrice.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={handleProceedToCheckout}
                    disabled={cartItems.length === 0}
                    className="w-full py-3 rounded-lg text-white font-medium transition-colors duration-200 disabled:opacity-50"
                    style={{ backgroundColor: cartItems.length === 0 ? '#cccccc' : '#ECACA1' }}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;