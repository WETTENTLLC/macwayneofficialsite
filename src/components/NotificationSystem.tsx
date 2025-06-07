'use client';

import { useState, useEffect } from 'react';
import { X, Star, Trophy, Gift } from 'lucide-react';

interface Notification {
  id: string;
  type: 'points' | 'achievement' | 'reward' | 'tier';
  title: string;
  message: string;
  points?: number;
  timestamp: number;
}

interface NotificationSystemProps {
  notifications: Notification[];
  onDismiss?: (id: string) => void;
}

export default function NotificationSystem({ notifications, onDismiss }: NotificationSystemProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Show new notifications
    setVisibleNotifications(notifications);    // Auto-dismiss after 5 seconds
    const timeouts = notifications.map(notification => 
      setTimeout(() => {
        onDismiss?.(notification.id);
      }, 5000)
    );

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [notifications, onDismiss]);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'points':
        return <Star className="text-orange-500" size={24} />;
      case 'achievement':
        return <Trophy className="text-yellow-500" size={24} />;
      case 'reward':
        return <Gift className="text-green-500" size={24} />;
      case 'tier':
        return <Star className="text-purple-500" size={24} />;
      default:
        return <Star className="text-blue-500" size={24} />;
    }
  };

  const getBackgroundColor = (type: Notification['type']) => {
    switch (type) {
      case 'points':
        return 'bg-orange-500/10 border-orange-500/20';
      case 'achievement':
        return 'bg-yellow-500/10 border-yellow-500/20';
      case 'reward':
        return 'bg-green-500/10 border-green-500/20';
      case 'tier':
        return 'bg-purple-500/10 border-purple-500/20';
      default:
        return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {visibleNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getBackgroundColor(notification.type)} backdrop-blur-sm rounded-lg p-4 border shadow-lg animate-slide-in-right`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              {getIcon(notification.type)}
              <div className="flex-1">
                <h4 className="font-bold text-white text-sm">{notification.title}</h4>
                <p className="text-gray-300 text-xs mt-1">{notification.message}</p>
                {notification.points && (
                  <p className="text-orange-400 font-bold text-xs mt-1">
                    +{notification.points} points
                  </p>
                )}
              </div>
            </div>            <button
              onClick={() => onDismiss?.(notification.id)}
              className="text-gray-400 hover:text-white transition-colors ml-2"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Utility function to create notifications
export function createNotification(
  type: Notification['type'],
  title: string,
  message: string,
  points?: number
): Notification {
  return {
    id: `notification_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    type,
    title,
    message,
    points,
    timestamp: Date.now()
  };
}
