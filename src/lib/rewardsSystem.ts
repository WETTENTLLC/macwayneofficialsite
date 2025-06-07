'use client';

/**
 * Sheriff Thizz Rewards System
 * Manages loyalty points, rewards, and user tiers
 */

// Point earning activities
export enum PointActivity {
  PURCHASE = 'purchase',
  SHARE = 'share',
  REVIEW = 'review',
  VOLUNTEER = 'volunteer',
  SIGNUP = 'signup',
  REFERRAL = 'referral',
  SOCIAL_FOLLOW = 'social_follow',
  STREAM = 'stream',
  CONCERT_ATTEND = 'concert_attend'
}

// Membership tiers
export enum MembershipTier {
  DEPUTY = 'deputy',
  SHERIFF = 'sheriff',
  LEGEND = 'legend'
}

// Point transaction interface
export interface PointTransaction {
  id: string;
  userId: string;
  activity: PointActivity;
  points: number;
  timestamp: number;
  description: string;
  metadata?: Record<string, unknown>;
}

// User loyalty profile
export interface LoyaltyProfile {
  userId: string;
  totalPoints: number;
  availablePoints: number;
  tier: MembershipTier;
  joinDate: number;
  lastActivity: number;
  pointsSpent: number;
  pointsEarned: number;
  achievements: string[];
  activitiesCompleted: Record<PointActivity, number>;
  streakCount: number;
  lastLoginDate: number;
}

// Reward interface
export interface Reward {
  id: string;
  name: string;
  description: string;
  points: number;
  category: 'music' | 'meet' | 'exclusive' | 'merch' | 'experience';
  available: boolean;
  tier?: MembershipTier;
  quantity?: number;
  expires?: number;
}

// Point values for different activities
const POINT_VALUES: Record<PointActivity, number> = {
  [PointActivity.PURCHASE]: 25,
  [PointActivity.SHARE]: 10,
  [PointActivity.REVIEW]: 15,
  [PointActivity.VOLUNTEER]: 50,
  [PointActivity.SIGNUP]: 100,
  [PointActivity.REFERRAL]: 75,
  [PointActivity.SOCIAL_FOLLOW]: 20,
  [PointActivity.STREAM]: 5,
  [PointActivity.CONCERT_ATTEND]: 100
};

// Tier thresholds
const TIER_THRESHOLDS = {
  [MembershipTier.DEPUTY]: 0,
  [MembershipTier.SHERIFF]: 500,
  [MembershipTier.LEGEND]: 1500
};

// Storage keys
const LOYALTY_PROFILE_KEY = 'mac_wayne_loyalty_profile';
const POINT_TRANSACTIONS_KEY = 'mac_wayne_point_transactions';
const REDEEMED_REWARDS_KEY = 'mac_wayne_redeemed_rewards';

/**
 * Get or create loyalty profile for user
 */
export function getLoyaltyProfile(userId: string): LoyaltyProfile {
  if (!userId) {
    return createDefaultProfile(userId);
  }

  const profiles = getStoredProfiles();
  const existingProfile = profiles[userId];

  if (existingProfile) {
    // Update tier based on current points
    const tier = calculateTier(existingProfile.totalPoints);
    return { ...existingProfile, tier };
  }

  // Create new profile
  const newProfile = createDefaultProfile(userId);
  profiles[userId] = newProfile;
  saveProfiles(profiles);
  
  return newProfile;
}

/**
 * Award points to user for activity
 */
