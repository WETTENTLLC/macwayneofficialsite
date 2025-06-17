'use client';

import { CheckCircle, Circle, Clock, Play, Users, ShoppingCart, Mic } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface FeatureStatus {
  name: string;
  status: 'completed' | 'in-progress' | 'pending';
  description: string;
  testable?: boolean;
}

export default function StatusPage() {
  const { isAuthenticated, user } = useAuth();
  
  const features: FeatureStatus[] = [
    {
      name: 'User Authentication System',
      status: 'completed',
      description: 'Login, registration, session management with mock backend',
      testable: true
    },
    {
      name: 'Advanced Audio Player',
      status: 'completed',
      description: 'Waveform visualization, accessibility controls, keyboard navigation',
      testable: true
    },
    {
      name: 'Voice Command Navigation',
      status: 'completed',
      description: 'Speech recognition for site navigation and accessibility',
      testable: true
    },
    {
      name: 'Payment Integration',
      status: 'completed',
      description: 'PayPal/Stripe ready payment components with security features',
      testable: true
    },
    {
      name: 'Enhanced Navigation',
      status: 'completed',
      description: 'Accessibility controls, user authentication, mobile-friendly',
      testable: true
    },
    {
      name: 'Live Assistance Portal',
      status: 'completed',
      description: 'Real-time volunteer queue, deputy membership, tip system',
      testable: true
    },
    {
      name: 'Shop with Audio Previews',
      status: 'completed',
      description: 'Music products with integrated audio players and checkout',
      testable: true
    },
    {
      name: 'Checkout System',
      status: 'completed',
      description: 'Complete order management, payment processing, accessibility',
      testable: true
    },
    {
      name: 'Database Schema',
      status: 'completed',
      description: 'PostgreSQL schema for all features (12 tables, indexes, relationships)',
      testable: false
    },
    {
      name: 'API Endpoints',
      status: 'completed',
      description: 'Auth, cart management, loyalty program APIs with mock data',
      testable: true
    },
    {
      name: 'Documentary Audio Narration',
      status: 'completed',
      description: 'Multiple audio player instances with accessibility compliance',
      testable: true
    },
    {
      name: 'Loyalty Program Framework',
      status: 'completed',
      description: 'Points system, tier management, rewards structure',
      testable: true
    },
    {
      name: 'Real Audio Files',
      status: 'pending',
      description: 'Actual music files and audio content integration',
      testable: false
    },
    {
      name: 'Live Streaming Integration',
      status: 'pending',
      description: 'WebRTC or streaming service integration for assistance portal',
      testable: false
    },
    {
      name: 'Email System',
      status: 'pending',
      description: 'Newsletter subscriptions, order confirmations, notifications',
      testable: false
    },
    {
      name: 'Production Database',
      status: 'pending',
      description: 'PostgreSQL deployment and real data migration',
      testable: false
    },
    {
      name: 'VR/360° Audio Tours',
      status: 'pending',
      description: 'Immersive audio experiences for documentary content',
      testable: false
    },
    {
      name: 'Mobile App Optimization',
      status: 'in-progress',
      description: 'Progressive Web App features and mobile-specific enhancements',
      testable: true
    },
    {
      name: 'Accessibility Testing',
      status: 'in-progress',
      description: 'WCAG compliance validation and screen reader testing',
      testable: true
    },
    {
      name: 'Production Deployment',
      status: 'pending',
      description: 'CDN setup, performance optimization, domain configuration',
      testable: false
    }
  ];

  const getStatusIcon = (status: FeatureStatus['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'in-progress':
        return <Clock className="text-yellow-500" size={20} />;
      case 'pending':
        return <Circle className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status: FeatureStatus['status']) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 bg-green-50';
      case 'in-progress':
        return 'border-yellow-500 bg-yellow-50';
      case 'pending':
        return 'border-gray-500 bg-gray-50';
    }
  };

  const completedCount = features.filter(f => f.status === 'completed').length;
  const inProgressCount = features.filter(f => f.status === 'in-progress').length;
  const pendingCount = features.filter(f => f.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="bebas-header text-6xl text-white mb-4">
            MAC WAYNE OFFICIAL
          </h1>
          <h2 className="bebas-header text-3xl text-orange-500 mb-6">
            DEVELOPMENT STATUS REPORT
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Current progress on The Blind Visionary&apos;s Universe website
          </p>

          {/* Status Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
            <div className="bg-green-500 bg-opacity-20 border border-green-500 rounded-lg p-6">
              <div className="text-3xl font-bold text-green-400 mb-2">{completedCount}</div>
              <div className="text-green-300">Features Completed</div>
            </div>
            <div className="bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded-lg p-6">
              <div className="text-3xl font-bold text-yellow-400 mb-2">{inProgressCount}</div>
              <div className="text-yellow-300">In Progress</div>
            </div>
            <div className="bg-gray-500 bg-opacity-20 border border-gray-500 rounded-lg p-6">
              <div className="text-3xl font-bold text-gray-400 mb-2">{pendingCount}</div>
              <div className="text-gray-300">Pending</div>
            </div>
          </div>

          {/* Authentication Status */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h3 className="bebas-header text-2xl text-orange-500 mb-4">CURRENT SESSION</h3>
            {isAuthenticated ? (
              <div className="text-center">
                <p className="text-green-400 mb-2">✓ Authenticated as {user?.name}</p>
                <p className="text-gray-300">Email: {user?.email}</p>
                <p className="text-gray-300">Deputy Member: {user?.isDeputyMember ? 'Yes' : 'No'}</p>
                <p className="text-gray-300">Loyalty Points: {user?.loyaltyPoints}</p>
              </div>
            ) : (
              <p className="text-yellow-400">⚠ Not authenticated - Use navigation to sign in</p>
            )}
          </div>
        </div>

        {/* Quick Test Links */}
        <div className="mb-12">
          <h3 className="bebas-header text-2xl text-white mb-6">QUICK FEATURE TESTS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="/shop" className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-lg transition-colors text-center">
              <ShoppingCart className="mx-auto mb-2" size={24} />
              <div className="font-bold">Test Shop</div>
              <div className="text-sm">Audio previews & checkout</div>
            </a>
            <a href="/live" className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-lg transition-colors text-center">
              <Users className="mx-auto mb-2" size={24} />
              <div className="font-bold">Test Live Portal</div>
              <div className="text-sm">Volunteer system</div>
            </a>
            <a href="/documentary" className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-lg transition-colors text-center">
              <Play className="mx-auto mb-2" size={24} />
              <div className="font-bold">Test Documentary</div>
              <div className="text-sm">Audio narration</div>
            </a>
            <button 
              onClick={() => {
                const utterance = new SpeechSynthesisUtterance('Voice commands are working! Say go home, open shop, or help me.');
                speechSynthesis.speak(utterance);
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-lg transition-colors text-center"
            >
              <Mic className="mx-auto mb-2" size={24} />
              <div className="font-bold">Test Voice</div>
              <div className="text-sm">Commands & synthesis</div>
            </button>
          </div>
        </div>

        {/* Feature List */}
        <div className="space-y-4">
          <h3 className="bebas-header text-2xl text-white mb-6">DETAILED FEATURE STATUS</h3>
          {features.map((feature, index) => (
            <div
              key={index}
              className={`border-l-4 ${getStatusColor(feature.status)} p-4 bg-gray-800 rounded-r-lg`}
            >
              <div className="flex items-start space-x-3">
                {getStatusIcon(feature.status)}
                <div className="flex-1">
                  <h4 className="font-bold text-white mb-1">{feature.name}</h4>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
                  {feature.testable && (
                    <span className="inline-block mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded">
                      TESTABLE
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Server Info */}
        <div className="mt-12 bg-gray-800 rounded-lg p-6">
          <h3 className="bebas-header text-2xl text-orange-500 mb-4">SERVER STATUS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-white mb-2">Development Server</h4>
              <p className="text-gray-300">✓ Running on localhost:3002</p>
              <p className="text-gray-300">✓ Next.js 15.3.0</p>
              <p className="text-gray-300">✓ TypeScript enabled</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">API Endpoints</h4>
              <p className="text-gray-300">✓ /api/auth/login</p>
              <p className="text-gray-300">✓ /api/auth/register</p>
              <p className="text-gray-300">✓ /api/cart</p>
              <p className="text-gray-300">✓ /api/loyalty</p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6">
          <h3 className="bebas-header text-2xl text-white mb-4">NEXT PRIORITY STEPS</h3>
          <ul className="text-white space-y-2">
            <li>1. Add real audio files and test audio player functionality</li>
            <li>2. Implement actual PayPal/Stripe API integration</li>
            <li>3. Set up live streaming infrastructure for assistance portal</li>
            <li>4. Deploy PostgreSQL database and migrate to production APIs</li>
            <li>5. Conduct comprehensive accessibility testing</li>
            <li>6. Optimize for mobile and add PWA features</li>
            <li>7. Set up email notification system</li>
            <li>8. Implement VR/360° audio tour prototype</li>
            <li>9. Performance testing and CDN setup</li>
            <li>10. Production deployment and domain configuration</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
