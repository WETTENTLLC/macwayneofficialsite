'use client';

/**
 * Purchase Tracking System for Mac Wayne Official Website
 * Manages tracking user purchases across the site and integrates with rewards system
 */

import { awardPoints, PointActivity } from './rewardsSystem';

// Purchase types
export enum PurchaseType {
  TRACK = 'track',
  ALBUM = 'album',
  DOCUMENTARY = 'documentary'
}

// Purchase record interface
export interface Purchase {
  id: string;
  userId: string;
  type: PurchaseType;
  itemId: string;
  timestamp: number;
  amount: number;
  paymentId?: string;
}

// Storage key for purchases in localStorage
const PURCHASE_STORAGE_KEY = 'mac_wayne_purchases';

/**
 * Add a new purchase to the user's purchase history and award loyalty points
 */
export function recordPurchase(
  userId: string,
  type: PurchaseType,
  itemId: string,
  amount: number,
  paymentId?: string
): Purchase {
  const purchase: Purchase = {
    id: generatePurchaseId(),
    userId,
    type,
    itemId,
    timestamp: Date.now(),
    amount,
    paymentId
  };

  const purchases = getPurchases();
  purchases.push(purchase);
  savePurchases(purchases);

  // Award loyalty points for purchase (25 base points + bonus based on amount)
  try {
    const bonusMultiplier = Math.min(Math.floor(amount / 10) + 1, 3); // Max 3x multiplier
    const description = `Purchased ${type} (${itemId}) - $${amount}`;
    awardPoints(userId, PointActivity.PURCHASE, description, bonusMultiplier);
  } catch (error) {
    console.error('Failed to award loyalty points:', error);
  }

  return purchase;
}

/**
 * Check if a user has purchased a specific item
 */
export function isPurchased(userId: string, type: PurchaseType, itemId: string): boolean {
  if (!userId) return false;
  
  const purchases = getPurchases();
  return purchases.some(
    purchase => purchase.userId === userId && 
    purchase.type === type && 
    purchase.itemId === itemId
  );
}

/**
 * Check if a user has purchased any album
 */
export function hasAlbumPurchase(userId: string): boolean {
  if (!userId) return false;
  
  const purchases = getPurchases();
  return purchases.some(
    purchase => purchase.userId === userId && 
    purchase.type === PurchaseType.ALBUM
  );
}

/**
 * Get all purchases for a specific user
 */
export function getUserPurchases(userId: string): Purchase[] {
  const purchases = getPurchases();
  return purchases.filter(purchase => purchase.userId === userId);
}

/**
 * Get all purchases in the system
 */
export function getPurchases(): Purchase[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const purchasesJson = localStorage.getItem(PURCHASE_STORAGE_KEY);
    return purchasesJson ? JSON.parse(purchasesJson) : [];
  } catch (error) {
    console.error('Failed to load purchases:', error);
    return [];
  }
}

/**
 * Clear all purchase records for testing
 */
export function clearPurchases(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(PURCHASE_STORAGE_KEY);
  }
}

/**
 * Save purchases to localStorage
 */
function savePurchases(purchases: Purchase[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PURCHASE_STORAGE_KEY, JSON.stringify(purchases));
  }
}

/**
 * Generate a unique purchase ID
 */
function generatePurchaseId(): string {
  return `purchase_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
