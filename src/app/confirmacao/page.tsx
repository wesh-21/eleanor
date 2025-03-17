"use client"

import { Suspense } from 'react';

// Create a wrapper component that uses suspense
const ConfirmationPageWrapper = () => {
  return (
    <Suspense fallback={<LoadingState />}>
      <ConfirmationContent />
    </Suspense>
  );
};

// Loading state component
const LoadingState = () => (
  <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-300 mx-auto"></div>
      <p className="mt-4 text-gray-600">A verificar o estado do seu pagamento...</p>
    </div>
  </div>
);

// Actual content component
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Define interface for order details
interface OrderDetails {
  id: string;
  payment_id: string;
  amount: number;
  amount_total?: number;
  status: string;
  currency?: string;
  customer_email?: string;
  created?: number;
  payment_method?: string;
}

const ConfirmationContent = () => {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get('payment_intent_id');
  const orderId = searchParams.get('order_id');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      if (!paymentIntentId) {
        setStatus('error');
        return;
      }
      try {
        const response = await fetch(`/api/checkout-status?payment_intent_id=${paymentIntentId}`);
       
        if (!response.ok) {
          throw new Error('Falha ao verificar o estado do pagamento');
        }
        const data = await response.json();
       
        if (data.status === 'succeeded') {
          setStatus('success');
          // Use type assertion to safely merge the data
          setOrderDetails({
            id: orderId || 'N/A',
            payment_id: paymentIntentId,
            amount: data.amount,
            status: data.status,
            currency: data.currency,
            customer_email: data.customer_email,
            created: data.created,
            payment_method: data.payment_method
          });
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Erro:', error instanceof Error ? error.message : 'Erro desconhecido');
        setStatus('error');
      }
    };
    fetchPaymentStatus();
  }, [paymentIntentId, orderId]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      {status === 'loading' && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-300 mx-auto"></div>
          <p className="mt-4 text-gray-600">A verificar o estado do seu pagamento...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Pagamento Confirmado!</h2>
          <p className="mt-2 text-gray-600">O seu pedido foi recebido e está a ser processado.</p>
         
          {orderDetails && (
            <div className="mt-6 text-left bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium text-gray-700 mb-2">Detalhes do Pedido:</h3>
              <p className="text-sm text-gray-600">ID do Pedido: {orderDetails.id}</p>
              <p className="text-sm text-gray-600">Total: €{(orderDetails.amount / 100).toFixed(2)}</p>
              {orderDetails.customer_email && (
                <p className="text-sm text-gray-600">Email: {orderDetails.customer_email}</p>
              )}
            </div>
          )}
         
          <div className="mt-8">
            <Link href="/" className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors">
              Voltar à loja
            </Link>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Ocorreu um erro</h2>
          <p className="mt-2 text-gray-600">Não foi possível verificar o seu pagamento. Por favor, contacte o nosso suporte.</p>
         
          <div className="mt-8">
            <Link href="/" className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors">
              Voltar à loja
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmationPageWrapper;