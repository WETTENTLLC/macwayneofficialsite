'use client';

import { useState } from 'react';
import { CreditCard, DollarSign, Shield, AlertCircle } from 'lucide-react';

interface PaymentProps {
  amount: number;
  currency?: string;
  description: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
  className?: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  type: 'paypal' | 'stripe' | 'crypto';
  available: boolean;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'paypal',
    name: 'PayPal',
    icon: <DollarSign size={24} />,
    type: 'paypal',
    available: true
  },
  {
    id: 'card',
    name: 'Credit Card',
    icon: <CreditCard size={24} />,
    type: 'stripe',
    available: true
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    icon: <Shield size={24} />,
    type: 'crypto',
    available: false // Coming soon
  }
];

export default function PaymentComponent({ 
  amount, 
  currency = 'USD', 
  description,
  onSuccess,
  onError,
  className = "" 
}: PaymentProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('paypal');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  const handlePayPalPayment = async () => {
    setIsProcessing(true);
    setError('');

    try {
      // TODO: Implement PayPal SDK integration
      // This is a placeholder for the actual PayPal integration
      console.log('Processing PayPal payment:', { amount, currency, description });
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success
      const mockPaymentId = `pp_${Date.now()}`;
      onSuccess?.(mockPaymentId);
    } catch (err) {
      const errorMessage = 'PayPal payment failed. Please try again.';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStripePayment = async () => {
    setIsProcessing(true);
    setError('');

    try {
      // TODO: Implement Stripe SDK integration
      // This is a placeholder for the actual Stripe integration
      console.log('Processing Stripe payment:', { amount, currency, description });
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success
      const mockPaymentId = `stripe_${Date.now()}`;
      onSuccess?.(mockPaymentId);
    } catch (err) {
      const errorMessage = 'Credit card payment failed. Please try again.';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (selectedMethod === 'paypal') {
      await handlePayPalPayment();
    } else if (selectedMethod === 'card') {
      await handleStripePayment();
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <div className={`bg-black/90 border border-orange-500/30 rounded-lg p-6 ${className}`}>
      {/* Payment Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-orange-500 mb-2">Complete Payment</h3>
        <p className="text-gray-300">{description}</p>
        <div className="text-2xl font-bold text-white mt-2">
          {formatAmount(amount)}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-white mb-3">Select Payment Method</h4>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              disabled={!method.available || isProcessing}
              className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3 ${
                selectedMethod === method.id
                  ? 'border-orange-500 bg-orange-500/10'
                  : 'border-gray-600 hover:border-orange-500/50'
              } ${
                !method.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
              aria-label={`Select ${method.name} payment method`}
            >
              <div className={`p-2 rounded-full ${
                selectedMethod === method.id ? 'bg-orange-500 text-black' : 'bg-gray-700 text-gray-300'
              }`}>
                {method.icon}
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-white">{method.name}</div>
                {!method.available && (
                  <div className="text-sm text-gray-400">Coming Soon</div>
                )}
              </div>
              <div className={`w-4 h-4 rounded-full border-2 ${
                selectedMethod === method.id 
                  ? 'border-orange-500 bg-orange-500' 
                  : 'border-gray-400'
              }`}>
                {selectedMethod === method.id && (
                  <div className="w-full h-full rounded-full bg-orange-500" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-900/50 border border-red-500/50 rounded-lg flex items-center space-x-3">
          <AlertCircle className="text-red-500" size={20} />
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* Security Notice */}
      <div className="mb-6 p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="text-green-500" size={16} />
          <span className="text-sm font-medium text-green-500">Secure Payment</span>
        </div>
        <p className="text-xs text-gray-400">
          Your payment information is encrypted and secure. Mac Wayne Official uses industry-standard security measures.
        </p>
      </div>

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={isProcessing || !paymentMethods.find(m => m.id === selectedMethod)?.available}
        className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all duration-200 ${
          isProcessing 
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black transform hover:scale-105 shadow-lg'
        }`}
        aria-label={`Pay ${formatAmount(amount)} with ${paymentMethods.find(m => m.id === selectedMethod)?.name}`}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400" />
            <span>Processing...</span>
          </div>
        ) : (
          `Pay ${formatAmount(amount)}`
        )}
      </button>

      {/* Accessibility Features */}
      <div className="sr-only" aria-live="polite">
        {isProcessing && "Payment is being processed"}
        {error && `Payment error: ${error}`}
      </div>
    </div>
  );
}