export function awardPoints(
  userId: string, 
  activity: PointActivity, 
  description?: string,
  bonusMultiplier: number = 1,
  metadata?: Record<string, unknown>
): PointTransaction {
  const basePoints = POINT_VALUES[activity];
  const points = Math.floor(basePoints * bonusMultiplier);
  
  const transaction: PointTransaction = {
    id: generateTransactionId(),
    userId,
    activity,
    points,
    timestamp: Date.now(),
    description: description || getDefaultDescription(activity),
    metadata
  };

  // Save transaction
  const transactions = getPointTransactions();
  transactions.push(transaction);
  savePointTransactions(transactions);
  // Update user profile
  const profile = getLoyaltyProfile(userId);
  profile.totalPoints += points;
  profile.availablePoints += points;
  profile.pointsEarned += points;
  profile.lastActivity = Date.now();
  profile.tier = calculateTier(profile.totalPoints);
  
  // Increment activity counter
  if (!profile.activitiesCompleted) {
    profile.activitiesCompleted = {
      [PointActivity.PURCHASE]: 0,
      [PointActivity.SHARE]: 0,
      [PointActivity.REVIEW]: 0,
      [PointActivity.VOLUNTEER]: 0,
      [PointActivity.SIGNUP]: 0,
      [PointActivity.REFERRAL]: 0,
      [PointActivity.SOCIAL_FOLLOW]: 0,
      [PointActivity.STREAM]: 0,
      [PointActivity.CONCERT_ATTEND]: 0
    };
  }
  profile.activitiesCompleted[activity] = (profile.activitiesCompleted[activity] || 0) + 1;

  // Check for achievements
  checkAchievements(profile, transaction);

  const profiles = getStoredProfiles();
  profiles[userId] = profile;
  saveProfiles(profiles);

  return transaction;
}

/**
 * Redeem reward for user
 */
export function redeemReward(userId: string, reward: Reward): boolean {
  const profile = getLoyaltyProfile(userId);

  // Check if user has enough points
  if (profile.availablePoints < reward.points) {
    return false;
  }

  // Check tier requirement
  if (reward.tier && !canAccessTier(profile.tier, reward.tier)) {
    return false;
  }

  // Check availability
  if (!reward.available) {
    return false;
  }

  // Deduct points
  profile.availablePoints -= reward.points;
  profile.pointsSpent += reward.points;
  profile.lastActivity = Date.now();

  // Save updated profile
  const profiles = getStoredProfiles();
  profiles[userId] = profile;
  saveProfiles(profiles);

  // Record redemption
  recordRedemption(userId, reward);

  return true;
}

/**
 * Get point history for user
 */
