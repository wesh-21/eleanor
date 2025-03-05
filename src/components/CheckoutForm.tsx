"use client"

import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";

interface ShippingInfo {
  name: string;
  address: string;
  postalCode: string;
  phone: string;
  email: string;
}

interface CheckoutFormProps {
  cartItems: any[];
  totalPrice: number;
  clearCart: () => void;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CheckoutForm = ({ 
  cartItems, 
  totalPrice, 
  clearCart, 
  setIsCartOpen 
}: CheckoutFormProps) => {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});
  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment'>('shipping');
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    name: '',
    address: '',
    postalCode: '',
    phone: '',
    email: '',
  });
  const [errors, setErrors] = useState<Partial<ShippingInfo>>({});

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro quando o usuário começa a digitar
    if (errors[name as keyof ShippingInfo]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateShippingInfo = (): boolean => {
    const newErrors: Partial<ShippingInfo> = {};
    let isValid = true;

    // Validar nome
    if (!shippingInfo.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
      isValid = false;
    }

    // Validar morada
    if (!shippingInfo.address.trim()) {
      newErrors.address = 'Morada é obrigatória';
      isValid = false;
    }

    // Validar código postal (formato português: XXXX-XXX)
    const postalCodeRegex = /^\d{4}-\d{3}$/;
    if (!postalCodeRegex.test(shippingInfo.postalCode)) {
      newErrors.postalCode = 'Formato inválido. Use XXXX-XXX';
      isValid = false;
    }

    // Validar telefone (formato português)
    const phoneRegex = /^9\d{8}$|^2\d{8}$|^3\d{8}$/;
    if (!phoneRegex.test(shippingInfo.phone)) {
      newErrors.phone = 'Número de telefone inválido';
      isValid = false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingInfo.email)) {
      newErrors.email = 'Email inválido';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateShippingInfo()) {
      setCurrentStep('payment');
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setIsProcessing(true);

    try {
      // Enviar informações de entrega junto com o pagamento
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems,
          amount: totalPrice,
          shippingInfo: shippingInfo
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const { clientSecret, paymentIntentId, orderId } = await response.json();

      // Confirm the payment with Stripe.js
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: shippingInfo.name,
            email: shippingInfo.email,
            phone: shippingInfo.phone,
            address: {
              line1: shippingInfo.address,
              postal_code: shippingInfo.postalCode,
              country: 'PT', // Portugal
            }
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
            message: 'Pagamento realizado com sucesso! Redirecionando...',
          });
          
          // Limpar carrinho
          clearCart();
          setIsCartOpen(false);
          
          // Redirecionar para a página de confirmação
          setTimeout(() => {
            router.push(`/confirmacao?payment_intent_id=${paymentIntentId}&order_id=${orderId}`);
          }, 1500);
        }
      }
    } catch (error) {
      setPaymentStatus({
        success: false,
        message: 'Ocorreu um erro ao processar o pagamento.',
      });
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToShipping = () => {
    setCurrentStep('shipping');
  };

  return (
    <div className="mt-4">
      {currentStep === 'shipping' ? (
        <form onSubmit={handleShippingSubmit} className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Informações de Entrega</h3>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome completo *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={shippingInfo.name}
              onChange={handleShippingChange}
              className={`mt-1 block w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Morada completa *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={shippingInfo.address}
              onChange={handleShippingChange}
              className={`mt-1 block w-full px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500`}
            />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
          </div>
          
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
              Código Postal * (XXXX-XXX)
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              placeholder="1000-100"
              value={shippingInfo.postalCode}
              onChange={handleShippingChange}
              className={`mt-1 block w-full px-3 py-2 border ${errors.postalCode ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500`}
            />
            {errors.postalCode && <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>}
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Telefone *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="912345678"
              value={shippingInfo.phone}
              onChange={handleShippingChange}
              className={`mt-1 block w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500`}
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={shippingInfo.email}
              onChange={handleShippingChange}
              className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          
          <button
            type="submit"
            className="w-full py-3 rounded-lg text-white font-medium transition-colors duration-200"
            style={{ backgroundColor: '#ECACA1' }}
          >
            Continuar para Pagamento
          </button>
        </form>
      ) : (
        <div>
          <button 
            onClick={handleBackToShipping}
            className="flex items-center text-gray-600 mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Voltar às Informações de Entrega
          </button>
          
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <h4 className="font-medium text-gray-800">Resumo de Entrega</h4>
            <p className="text-sm text-gray-600">{shippingInfo.name}</p>
            <p className="text-sm text-gray-600">{shippingInfo.address}</p>
            <p className="text-sm text-gray-600">{shippingInfo.postalCode}</p>
            <p className="text-sm text-gray-600">{shippingInfo.phone}</p>
            <p className="text-sm text-gray-600">{shippingInfo.email}</p>
          </div>
          
          <form onSubmit={handlePaymentSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detalhes do Cartão
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
              disabled={!stripe || isProcessing}
              className="w-full py-3 rounded-lg text-white font-medium transition-colors duration-200 disabled:opacity-50"
              style={{ backgroundColor: '#ECACA1' }}
            >
              {isProcessing ? 'Processando...' : `Pagar €${totalPrice.toFixed(2)}`}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;