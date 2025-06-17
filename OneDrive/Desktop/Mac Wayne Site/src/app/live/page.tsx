'use client';

import { useState, useEffect } from 'react';
import { Video, Mic, MicOff, Users, Hand, AlertTriangle, Star, DollarSign, Crown, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface VolunteerSession {
  id: string;
  task: string;
  status: 'waiting' | 'active' | 'completed';
  volunteers: number;
  timestamp: Date;
}

export default function LivePage() {
  const [isLive, setIsLive] = useState(false);
  const [currentTask, setCurrentTask] = useState('');
  const [volunteerQueue, setVolunteerQueue] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const [sessions] = useState<VolunteerSession[]>([
    {
      id: '1',
      task: 'Help navigate grocery store',
      status: 'completed',
      volunteers: 5,
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: '2',
      task: 'Read restaurant menu',
      status: 'completed',
      volunteers: 3,
      timestamp: new Date(Date.now() - 7200000)
    }
  ]);

  const [tipAmount, setTipAmount] = useState('');
  const joinVolunteerQueue = () => {
    if (!isAuthenticated) {
      alert('Please sign in to volunteer assistance');
      return;
    }
    
    setVolunteerQueue(prev => prev + 1);
    // Simulate queue position
    const isDeputyMember = user?.isDeputyMember;
    alert(isDeputyMember ? "You're next in line as a Deputy member!" : `You're #${volunteerQueue + 1} in queue`);
  };

  const sendTip = () => {
    if (tipAmount) {
      alert(`Thank you for the $${tipAmount} tip! Mac Wayne appreciates your support.`);
      setTipAmount('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-black py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="bebas-header text-6xl text-white mb-4">
            HELP THE BLIND MAN
          </h1>
          <p className="text-xl text-gray-400 mb-6">
            Live assistance portal - Be Mac Wayne's eyes in real-time
          </p>
          
          <div className={`inline-flex items-center px-4 py-2 rounded-full ${
            isLive ? 'bg-red-500' : 'bg-gray-600'
          }`}>
            <div className={`w-3 h-3 rounded-full mr-2 ${
              isLive ? 'bg-white animate-pulse' : 'bg-gray-400'
            }`}></div>
            {isLive ? 'LIVE NOW' : 'OFFLINE'}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Stream Area */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              {/* Video/Stream Placeholder */}
              <div className="aspect-video bg-black flex items-center justify-center">
                {isLive ? (
                  <div className="text-center">
                    <Video size={64} className="mx-auto mb-4 text-orange-500" />
                    <p className="text-xl">Mac Wayne is live!</p>
                    <p className="text-gray-400">Waiting for assistance...</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Video size={64} className="mx-auto mb-4 text-gray-500" />
                    <p className="text-xl text-gray-400">Stream Offline</p>
                    <p className="text-gray-500">Mac will be back soon</p>
                  </div>
                )}
              </div>

              {/* Stream Controls */}
              <div className="p-4 bg-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`p-2 rounded-full ${
                        isMuted ? 'bg-red-500' : 'bg-green-500'
                      }`}
                    >
                      {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>
                    <span className="text-sm">
                      {isMuted ? 'Muted' : 'Audio On'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Users size={20} className="text-orange-500" />
                    <span>{volunteerQueue} volunteers ready</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Task */}
            {isLive && (
              <div className="mt-6 bg-orange-500 rounded-lg p-6">
                <h3 className="bebas-header text-2xl mb-3">CURRENT TASK</h3>
                <p className="text-lg mb-4">
                  {currentTask || "Waiting for Mac to share what he needs help with..."}
                </p>
                
                <div className="flex space-x-4">
                  <button
                    onClick={joinVolunteerQueue}
                    className="bg-white text-orange-500 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                  >
                    <Hand className="inline mr-2" size={20} />
                    VOLUNTEER TO HELP
                  </button>
                  
                  <button className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-600 transition-colors">
                    <AlertTriangle className="inline mr-2" size={20} />
                    EMERGENCY
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Deputy Membership */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="bebas-header text-2xl text-orange-500 mb-4">
                <Star className="inline mr-2" size={24} />
                DEPUTY TIER              </h3>
              
              {user?.isDeputyMember ? (
                <div>
                  <p className="text-green-400 mb-3">✓ You&apos;re a Deputy!</p>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Priority volunteer queue</li>
                    <li>• Exclusive chat access</li>
                    <li>• Monthly meet &amp; greet</li>
                  </ul>
                </div>
              ) : (
                <div>
                  <p className="text-gray-300 mb-4">
                    Get priority access and exclusive perks for $5/month
                  </p>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg w-full font-bold">
                    BECOME A DEPUTY
                  </button>
                </div>
              )}
            </div>

            {/* Tip Jar */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="bebas-header text-2xl text-orange-500 mb-4">
                <DollarSign className="inline mr-2" size={24} />
                TIP JAR
              </h3>              <p className="text-gray-300 text-sm mb-4">
                Show appreciation for Mac&apos;s music and story
              </p>
              
              <div className="space-y-3">
                <div className="flex space-x-2">
                  {['5', '10', '20', '50'].map(amount => (
                    <button
                      key={amount}
                      onClick={() => setTipAmount(amount)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded text-sm font-bold flex-1"
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Custom amount"
                    value={tipAmount}
                    onChange={(e) => setTipAmount(e.target.value)}
                    className="flex-1 bg-gray-700 text-white px-3 py-2 rounded"
                  />
                  <button
                    onClick={sendTip}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-bold"
                  >
                    TIP
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="bebas-header text-2xl text-white mb-4">RECENT SESSIONS</h3>
              <div className="space-y-3">
                {sessions.map(session => (
                  <div key={session.id} className="border-l-4 border-orange-500 pl-3">
                    <p className="text-sm font-semibold text-white">{session.task}</p>
                    <p className="text-xs text-gray-400">
                      {session.volunteers} volunteers helped • {session.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="bebas-header text-2xl text-white mb-4">HOW IT WORKS</h3>
              <ol className="text-sm text-gray-300 space-y-2">
                <li>1. Mac goes live when he needs help</li>
                <li>2. He describes what he needs assistance with</li>
                <li>3. Volunteers use their cameras/audio to guide him</li>
                <li>4. Top helpers get signed merch!</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="bg-black py-6 px-4">
        <div className="max-w-4xl mx-auto text-center">          <p className="text-gray-400 mb-2">
            &ldquo;Y&apos;all are my eyes when I need to see the world. Real recognize real.&rdquo;
          </p>
          <cite className="text-orange-500 font-bold">- Mac Wayne</cite>
        </div>
      </div>
    </div>
  );
}
