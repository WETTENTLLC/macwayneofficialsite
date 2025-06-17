'use client';

import React, { useState } from 'react';
import AudioPlayer from './AudioPlayer';
import PaymentComponent from './PaymentComponent';
import { useAuth } from '../contexts/AuthContext';
import { isPurchased, recordPurchase, PurchaseType } from '../lib/purchaseTracker';

interface PremiumAudioPlayerProps {
  src: string;
  title: string;
  artist?: string;
  duration?: string;
  className?: string;
  showWaveform?: boolean;
  previewMode?: boolean;
  previewDuration?: number;
  trackPrice?: number;
  albumId?: string;
  trackId?: string;
  contentType?: PurchaseType;
}

export default function PremiumAudioPlayer({
  src,
  title,
  artist = "Mac Wayne",
  duration,
  className = "",
  showWaveform = false,
  previewMode = false,
  previewDuration = 30,
  trackPrice = 1.99,
  albumId,
  trackId,
  contentType = PurchaseType.TRACK
}: PremiumAudioPlayerProps) {
  const { isAuthenticated, user } = useAuth();
  const [showPayment, setShowPayment] = useState(false);
  
  // Determine the item ID based on context
  const itemId = trackId || albumId || title;
  
  // Check if the user has purchased this content
  const hasPurchased = isAuthenticated && user?.id && 
    isPurchased(user.id, contentType, itemId);
    // Handle purchase click
  const handlePurchaseClick = () => {
    if (!isAuthenticated) {
      // Redirect to login
      alert('Please log in to purchase this content');
      return;
    }
    
    setShowPayment(true);
  };
  
  // Handle successful payment
  const handlePaymentSuccess = (paymentId: string) => {
    if (!user?.id) return;
    
    // Record the purchase in our tracking system
    recordPurchase(
      user.id,
      contentType,
      itemId,
      trackPrice,
      paymentId
    );
    
    setShowPayment(false);
    alert('Thank you for your purchase! You can now enjoy the full content.');
  };
  
  // Handle payment error
  const handlePaymentError = (error: string) => {
    console.error(`Payment error: ${error}`);
    // You might want to show an error message to the user
  };
  
  return (
    <div className="relative">
      {showPayment ? (
        <div className="mb-4">
          <PaymentComponent
            amount={trackPrice}
            description={`Purchase "${title}" by ${artist}`}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            className="mb-4"
          />
          <button
            onClick={() => setShowPayment(false)}
            className="text-gray-400 hover:text-white underline text-sm w-full text-center block mt-2"
          >
            Cancel
          </button>
        </div>
      ) : (
        <AudioPlayer
          src={src}
          title={title}
          artist={artist}
          duration={duration}          className={className}
          showWaveform={showWaveform}
          previewMode={previewMode && !hasPurchased}
          previewDuration={previewDuration}
          requiresPurchase={!hasPurchased && !previewMode}
          onPurchaseClick={handlePurchaseClick}
        />
      )}
    </div>
  );
}
