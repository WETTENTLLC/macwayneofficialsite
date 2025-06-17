'use client';

import { useState, useEffect } from 'react';
import { Star, Gift, Phone, Music, Users, Crown, Shield, Heart, Trophy, Calendar, Ticket, Coffee, Headphones } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import NotificationSystem, { createNotification } from '@/components/NotificationSystem';
import Leaderboard from '@/components/Leaderboard';
import AchievementDisplay from '@/components/AchievementDisplay';
import { 
  getLoyaltyProfile, 
  awardPoints, 
  redeemReward, 
  getAvailableRewards,
  getPointHistory,
  awardDailyBonus,
  checkStreakBonus,
  getActivePromotions,
  PointActivity,
  MembershipTier,
  type LoyaltyProfile,
  type Reward,
  type PointTransaction
} from '@/lib/rewardsSystem';

export default function LoyaltyPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<LoyaltyProfile | null>(null);
  const [availableRewards, setAvailableRewards] = useState<Reward[]>([]);
  const [pointHistory, setPointHistory] = useState<PointTransaction[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'points' | 'achievement' | 'reward' | 'tier';
    title: string;
    message: string;
    points?: number;
    timestamp: number;
  }>>([]);// Load user profile and rewards on mount
  useEffect(() => {
    if (user?.id) {
      const userProfile = getLoyaltyProfile(user.id);
      setProfile(userProfile);
      
      const rewards = getAvailableRewards(userProfile.tier);
      setAvailableRewards(rewards);
      
      const history = getPointHistory(user.id);
      setPointHistory(history.slice(0, 10)); // Show last 10 transactions

      // Check for daily bonus and streak bonuses
      const dailyBonus = awardDailyBonus(user.id);
      if (dailyBonus) {
        const notification = createNotification(
          'points',
          'Daily Bonus!',
          'Welcome back! Here\'s your daily login bonus.',
          dailyBonus.points
        );
        setNotifications([notification]);
        
        // Refresh profile after bonus
        setTimeout(() => {
          const updatedProfile = getLoyaltyProfile(user.id);
          setProfile(updatedProfile);
        }, 1000);
      }

      const streakBonus = checkStreakBonus(user.id);
      if (streakBonus) {
        const notification = createNotification(
          'achievement',
          'Streak Bonus!',
          'Congratulations on your 7-day activity streak!',
          streakBonus.points
        );
        setNotifications(prev => [...prev, notification]);
      }
    }
  }, [user]);
  // Award points for activity
  const handleEarnPoints = async (activity: PointActivity, description?: string) => {
    if (!user?.id) {
      const notification = createNotification(
        'points',
        'Sign In Required',
        'Please sign in to start earning points!'
      );
      setNotifications([notification]);
      return;
    }

    setIsLoading(true);
    try {
      // Check for active promotions
      const promotions = getActivePromotions();
      const activePromotion = promotions.find(p => !p.activity || p.activity === activity);
      const multiplier = activePromotion ? activePromotion.multiplier : 1;
      
      const transaction = awardPoints(user.id, activity, description, multiplier);
      const updatedProfile = getLoyaltyProfile(user.id);
      const oldTier = profile?.tier;
      const newTier = updatedProfile.tier;
      
      setProfile(updatedProfile);
      
      // Update available rewards if tier changed
      const rewards = getAvailableRewards(updatedProfile.tier);
      setAvailableRewards(rewards);
      
      // Update history
      const history = getPointHistory(user.id);
      setPointHistory(history.slice(0, 10));
      
      // Create notification
      let notificationTitle = 'Points Earned!';
      let notificationMessage = transaction.description;
      
      if (activePromotion) {
        notificationTitle = `${activePromotion.title}`;
        notificationMessage = `${transaction.description} (${multiplier}x bonus!)`;
      }
      
      const notification = createNotification(
        'points',
        notificationTitle,
        notificationMessage,
        transaction.points
      );
      
      setNotifications([notification]);
      
      // Check for tier upgrade
      if (oldTier !== newTier) {
        setTimeout(() => {
          const tierNotification = createNotification(
            'tier',
            'Tier Upgrade!',
            `Congratulations! You've been promoted to ${newTier.charAt(0).toUpperCase() + newTier.slice(1)}!`
          );
          setNotifications(prev => [...prev, tierNotification]);
        }, 1500);
      }
      
    } catch (error) {
      console.error('Error awarding points:', error);
      const notification = createNotification(
        'points',
        'Error',
        'Sorry, there was an error. Please try again.'
      );
      setNotifications([notification]);
    }
    setIsLoading(false);
  };
  // Redeem reward
  const handleRedeemReward = async (reward: Reward) => {
    if (!user?.id || !profile) {
      const notification = createNotification(
        'reward',
        'Sign In Required',
        'Please sign in to redeem rewards!'
      );
      setNotifications([notification]);
      return;
    }

    if (profile.availablePoints < reward.points) {
      const notification = createNotification(
        'reward',
        'Insufficient Points',
        `You need ${reward.points - profile.availablePoints} more points to redeem this reward.`
      );
      setNotifications([notification]);
      return;
    }

    const success = redeemReward(user.id, reward);
    if (success) {
      const updatedProfile = getLoyaltyProfile(user.id);
      setProfile(updatedProfile);
      
      const notification = createNotification(
        'reward',
        'Reward Redeemed!',
        `Congratulations! You've redeemed: ${reward.name}. Mac will contact you soon!`
      );
      setNotifications([notification]);
    } else {
      const notification = createNotification(
        'reward',
        'Redemption Failed',
        'Sorry, this reward is not available or you don\'t meet the requirements.'
      );
      setNotifications([notification]);
    }
  };

  // Dismiss notification
  const handleDismissNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  // Filter rewards by category
  const filteredRewards = selectedCategory === 'all' 
    ? availableRewards 
    : availableRewards.filter(reward => reward.category === selectedCategory);

  const tiers = [
    {
      name: 'Deputy',
      value: MembershipTier.DEPUTY,
      price: 5,
      icon: Shield,
      color: 'bg-gray-600',
      pointsRequired: 0,
      benefits: [
        'Priority volunteer queue',
        'Monthly group video call',
        'Deputy-only chat access',
        '10% discount on merch',
        'Early music releases'
      ]
    },
    {
      name: 'Sheriff',
      value: MembershipTier.SHERIFF,
      price: 15,
      icon: Star,
      color: 'bg-orange-500',
      pointsRequired: 500,
      benefits: [
        'Everything in Deputy',
        'Bi-weekly 1-on-1 calls',
        'Exclusive meet & greet access',
        'Free signed merch quarterly',
        'Backstage pass opportunities'
      ]
    },
    {
      name: 'Legend',
      value: MembershipTier.LEGEND,
      price: 50,
      icon: Crown,
      color: 'bg-yellow-500',
      pointsRequired: 1500,
      benefits: [
        'Everything in Sheriff',
        'Weekly personal check-ins',
        'Producer credit opportunities',
        'Annual studio visit',
        'Private performance access'
      ]
    }
  ];

  const earnPointsActivities = [
    {
      activity: PointActivity.SHARE,
      icon: Users,
      title: 'Share Content',
      description: 'Share Mac\'s music or videos',
      points: 10,
      action: 'Share Now'
    },
    {
      activity: PointActivity.PURCHASE,
      icon: Gift,
      title: 'Make Purchase',
      description: 'Buy music or merch',
      points: 25,
      action: 'Shop Now'
    },
    {
      activity: PointActivity.VOLUNTEER,
      icon: Phone,
      title: 'Volunteer',
      description: 'Help in live sessions',
      points: 50,
      action: 'Volunteer'
    },
    {
      activity: PointActivity.REVIEW,
      icon: Star,
      title: 'Leave Review',
      description: 'Review music or experience',
      points: 15,
      action: 'Review'
    },
    {
      activity: PointActivity.SOCIAL_FOLLOW,
      icon: Heart,
      title: 'Follow Socials',
      description: 'Follow Mac on social media',
      points: 20,
      action: 'Follow'
    },
    {
      activity: PointActivity.STREAM,
      icon: Headphones,
      title: 'Stream Music',
      description: 'Listen to Mac\'s tracks',
      points: 5,
      action: 'Stream'
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'music': return Music;
      case 'meet': return Users;
      case 'merch': return Gift;
      case 'experience': return Calendar;
      case 'exclusive': return Crown;
      default: return Star;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'music': return 'bg-orange-500';
      case 'meet': return 'bg-green-500';
      case 'merch': return 'bg-blue-500';
      case 'experience': return 'bg-purple-500';
      case 'exclusive': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <Shield size={64} className="text-orange-500 mx-auto mb-4" />
          <h1 className="bebas-header text-4xl text-white mb-4">
            JOIN SHERIFF THIZZ REWARDS
          </h1>
          <p className="text-gray-400 mb-8">
            Sign in to start earning points and unlock exclusive Mac Wayne experiences
          </p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-bold">
            SIGN IN TO JOIN
          </button>
        </div>
      </div>
    );
  }  return (
    <>
      <NotificationSystem 
        notifications={notifications} 
        onDismiss={handleDismissNotification} 
      />
      <div className="bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="bg-black py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Star size={48} className="text-orange-500" />
          </div>
          <h1 className="bebas-header text-6xl text-white mb-4">
            SHERIFF THIZZ REWARDS
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Earn points, unlock exclusive experiences, become part of the family
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-orange-500 rounded-lg p-6">
              <h3 className="bebas-header text-xl text-white mb-2">AVAILABLE POINTS</h3>
              <p className="text-3xl font-bold text-white">{profile?.availablePoints || 0}</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="bebas-header text-xl text-white mb-2">TOTAL EARNED</h3>
              <p className="text-3xl font-bold text-orange-500">{profile?.pointsEarned || 0}</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="bebas-header text-xl text-white mb-2">CURRENT TIER</h3>
              <p className="text-2xl font-bold text-white capitalize">{profile?.tier || 'Deputy'}</p>
            </div>
          </div>        </div>
      </div>

      {/* Active Promotions */}
      {getActivePromotions().length > 0 && (
        <div className="py-12 px-4 bg-gradient-to-r from-orange-600 to-red-600">
          <div className="max-w-6xl mx-auto">
            <h2 className="bebas-header text-3xl text-center text-white mb-8">
              🔥 ACTIVE PROMOTIONS
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getActivePromotions().map((promotion) => (
                <div key={promotion.id} className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-orange-400/30">
                  <div className="flex items-center gap-3 mb-4">
                    <Trophy className="text-yellow-400" size={32} />
                    <div>
                      <h3 className="bebas-header text-xl text-white">{promotion.title}</h3>
                      <p className="text-orange-200 text-sm">
                        Ends {new Date(promotion.expires).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-white mb-4">{promotion.description}</p>
                  <div className="bg-orange-500/20 rounded-lg p-3">
                    <span className="text-orange-300 font-bold text-lg">
                      {promotion.multiplier}x Points Multiplier!
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Membership Tiers */}
      <div className="py-16 px-4 bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="bebas-header text-4xl text-center text-white mb-12">
            MEMBERSHIP TIERS
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-lg p-8 text-center transition-transform hover:scale-105 ${
                  profile?.tier === tier.value 
                    ? `${tier.color} text-white` 
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                <tier.icon size={48} className="mx-auto mb-4" />
                <h3 className="bebas-header text-2xl mb-4">{tier.name.toUpperCase()}</h3>
                <p className="text-lg font-bold mb-2">{tier.pointsRequired} points to unlock</p>
                <p className="text-2xl font-bold mb-6">${tier.price}/month</p>
                
                <ul className="space-y-2 mb-8 text-sm">
                  {tier.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center">
                      <Star size={16} className="mr-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                
                <div className="space-y-2">
                  {profile?.tier === tier.value ? (
                    <div className="bg-white text-gray-900 py-3 rounded-lg font-bold">
                      CURRENT TIER
                    </div>
                  ) : (profile?.totalPoints || 0) >= tier.pointsRequired ? (
                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-bold transition-colors">
                      UPGRADE NOW
                    </button>
                  ) : (
                    <div className="text-gray-400 py-3">
                      Need {tier.pointsRequired - (profile?.totalPoints || 0)} more points
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Earn Points Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="bebas-header text-4xl text-center text-white mb-12">
            EARN POINTS
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {earnPointsActivities.map((activity) => (
              <div key={activity.activity} className="bg-gray-800 rounded-lg p-6 text-center">
                <activity.icon className="text-orange-500 mx-auto mb-4" size={40} />
                <h3 className="bebas-header text-xl text-white mb-2">{activity.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{activity.description}</p>
                <p className="text-orange-500 font-bold text-lg">+{activity.points} points</p>
                <button
                  onClick={() => handleEarnPoints(activity.activity)}
                  disabled={isLoading}
                  className="mt-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white px-4 py-2 rounded font-bold w-full transition-colors"
                >
                  {isLoading ? 'EARNING...' : activity.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rewards Marketplace */}
      <div className="py-16 px-4 bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="bebas-header text-4xl text-center text-white mb-8">
            REDEEM REWARDS
          </h2>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {['all', 'music', 'meet', 'merch', 'experience', 'exclusive'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-bold transition-colors ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRewards.map((reward) => {
              const CategoryIcon = getCategoryIcon(reward.category);
              const canAfford = (profile?.availablePoints || 0) >= reward.points;
              const canAccess = !reward.tier || (profile?.tier && profile.tier === reward.tier) || 
                               (profile?.tier === MembershipTier.SHERIFF && reward.tier === MembershipTier.DEPUTY) ||
                               (profile?.tier === MembershipTier.LEGEND && (reward.tier === MembershipTier.DEPUTY || reward.tier === MembershipTier.SHERIFF));
              
              return (
                <div 
                  key={reward.id}
                  className={`bg-gray-700 rounded-lg p-6 ${
                    !reward.available ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <CategoryIcon size={24} className="text-orange-500" />
                      <h3 className="bebas-header text-xl text-white">{reward.name}</h3>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getCategoryColor(reward.category)}`}>
                      {reward.category.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4">{reward.description}</p>
                  
                  {reward.tier && (
                    <p className="text-yellow-400 text-xs mb-2">
                      Requires {reward.tier.charAt(0).toUpperCase() + reward.tier.slice(1)} tier
                    </p>
                  )}
                  
                  {reward.quantity && (
                    <p className="text-blue-400 text-xs mb-2">
                      Limited: {reward.quantity} available
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center mt-6">
                    <span className="text-orange-500 font-bold text-lg">
                      {reward.points} points
                    </span>
                    <button
                      onClick={() => handleRedeemReward(reward)}
                      disabled={!canAfford || !canAccess || !reward.available}
                      className={`px-4 py-2 rounded font-bold transition-colors ${
                        canAfford && canAccess && reward.available
                          ? 'bg-orange-500 hover:bg-orange-600 text-white'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {!reward.available ? 'SOLD OUT' : 
                       !canAccess ? 'TIER LOCKED' :
                       !canAfford ? 'NEED MORE' : 'REDEEM'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Point History */}
      {pointHistory.length > 0 && (
        <div className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="bebas-header text-4xl text-center text-white mb-12">
              RECENT ACTIVITY
            </h2>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="space-y-4">
                {pointHistory.map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center py-3 border-b border-gray-700 last:border-b-0">
                    <div>
                      <p className="text-white font-medium">{transaction.description}</p>
                      <p className="text-gray-400 text-sm">
                        {new Date(transaction.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-orange-500 font-bold">
                      +{transaction.points} points
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>      )}

      {/* Leaderboard & Achievements */}
      <div className="py-16 px-4 bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="bebas-header text-4xl text-center text-white mb-12">
            COMMUNITY LEADERBOARD & ACHIEVEMENTS
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Leaderboard */}
            <div>
              <Leaderboard />
            </div>
            
            {/* Achievements */}
            <div>
              {profile && <AchievementDisplay profile={profile} />}
            </div>
          </div>
        </div>
      </div>

      {/* Special Experiences Coming Soon */}
      <div className="py-16 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="bebas-header text-4xl text-white mb-8">
            EXCLUSIVE EXPERIENCES
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800 rounded-lg p-8">
              <Ticket className="text-orange-500 mx-auto mb-4" size={48} />
              <h3 className="bebas-header text-2xl text-orange-500 mb-4">FRONT ROW TICKETS</h3>
              <p className="text-gray-300 mb-6">
                Get guaranteed front row seats to Mac&apos;s next concert. VIP treatment included.
              </p>
              <div className="text-orange-500 font-bold text-lg mb-4">600 Points</div>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-bold">
                COMING SOON
              </button>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-8">
              <Coffee className="text-orange-500 mx-auto mb-4" size={48} />
              <h3 className="bebas-header text-2xl text-orange-500 mb-4">DINNER WITH MAC</h3>
              <p className="text-gray-300 mb-6">
                Private dining experience with Mac Wayne. Share stories and connect personally.
              </p>
              <div className="text-orange-500 font-bold text-lg mb-4">1800 Points</div>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-bold">
                COMING SOON
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Wett Girls Squad Section */}
      <div className="py-16 px-4 bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="bebas-header text-4xl text-white mb-8">
            WETT GIRLS SQUAD
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Connect with Mac&apos;s official promo models and join exclusive meetups
          </p>
          
          <div className="bg-black rounded-lg p-8">
            <Trophy className="text-orange-500 mx-auto mb-4" size={48} />
            <h3 className="bebas-header text-2xl text-orange-500 mb-4">VIP MEETUPS</h3>
            <p className="text-gray-300 mb-6">
              Exclusive events, photo shoots, and fan meetups with the Wett Girls Squad. 
              Premium members get priority access.
            </p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-bold">
              JOIN WAITLIST
            </button>          </div>
        </div>
      </div>
    </div>
    </>
  );
}
