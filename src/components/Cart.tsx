"use client"

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Replace with your Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

// Define types
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

interface CartProps {
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cartItems: CartItem[];
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
  clearCart: () => void;
}

// CheckoutForm component to handle Stripe payment
const CheckoutForm = ({ 
  cartItems, 
  totalPrice, 
  clearCart, 
  setIsCartOpen 
}: { 
  cartItems: CartItem[]; 
  totalPrice: number; 
  clearCart: () => void; 
  setIsCartOpen: (isOpen: boolean) => void; 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setIsProcessing(true);

    try {
      // Create a payment intent on your server
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems,
          amount: totalPrice,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const { clientSecret } = await response.json();

      // Confirm the payment with Stripe.js
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            // You can collect this information from the user if needed
            name: 'Customer',
          },
        }
      });

      if (result.error) {
        // Show error to your customer
        setPaymentStatus({
          success: false,
          message: result.error.message,
        });
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          // Payment successful
          setPaymentStatus({
            success: true,
            message: 'Payment successful!',
          });
          // Clear cart and close it after successful payment
          setTimeout(() => {
            clearCart();
            setIsCartOpen(false);
          }, 2000);
        }
      }
    } catch (error) {
      setPaymentStatus({
        success: false,
        message: 'An error occurred while processing your payment.',
      });
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card details
        </label>
        <div className="p-3 border border-gray-300 rounded-md">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {paymentStatus.message && (
        <div 
          className={`p-3 rounded-md mb-4 ${
            paymentStatus.success 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}
        >
          {paymentStatus.message}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing || cartItems.length === 0}
        className="w-full py-3 rounded-lg text-white font-medium transition-colors duration-200 disabled:opacity-50"
        style={{ backgroundColor: cartItems.length === 0 ? '#cccccc' : '#ECACA1' }}
      >
        {isProcessing ? 'Processing...' : `Pay $${totalPrice.toFixed(2)}`}
      </button>
    </form>
  );
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
                        <div key={item.id} className="flex justify-between text-sm mb-1">
                          <span>{item.name} (x{item.quantity})</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-medium mt-2 pt-2 border-t">
                        <span>Total:</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <Elements stripe={stripePromise}>
                      <CheckoutForm 
                        cartItems={cartItems} 
                        totalPrice={totalPrice} 
                        clearCart={clearCart}
                        setIsCartOpen={setIsCartOpen}
                      />
                    </Elements>
                  </div>
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
              {!checkoutMode && (
                <div className="border-t p-4">
                  <div className="flex justify-between mb-4">
                    <span className="font-medium text-gray-800">Total:</span>
                    <span className="font-semibold">${totalPrice.toFixed(2)}</span>
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