'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, CreditCard } from 'lucide-react';
import Link from 'next/link';
import PaymentComponent from '../../components/PaymentComponent';

interface CartItem {
  id: string;
  name: string;
  price: number;
  type: 'music' | 'merch' | 'digital';
  quantity: number;
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    // In a real app, cart items would be fetched from localStorage or a cart service
    const mockCart: CartItem[] = [
      { id: '1', name: 'Blind & Battered - Full Album', price: 15.99, type: 'music', quantity: 1 },
      { id: '3', name: 'Blind & Battered Hoodie', price: 34.99, type: 'merch', quantity: 1 },
    ];
    setCartItems(mockCart);
    setIsLoading(false);
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateTotal() * 0.08; // 8% tax
  };

  const calculateFinalTotal = () => {
    return calculateTotal() + calculateTax();
  };

  const handlePaymentSuccess = (paymentId: string) => {
    setPaymentSuccess(true);
    setPaymentError('');
    console.log('Payment successful:', paymentId);
    // In a real app, you would:
    // 1. Send order to backend
    // 2. Clear cart
    // 3. Send confirmation email
    // 4. Redirect to success page
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
    setPaymentSuccess(false);
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="bebas-header text-4xl text-orange-500 mb-4">PAYMENT SUCCESSFUL!</h1>
            <p className="text-xl text-gray-300 mb-8">
              Thank you for supporting Mac Wayne&apos;s journey. Your order has been confirmed.
            </p>
            <div className="space-y-4">
              <Link 
                href="/shop" 
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-bold transition-colors"
              >
                Continue Shopping
              </Link>
              <Link 
                href="/" 
                className="inline-block bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-bold transition-colors ml-4"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-black py-8 px-4 border-b-2 border-orange-500">
        <div className="max-w-6xl mx-auto">
          <Link 
            href="/shop" 
            className="inline-flex items-center text-orange-500 hover:text-orange-400 transition-colors mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Shop
          </Link>
          <h1 className="bebas-header text-4xl text-white">
            <ShoppingCart className="inline mr-3" size={36} />
            CHECKOUT
          </h1>
          <p className="text-gray-400 mt-2">Complete your order from Mac Wayne Official</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <h2 className="bebas-header text-2xl text-orange-500 mb-4">ORDER SUMMARY</h2>
            
            {cartItems.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <ShoppingCart size={48} className="text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Your cart is empty</p>
                <Link 
                  href="/shop" 
                  className="inline-block mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{item.name}</h3>
                        <p className="text-sm text-gray-400 capitalize">{item.type}</p>
                        <p className="text-orange-500 font-bold">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="bg-gray-700 hover:bg-gray-600 text-white w-8 h-8 rounded flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="bg-gray-700 hover:bg-gray-600 text-white w-8 h-8 rounded flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Totals */}
                <div className="bg-gray-800 rounded-lg p-6 space-y-3">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tax (8%):</span>
                    <span>${calculateTax().toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-600 pt-3">
                    <div className="flex justify-between text-white font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-orange-500">${calculateFinalTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Payment Section */}
          <div>
            <h2 className="bebas-header text-2xl text-orange-500 mb-4 flex items-center">
              <CreditCard className="mr-3" size={24} />
              PAYMENT
            </h2>
            
            {cartItems.length > 0 && (
              <>
                {paymentError && (
                  <div className="mb-4 bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                    <p className="text-red-400 text-sm">{paymentError}</p>
                  </div>
                )}
                <PaymentComponent
                  amount={calculateFinalTotal()}
                  currency="USD"
                  description={`Mac Wayne Official Store - ${cartItems.length} item${cartItems.length > 1 ? 's' : ''}`}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </>
            )}

            {/* Customer Support */}
            <div className="mt-8 bg-gray-800 rounded-lg p-6">
              <h3 className="text-orange-500 font-bold mb-3">Need Help?</h3>
              <p className="text-gray-300 text-sm mb-4">
                Having trouble with your order? Our team is here to help.
              </p>
              <Link 
                href="/live" 
                className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-medium transition-colors"
              >
                <CreditCard className="mr-2" size={16} />
                Get Live Help
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Accessibility Info */}
      <div className="bg-gray-800 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
            <h3 className="text-blue-400 font-bold mb-3">Accessibility & Security</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>• All payments are processed securely with industry-standard encryption</li>
              <li>• Screen reader compatible checkout process</li>
              <li>• Keyboard navigation supported throughout</li>
              <li>• High contrast mode available in navigation</li>
              <li>• Digital downloads include accessible formats</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
