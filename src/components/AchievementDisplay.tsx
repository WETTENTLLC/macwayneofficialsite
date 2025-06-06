'use client';

import { useState, useEffect } from 'react';
import { Trophy, Star, Crown, Shield, Music, Users, Gift, Calendar, Heart, Target, Zap, Award } from 'lucide-react';
import { LoyaltyProfile, MembershipTier } from '@/lib/rewardsSystem';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: typeof Trophy;
  color: string;
  pointsRequired: number;
  category: 'points' | 'activity' | 'social' | 'milestone' | 'special';
  unlocked: boolean;
  unlockedAt?: Date;
}

interface AchievementDisplayProps {
  profile: LoyaltyProfile;
  className?: string;
}

export default function AchievementDisplay({ profile, className = '' }: AchievementDisplayProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const allAchievements = generateAchievements(profile);
    setAchievements(allAchievements);
  }, [profile]);

  const generateAchievements = (userProfile: LoyaltyProfile): Achievement[] => {
    const achievements: Achievement[] = [
      // Points Milestones
      {
        id: 'first_points',
        title: 'First Steps',
        description: 'Earn your first 10 points',
        icon: Target,
        color: 'text-green-500',
        pointsRequired: 10,
        category: 'points',
        unlocked: userProfile.totalPoints >= 10,
        unlockedAt: userProfile.totalPoints >= 10 ? new Date() : undefined
      },
      {
        id: 'century_club',
        title: 'Century Club',
        description: 'Reach 100 total points',
        icon: Star,
        color: 'text-blue-500',
        pointsRequired: 100,
        category: 'points',
        unlocked: userProfile.totalPoints >= 100
      },
      {
        id: 'half_thousand',
        title: 'Point Collector',
        description: 'Accumulate 500 points',
        icon: Trophy,
        color: 'text-purple-500',
        pointsRequired: 500,
        category: 'points',
        unlocked: userProfile.totalPoints >= 500
      },
      {
        id: 'grand_slam',
        title: 'Grand Slam',
        description: 'Reach 1000 points milestone',
        icon: Crown,
        color: 'text-yellow-500',
        pointsRequired: 1000,
        category: 'points',
        unlocked: userProfile.totalPoints >= 1000
      },
      {
        id: 'legend_status',
        title: 'Legend Status',
        description: 'Unlock the ultimate 1500 points',
        icon: Award,
        color: 'text-orange-500',
        pointsRequired: 1500,
        category: 'points',
        unlocked: userProfile.totalPoints >= 1500
      },

      // Activity Achievements
      {
        id: 'social_butterfly',
        title: 'Social Butterfly',
        description: 'Share Mac Wayne content 5 times',
        icon: Users,
        color: 'text-pink-500',
        pointsRequired: 0,
        category: 'social',
        unlocked: userProfile.activitiesCompleted.share >= 5
      },
      {
        id: 'super_fan',
        title: 'Super Fan',
        description: 'Complete 10 different activities',
        icon: Heart,
        color: 'text-red-500',
        pointsRequired: 0,
        category: 'activity',
        unlocked: Object.values(userProfile.activitiesCompleted).reduce((sum, count) => sum + count, 0) >= 10
      },
      {
        id: 'music_lover',
        title: 'Music Lover',
        description: 'Stream Mac Wayne music 20 times',
        icon: Music,
        color: 'text-indigo-500',
        pointsRequired: 0,
        category: 'activity',
        unlocked: userProfile.activitiesCompleted.stream >= 20
      },
      {
        id: 'volunteer_hero',
        title: 'Volunteer Hero',
        description: 'Volunteer for 3 Mac Wayne events',
        icon: Shield,
        color: 'text-green-600',
        pointsRequired: 0,
        category: 'activity',
        unlocked: userProfile.activitiesCompleted.volunteer >= 3
      },

      // Tier Achievements
      {
        id: 'deputy_badge',
        title: 'Deputy Badge',
        description: 'Achieve Deputy status',
        icon: Shield,
        color: 'text-gray-500',
        pointsRequired: 0,
        category: 'milestone',
        unlocked: userProfile.tier === MembershipTier.DEPUTY || userProfile.tier === MembershipTier.SHERIFF || userProfile.tier === MembershipTier.LEGEND
      },
      {
        id: 'sheriff_star',
        title: 'Sheriff Star',
        description: 'Achieve Sheriff status',
        icon: Star,
        color: 'text-orange-500',
        pointsRequired: 500,
        category: 'milestone',
        unlocked: userProfile.tier === MembershipTier.SHERIFF || userProfile.tier === MembershipTier.LEGEND
      },
      {
        id: 'legend_crown',
        title: 'Legend Crown',
        description: 'Achieve Legend status',
        icon: Crown,
        color: 'text-yellow-500',
        pointsRequired: 1500,
        category: 'milestone',
        unlocked: userProfile.tier === MembershipTier.LEGEND
      },

      // Special Achievements
      {
        id: 'early_adopter',
        title: 'Early Adopter',
        description: 'One of the first 100 members',
        icon: Zap,
        color: 'text-cyan-500',
        pointsRequired: 0,
        category: 'special',
        unlocked: true // Could be based on join date or member number
      },
      {
        id: 'streak_master',
        title: 'Streak Master',
        description: 'Login for 7 consecutive days',
        icon: Calendar,
        color: 'text-emerald-500',
        pointsRequired: 0,
        category: 'special',
        unlocked: userProfile.streakCount >= 7
      },
      {
        id: 'big_spender',
        title: 'Big Spender',
        description: 'Make a purchase over $100',
        icon: Gift,
        color: 'text-violet-500',
        pointsRequired: 0,
        category: 'special',
        unlocked: userProfile.activitiesCompleted.purchase >= 1 // Simplified check
      }
    ];

    return achievements;
  };

  const categories = [
    { id: 'all', label: 'All', icon: Trophy },
    { id: 'points', label: 'Points', icon: Star },
    { id: 'activity', label: 'Activity', icon: Target },
    { id: 'social', label: 'Social', icon: Users },
    { id: 'milestone', label: 'Milestones', icon: Crown },
    { id: 'special', label: 'Special', icon: Award }
  ];

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(achievement => achievement.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="bebas-header text-2xl text-white mb-2">ACHIEVEMENTS</h3>
          <p className="text-gray-400 text-sm">
            {unlockedCount} of {totalCount} unlocked ({completionPercentage}%)
          </p>
        </div>
        <div className="text-right">
          <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
            <Trophy className="text-orange-500" size={32} />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="bg-gray-700 rounded-full h-2">
          <div 
            className="bg-orange-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-orange-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <category.icon size={16} />
            {category.label}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAchievements.map(achievement => (
          <div
            key={achievement.id}
            className={`p-4 rounded-lg border-2 transition-all duration-300 ${
              achievement.unlocked
                ? 'bg-gray-700 border-orange-500 shadow-lg'
                : 'bg-gray-800 border-gray-600 opacity-60'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                achievement.unlocked ? 'bg-gray-600' : 'bg-gray-700'
              }`}>
                <achievement.icon 
                  size={24} 
                  className={achievement.unlocked ? achievement.color : 'text-gray-500'} 
                />
              </div>
              
              <div className="flex-1">
                <h4 className={`font-bold mb-1 ${
                  achievement.unlocked ? 'text-white' : 'text-gray-400'
                }`}>
                  {achievement.title}
                </h4>
                <p className={`text-sm ${
                  achievement.unlocked ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {achievement.description}
                </p>
                
                {achievement.pointsRequired > 0 && (
                  <p className="text-xs text-orange-500 mt-2">
                    {achievement.pointsRequired} points required
                  </p>
                )}
                
                {achievement.unlocked && achievement.unlockedAt && (
                  <p className="text-xs text-green-400 mt-2">
                    Unlocked recently!
                  </p>
                )}
              </div>
              
              {achievement.unlocked && (
                <div className="text-green-400">
                  <Star size={20} fill="currentColor" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-8">
          <Trophy className="text-gray-600 mx-auto mb-4" size={48} />
          <p className="text-gray-500">No achievements in this category yet.</p>
        </div>
      )}
    </div>
  );
}
