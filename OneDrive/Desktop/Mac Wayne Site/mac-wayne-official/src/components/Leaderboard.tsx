'use client';

import { useState, useEffect } from 'react';
import { Trophy, Star, Crown, Shield, Medal } from 'lucide-react';
import { getLeaderboard, getUserRank, MembershipTier } from '@/lib/rewardsSystem';

interface LeaderboardProps {
  currentUserId?: string;
}

export default function Leaderboard({ currentUserId }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userRank, setUserRank] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = () => {
      try {
        const leaders = getLeaderboard(10);
        setLeaderboard(leaders);
        
        if (currentUserId) {
          const rank = getUserRank(currentUserId);
          setUserRank(rank);
        }
      } catch (error) {
        console.error('Failed to load leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaderboard();
  }, [currentUserId]);

  const getTierIcon = (tier: MembershipTier) => {
    switch (tier) {
      case MembershipTier.LEGEND:
        return <Crown className="text-yellow-500" size={20} />;
      case MembershipTier.SHERIFF:
        return <Star className="text-orange-500" size={20} />;
      case MembershipTier.DEPUTY:
        return <Shield className="text-gray-400" size={20} />;
      default:
        return <Shield className="text-gray-400" size={20} />;
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="text-yellow-500" size={24} />;
      case 2:
        return <Medal className="text-gray-300" size={24} />;
      case 3:
        return <Medal className="text-orange-400" size={24} />;
      default:
        return <span className="text-gray-400 font-bold text-lg">#{rank}</span>;
    }
  };

  const getTierColor = (tier: MembershipTier) => {
    switch (tier) {
      case MembershipTier.LEGEND:
        return 'border-yellow-500/30 bg-yellow-500/10';
      case MembershipTier.SHERIFF:
        return 'border-orange-500/30 bg-orange-500/10';
      case MembershipTier.DEPUTY:
        return 'border-gray-500/30 bg-gray-500/10';
      default:
        return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="bebas-header text-2xl text-white flex items-center gap-2">
          <Trophy className="text-orange-500" size={28} />
          TOP SHERIFFS
        </h3>
        {currentUserId && userRank > 0 && (
          <div className="text-orange-400 font-bold">
            Your Rank: #{userRank}
          </div>
        )}
      </div>

      {leaderboard.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          <Trophy className="mx-auto mb-4 text-gray-600" size={48} />
          <p>Be the first to earn points and claim the #1 spot!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((user, index) => (
            <div
              key={user.userId}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-all hover:scale-105 ${
                getTierColor(user.tier)
              } ${
                currentUserId === user.userId 
                  ? 'ring-2 ring-orange-500 bg-orange-500/20' 
                  : ''
              }`}
            >
              <div className="flex items-center justify-center w-12">
                {getRankIcon(user.rank)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-white">
                    {user.displayName}
                  </span>
                  {getTierIcon(user.tier)}
                  <span className="text-xs text-gray-400 capitalize">
                    {user.tier}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-orange-400 font-bold">
                    {user.totalPoints.toLocaleString()} points
                  </span>
                  {user.achievements > 0 && (
                    <span className="text-yellow-400">
                      🏆 {user.achievements} achievements
                    </span>
                  )}
                </div>
              </div>
              
              {currentUserId === user.userId && (
                <div className="text-orange-500 font-bold text-sm">
                  YOU
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
        <p className="text-gray-400 text-sm text-center">
          🔥 Compete with other fans to climb the leaderboard! 
          Earn points by purchasing music, sharing content, and participating in activities.
        </p>
      </div>
    </div>
  );
}