export function getPointHistory(userId: string): PointTransaction[] {
  const transactions = getPointTransactions();
  return transactions
    .filter(t => t.userId === userId)
    .sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Calculate tier based on total points
 */
export function calculateTier(totalPoints: number): MembershipTier {
  if (totalPoints >= TIER_THRESHOLDS[MembershipTier.LEGEND]) {
    return MembershipTier.LEGEND;
  }
  if (totalPoints >= TIER_THRESHOLDS[MembershipTier.SHERIFF]) {
    return MembershipTier.SHERIFF;
  }
  return MembershipTier.DEPUTY;
}

/**
 * Get available rewards for user's tier
 */
export function getAvailableRewards(tier: MembershipTier): Reward[] {
  return getAllRewards().filter(reward => 
    reward.available && 
    (!reward.tier || canAccessTier(tier, reward.tier))
  );
}

/**
 * Check if user can access a tier
 */
function canAccessTier(userTier: MembershipTier, requiredTier: MembershipTier): boolean {
  const tierLevels = {
    [MembershipTier.DEPUTY]: 1,
    [MembershipTier.SHERIFF]: 2,
    [MembershipTier.LEGEND]: 3
  };
  
  return tierLevels[userTier] >= tierLevels[requiredTier];
}

/**
 * Get all available rewards
 */
function getAllRewards(): Reward[] {
  return [
    // Music & Content Rewards
    {
      id: 'early_release',
      name: 'Early Music Access',
      description: 'Get new tracks 24 hours before public release',
      points: 150,
      category: 'music',
      available: true,
      tier: MembershipTier.DEPUTY
    },
    {
      id: 'name_song',
      name: 'Name a Song',
      description: 'Help Mac name his next track',
      points: 750,
      category: 'music',
      available: true,
      tier: MembershipTier.SHERIFF
    },
    {
      id: 'dj_request',
      name: 'DJ Set Requests',
      description: 'Request songs for Mac\'s next live DJ set',
      points: 300,
      category: 'music',
      available: true
    },
    {
      id: 'producer_credit',
      name: 'Producer Credit',
      description: 'Get credited as executive producer on next album',
      points: 2000,
      category: 'music',
      available: true,
      tier: MembershipTier.LEGEND,
      quantity: 1
    },

    // Meet & Greet Rewards
    {
      id: 'facetime_call',
      name: 'FaceTime with Mac',
      description: '15-minute personal video call',
      points: 500,
      category: 'meet',
      available: true,
      tier: MembershipTier.SHERIFF
    },
    {
      id: 'studio_visit',
      name: 'Studio Visit',
      description: 'Visit Mac\'s studio in person',
      points: 1000,
      category: 'meet',
      available: true,
      tier: MembershipTier.LEGEND,
      quantity: 2
    },
    {
      id: 'concert_backstage',
      name: 'Backstage Pass',
      description: 'Backstage access at next concert',
      points: 800,
      category: 'meet',
      available: true,
      tier: MembershipTier.SHERIFF
    },

    // Exclusive Merchandise
    {
      id: 'signed_vinyl',
      name: 'Signed Vinyl',
      description: 'Limited edition signed record',
      points: 200,
      category: 'merch',
      available: true
    },
    {
      id: 'custom_hoodie',
      name: 'Custom Sheriff Hoodie',
      description: 'Personalized hoodie with your name',
      points: 400,
      category: 'merch',
      available: true,
      tier: MembershipTier.DEPUTY
    },
    {
      id: 'gold_chain',
      name: 'Mac Wayne Gold Chain',
      description: 'Exclusive gold chain replica',
      points: 1200,
      category: 'merch',
      available: true,
      tier: MembershipTier.LEGEND,
      quantity: 5
    },

    // Experience Rewards
    {
      id: 'front_row_tickets',
      name: 'Front Row Concert Tickets',
      description: 'Best seats in the house for next show',
      points: 600,
      category: 'experience',
      available: true,
      tier: MembershipTier.SHERIFF
    },
    {
      id: 'private_performance',
      name: 'Private Performance',
      description: 'Exclusive 30-minute private show',
      points: 2500,
      category: 'experience',
      available: true,
      tier: MembershipTier.LEGEND,
      quantity: 1
    },
    {
      id: 'dinner_mac',
      name: 'Dinner with Mac',
      description: 'Private dining experience',
      points: 1800,
      category: 'experience',
      available: true,
      tier: MembershipTier.LEGEND,
      quantity: 2
    }
  ];
}

/**
 * Create default profile for new user
 */
function createDefaultProfile(userId: string): LoyaltyProfile {
  return {
    userId,
    totalPoints: 0,
    availablePoints: 0,
    tier: MembershipTier.DEPUTY,
    joinDate: Date.now(),
    lastActivity: Date.now(),
    pointsSpent: 0,
    pointsEarned: 0,
    achievements: [],
    activitiesCompleted: {
      [PointActivity.PURCHASE]: 0,
      [PointActivity.SHARE]: 0,
      [PointActivity.REVIEW]: 0,
      [PointActivity.VOLUNTEER]: 0,
      [PointActivity.SIGNUP]: 0,
      [PointActivity.REFERRAL]: 0,
      [PointActivity.SOCIAL_FOLLOW]: 0,
      [PointActivity.STREAM]: 0,
      [PointActivity.CONCERT_ATTEND]: 0
    },
    streakCount: 0,
    lastLoginDate: Date.now()
  };
}

/**
 * Check and award achievements
 */
function checkAchievements(profile: LoyaltyProfile, transaction: PointTransaction) {
  const newAchievements: string[] = [];

  // First purchase achievement
  if (transaction.activity === PointActivity.PURCHASE && 
      !profile.achievements.includes('first_purchase')) {
    newAchievements.push('first_purchase');
  }

  // Point milestones
  const pointMilestones = [100, 500, 1000, 2000, 5000];
  pointMilestones.forEach(milestone => {
    const achievementId = `points_${milestone}`;
    if (profile.totalPoints >= milestone && 
        !profile.achievements.includes(achievementId)) {
      newAchievements.push(achievementId);
    }
  });

  // Social butterfly (sharing achievements)
  const shareTransactions = getPointTransactions()
    .filter(t => t.userId === profile.userId && t.activity === PointActivity.SHARE);
  if (shareTransactions.length >= 10 && 
      !profile.achievements.includes('social_butterfly')) {
    newAchievements.push('social_butterfly');
  }

  // Add new achievements
  profile.achievements.push(...newAchievements);
}

/**
 * Record reward redemption
 */
function recordRedemption(userId: string, reward: Reward) {
  const redemptions = getRedeemedRewards();
  const redemption = {
    id: generateTransactionId(),
    userId,
    rewardId: reward.id,
    rewardName: reward.name,
    points: reward.points,
    timestamp: Date.now()
  };
  
  redemptions.push(redemption);
  saveRedeemedRewards(redemptions);
}

/**
 * Get default description for activity
 */
function getDefaultDescription(activity: PointActivity): string {
  const descriptions = {
    [PointActivity.PURCHASE]: 'Made a purchase',
    [PointActivity.SHARE]: 'Shared content on social media',
    [PointActivity.REVIEW]: 'Left a review',
    [PointActivity.VOLUNTEER]: 'Volunteered in live session',
    [PointActivity.SIGNUP]: 'Joined Sheriff Thizz Rewards',
    [PointActivity.REFERRAL]: 'Referred a friend',
    [PointActivity.SOCIAL_FOLLOW]: 'Followed on social media',
    [PointActivity.STREAM]: 'Streamed music',
    [PointActivity.CONCERT_ATTEND]: 'Attended concert'
  };
  
  return descriptions[activity];
}

/**
 * Special bonus events and promotions
 */
export function getActivePromotions(): Array<{
  id: string;
  title: string;
  description: string;
  multiplier: number;
  activity?: PointActivity;
  expires: number;
}> {
  const now = Date.now();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  
  return [
    {
      id: 'double_share_weekend',
      title: '2X Share Points Weekend',
      description: 'Get double points for sharing Mac\'s content this weekend!',
      multiplier: 2,
      activity: PointActivity.SHARE,
      expires: now + oneWeek
    },
    {
      id: 'new_member_bonus',
      title: 'Welcome Bonus',
      description: 'New members get triple points for their first week!',
      multiplier: 3,
      expires: now + oneWeek
    }
  ];
}

/**
 * Award daily login bonus
 */
export function awardDailyBonus(userId: string): PointTransaction | null {
  const profile = getLoyaltyProfile(userId);
  const today = new Date().toDateString();
  const lastLoginDateStr = new Date(profile.lastLoginDate || 0).toDateString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
  
  // Check if user already got bonus today
  if (lastLoginDateStr === today) {
    return null;
  }
  
  // Update streak count
  if (!profile.streakCount) profile.streakCount = 0;
  if (!profile.lastLoginDate) profile.lastLoginDate = Date.now();
  
  if (lastLoginDateStr === yesterday) {
    // Consecutive day - increment streak
    profile.streakCount += 1;
  } else if (lastLoginDateStr !== today) {
    // Non-consecutive - reset streak
    profile.streakCount = 1;
  }
  
  profile.lastLoginDate = Date.now();
  
  // Award daily bonus (5-15 points based on tier)
  const bonusPoints = profile.tier === MembershipTier.LEGEND ? 15 : 
                     profile.tier === MembershipTier.SHERIFF ? 10 : 5;
  
  // Save updated profile
  const profiles = getStoredProfiles();
  profiles[userId] = profile;
  saveProfiles(profiles);
  
  return awardPoints(userId, PointActivity.SIGNUP, `Daily login bonus (${profile.tier})`, bonusPoints / 100);
}

/**
 * Check and award streak bonuses
 */
export function checkStreakBonus(userId: string): PointTransaction | null {
  const transactions = getPointTransactions()
    .filter(t => t.userId === userId)
    .sort((a, b) => b.timestamp - a.timestamp);
  
  const last7Days = transactions.filter(t => 
    t.timestamp > Date.now() - (7 * 24 * 60 * 60 * 1000)
  );
  
  // Award streak bonus for 7 consecutive days
  if (last7Days.length >= 7) {
    const hasStreakBonus = transactions.some(t => 
      t.description.includes('7-day streak') && 
      t.timestamp > Date.now() - (7 * 24 * 60 * 60 * 1000)
    );
    
    if (!hasStreakBonus) {
      return awardPoints(userId, PointActivity.SIGNUP, '7-day streak bonus!', 1);
    }
  }
  
  return null;
}

/**
 * Get leaderboard of top users (anonymized for privacy)
 */
export function getLeaderboard(limit: number = 10): Array<{
  rank: number;
  userId: string;
  displayName: string;
  totalPoints: number;
  tier: MembershipTier;
  achievements: number;
}> {
  const profiles = getStoredProfiles();
  const users = Object.values(profiles)
    .map((profile) => ({
      rank: 0,
      userId: profile.userId,
      displayName: `Sheriff ${profile.userId.slice(-4)}`, // Anonymized display
      totalPoints: profile.totalPoints,
      tier: profile.tier,
      achievements: profile.achievements.length
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, limit)
    .map((user, index) => ({ ...user, rank: index + 1 }));

  return users;
}

/**
 * Get user's rank in the leaderboard
 */
export function getUserRank(userId: string): number {
  const profiles = getStoredProfiles();
  const userProfile = profiles[userId];
  if (!userProfile) return 0;

  const sortedUsers = Object.values(profiles)
    .sort((a, b) => b.totalPoints - a.totalPoints);

  return sortedUsers.findIndex(profile => profile.userId === userId) + 1;
}

/**
 * Get achievement definitions
 */
export function getAchievementDefinitions(): Record<string, {
  name: string;
  description: string;
  icon: string;
  points: number;
}> {
  return {
    first_purchase: {
      name: 'First Purchase',
      description: 'Made your first purchase',
      icon: '🛒',
      points: 0
    },
    points_100: {
      name: 'Getting Started',
      description: 'Earned 100 total points',
      icon: '🌟',
      points: 0
    },
    points_500: {
      name: 'Deputy Rising',
      description: 'Earned 500 total points',
      icon: '🚀',
      points: 0
    },
    points_1000: {
      name: 'Sheriff Material',
      description: 'Earned 1,000 total points',
      icon: '⭐',
      points: 0
    },
    points_2000: {
      name: 'Legend in Making',
      description: 'Earned 2,000 total points',
      icon: '👑',
      points: 0
    },
    points_5000: {
      name: 'Thizz Legend',
      description: 'Earned 5,000 total points',
      icon: '💎',
      points: 0
    },
    social_butterfly: {
      name: 'Social Butterfly',
      description: 'Shared content 10 times',
      icon: '🦋',
      points: 50
    }
  };
}

// Storage helper functions
function getStoredProfiles(): Record<string, LoyaltyProfile> {
  if (typeof window === 'undefined') return {};
  
  try {
    const profilesJson = localStorage.getItem(LOYALTY_PROFILE_KEY);
    return profilesJson ? JSON.parse(profilesJson) : {};
  } catch (error) {
    console.error('Failed to load loyalty profiles:', error);
    return {};
  }
}

function saveProfiles(profiles: Record<string, LoyaltyProfile>) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOYALTY_PROFILE_KEY, JSON.stringify(profiles));
  }
}

function getPointTransactions(): PointTransaction[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const transactionsJson = localStorage.getItem(POINT_TRANSACTIONS_KEY);
    return transactionsJson ? JSON.parse(transactionsJson) : [];
  } catch (error) {
    console.error('Failed to load point transactions:', error);
    return [];
  }
}

function savePointTransactions(transactions: PointTransaction[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(POINT_TRANSACTIONS_KEY, JSON.stringify(transactions));
  }
}

interface RedemptionRecord {
  id: string;
  userId: string;
  rewardId: string;
  rewardName: string;
  points: number;
  timestamp: number;
}

function getRedeemedRewards(): RedemptionRecord[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const redemptionsJson = localStorage.getItem(REDEEMED_REWARDS_KEY);
    return redemptionsJson ? JSON.parse(redemptionsJson) : [];
  } catch (error) {
    console.error('Failed to load redeemed rewards:', error);
    return [];
  }
}

function saveRedeemedRewards(redemptions: RedemptionRecord[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(REDEEMED_REWARDS_KEY, JSON.stringify(redemptions));
  }
}

function generateTransactionId(): string {
  return `txn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
