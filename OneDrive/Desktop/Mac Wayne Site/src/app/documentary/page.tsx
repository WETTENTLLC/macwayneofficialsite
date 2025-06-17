'use client';

import { useState, useEffect } from 'react';
import { Play, Lock, Headphones, Eye, MapPin, Volume2 } from 'lucide-react';
import PremiumAudioPlayer from '../../components/PremiumAudioPlayer';
import PaymentComponent from '../../components/PaymentComponent';
import { getAudioTrack, getTracksByTag, getValidAudioSrc } from '../../lib/audioTracks';
import { useAuth } from '../../contexts/AuthContext';
import { isPurchased, recordPurchase, PurchaseType } from '../../lib/purchaseTracker';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  type: 'prison' | 'music' | 'documentary' | 'milestone';
  locked?: boolean;
}

const timeline: TimelineEvent[] = [
  {
    year: '2015',
    title: 'The Beginning',
    description: 'Mac Wayne enters the system, music becomes his escape',
    type: 'prison'
  },
  {
    year: '2016',
    title: 'First Beats',
    description: 'Recording music with improvised equipment behind bars',
    type: 'music'
  },  {
    year: '2018',
    title: 'Going Blind',
    description: 'Medical condition takes Mac&apos;s sight, changes everything',
    type: 'milestone'
  },
  {
    year: '2019',
    title: 'The Documentary Begins',
    description: 'Filmmakers discover Mac\'s story, cameras start rolling',
    type: 'documentary'
  },
  {
    year: '2021',
    title: 'Release Day',
    description: 'Freedom and the challenge of adapting to life outside',
    type: 'milestone'
  },
  {
    year: '2023',
    title: 'Blind & Battered Premiere',
    description: 'Documentary premieres, Mac\'s story reaches the world',
    type: 'documentary'
  },
  {
    year: '2024',
    title: 'The Sequel',
    description: 'New chapter begins - life after the documentary',
    type: 'documentary',
    locked: true
  }
];

export default function DocumentaryPage() {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [isVRMode, setIsVRMode] = useState(false);
  const [email, setEmail] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Check if the user has full access
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      // Check if the user has purchased the documentary
      const hasAccess = isPurchased(user.id, PurchaseType.DOCUMENTARY, 'full-documentary');
      setUnlocked(hasAccess);
    }
  }, [isAuthenticated, user]);

  // Get documentary-specific tracks
  const documentaryTracks = getTracksByTag('documentary');
  const prisonDaysTrack = getAudioTrack('documentary-narration') || documentaryTracks[0];
  const blindnessTrack = getAudioTrack('going-blind-story') || documentaryTracks[1];
  const musicPrisonTrack = getAudioTrack('music-in-prison') || documentaryTracks[2];

  const getEventColor = (type: string) => {
    switch (type) {
      case 'prison': return 'bg-gray-600';
      case 'music': return 'bg-orange-500';
      case 'documentary': return 'bg-blue-500';
      case 'milestone': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const subscribeForSequel = () => {
    if (email) {
      alert('Thanks for subscribing! You\'ll get exclusive access to sequel teasers.');
      setEmail('');
    }
  };

  // Handle documentary purchase
  const handleDocumentaryPurchase = (paymentId: string) => {
    if (isAuthenticated && user?.id) {
      // Record the purchase
      recordPurchase(
        user.id,
        PurchaseType.DOCUMENTARY,
        'full-documentary',
        4.99,
        paymentId
      );
      setUnlocked(true);
    }
  };
  return (
    <div className="min-h-screen bg-gray-900 text-white w-full overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative bg-black py-20 px-4 overflow-hidden w-full">
        <div className="absolute inset-0 braille-texture opacity-20"></div>
        <div className="w-full max-w-7xl mx-auto text-center relative z-10 px-4">
          <h1 className="bebas-header text-4xl sm:text-6xl md:text-8xl lg:text-9xl text-white mb-8 tracking-tight">
            BLIND & BATTERED
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-orange-500 mb-8 font-bold">
            The Documentary Experience
          </p>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-4xl mx-auto mb-16 leading-relaxed">
            Follow Mac Wayne&apos;s journey from the cell block to the studio, 
            from sight to blindness, from prisoner to artist. This isn&apos;t just a story—it&apos;s an immersion.
          </p>          {/* Mac Wayne Music Video - Featured Prominently */}
          <div className="w-full max-w-6xl mx-auto mb-16">
            <div className="relative mx-auto">
              {/* Enhanced Glow Effect Background */}
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 via-orange-400/30 to-orange-500/20 rounded-2xl blur-xl animate-pulse"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-orange-600/10 via-orange-500/20 to-orange-600/10 rounded-2xl blur-lg"></div>              {/* Video Container with enhanced compatibility */}
              <div className="video-container relative bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-orange-500/50 mx-auto">
                {/* Responsive Video Wrapper with Multiple Fallbacks */}
                <div className="video-responsive">
                  <iframe 
                    src="https://www.youtube.com/embed/CkDPQkDTxC8?si=uZfYxOSBOe_ZYC4V&rel=0&modestbranding=1&showinfo=0&controls=1&autoplay=0&mute=0&enablejsapi=1" 
                    title="Blind & Battered - Mac Wayne Official Music Video" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                    allowFullScreen
                    loading="lazy"
                    className="w-full h-full border-none"
                    onError={() => console.log('Video failed to load')}
                    onLoad={() => console.log('Video loaded successfully')}
                  ></iframe>
                  
                  {/* Fallback content for when video doesn't load */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="text-center">
                      <Play size={64} className="mx-auto mb-4 text-orange-500" />
                      <p className="text-lg font-bold">Mac Wayne - Blind &amp; Battered</p>
                      <p className="text-sm text-gray-300">Official Music Video</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Video Info */}              <div className="text-center mt-8">
                <div className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-600 rounded-full px-6 py-2 mb-4">
                  <Play className="mr-2" size={20} />
                  <span className="text-white font-bold text-lg">OFFICIAL MUSIC VIDEO</span>
                </div>
                <h3 className="text-white text-2xl md:text-3xl font-bold mb-2">
                  &ldquo;Blind &amp; Battered&rdquo;
                </h3>
                <p className="text-orange-400 text-lg font-medium max-w-2xl mx-auto">
                  Experience Mac Wayne&apos;s powerful story through music and visuals - 
                  a raw, authentic look into overcoming life&apos;s greatest challenges
                </p>
              </div>
            </div>
          </div>
          
          {!unlocked && (
            <div className="bg-gray-800/90 backdrop-blur-sm border border-orange-500/50 rounded-2xl p-8 max-w-2xl mx-auto shadow-2xl">
              <div className="text-center mb-6">
                <Lock className="mx-auto mb-4" size={48} color="#f97316" />
                <h3 className="text-2xl font-bold text-white mb-2">Unlock Full Experience</h3>
              </div>
              <p className="text-lg mb-4 text-gray-300">
                <span className="text-orange-400 font-bold">Preview Mode:</span> All clips are limited to 30 seconds.
              </p>
              <p className="text-white mb-8 text-lg">
                Get unlimited access to the complete documentary series, exclusive interviews, and behind-the-scenes content.
              </p>
              <PaymentComponent
                amount={4.99}
                description="Full Access to Documentary Series"
                onSuccess={handleDocumentaryPurchase}
              />
            </div>
          )}
        </div>
      </div>{/* Interactive Timeline */}
      <div className="py-20 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="bebas-header text-5xl md:text-6xl text-white mb-6">
              MAC&apos;S JOURNEY
            </h2>            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Navigate through the key moments that shaped Mac Wayne&apos;s incredible story
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-orange-500 to-orange-600 h-full shadow-lg"></div>
            
            <div className="space-y-16">
              {timeline.map((event, index) => (
                <div
                  key={event.year}
                  className={`flex items-center ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                    <div
                      className={`bg-gray-800 p-8 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-gray-700 hover:shadow-xl hover:scale-105 border border-gray-700 hover:border-orange-500/50 ${
                        event.locked ? 'opacity-60' : ''
                      }`}
                      onClick={() => !event.locked && setSelectedEvent(event)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg ${getEventColor(event.type)}`}>
                          {event.type.toUpperCase()}
                        </span>
                        {event.locked && <Lock size={24} className="text-gray-400" />}
                      </div>
                      <h3 className="bebas-header text-2xl md:text-3xl text-white mb-3">{event.title}</h3>
                      <p className="text-gray-300 text-base leading-relaxed">{event.description}</p>
                      <div className="mt-4 text-orange-400 font-bold text-lg">
                        {event.year}
                      </div>
                    </div>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="relative z-10">
                    <div className={`w-8 h-8 rounded-full ${getEventColor(event.type)} flex items-center justify-center shadow-lg border-4 border-gray-900`}>
                      <span className="text-sm font-bold text-white">{event.year.slice(-2)}</span>
                    </div>
                  </div>
                  
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>      {/* VR Studio Tour */}
      <div className="bg-black py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="bebas-header text-5xl md:text-6xl text-white mb-8">
            360° STUDIO EXPERIENCE
          </h2>
          <p className="text-gray-300 text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed">
            Take a virtual reality tour of Mac Wayne&apos;s studio, narrated by the man himself. 
            Experience the space where the magic happens.
          </p>
          
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-12 mb-12 border border-gray-700 shadow-2xl max-w-4xl mx-auto">
            {isVRMode ? (
              <div className="text-center">
                <div className="relative mb-8">
                  {/* Enhanced Pulsing Animation */}
                  <div className="w-40 h-40 bg-orange-500 rounded-full mx-auto flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-orange-400 rounded-full animate-ping opacity-75"></div>
                    <div className="absolute inset-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <div className="absolute inset-4 bg-orange-600 rounded-full animate-bounce"></div>
                    <Eye size={64} className="text-white relative z-10" />
                  </div>
                </div>
                <h3 className="bebas-header text-3xl md:text-4xl text-white mb-6">VR MODE ACTIVE</h3>
                <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
                  Put on your headset and explore Mac&apos;s world through immersive 360° audio and spatial navigation
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setIsVRMode(false)}
                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-xl"
                  >
                    EXIT VR
                  </button>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-xl">
                    FULL SCREEN
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="mb-8">
                  <div className="relative inline-block">
                    <Headphones size={80} className="text-orange-500 mx-auto mb-4" />
                    <div className="absolute -inset-2 bg-orange-500/20 rounded-full blur-xl animate-pulse"></div>
                  </div>
                </div>
                <h3 className="bebas-header text-3xl md:text-4xl text-white mb-6">AUDIO TOUR READY</h3>
                <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto leading-relaxed">
                  Experience Mac&apos;s studio through detailed audio description, immersive soundscapes, 
                  and spatial audio that brings you inside his creative space
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setIsVRMode(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-xl border-2 border-orange-400 hover:border-orange-300"
                  >
                    START VR TOUR
                  </button>
                  <button className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-xl border-2 border-gray-500 hover:border-gray-400">
                    AUDIO ONLY
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>{/* Sequel Teaser Vault */}
      <div className="py-20 px-4 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-12">
            <div className="inline-flex items-center justify-center mb-6">
              <Lock className="mr-4" size={48} color="#f97316" />
              <h2 className="bebas-header text-5xl md:text-6xl text-white">
                SEQUEL TEASER VAULT
              </h2>
            </div>
            <p className="text-gray-300 text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
              The story continues. Get exclusive access to behind-the-scenes content 
              and teasers from the upcoming sequel documentary.
            </p>
          </div>
          
          <div className="bg-black/50 backdrop-blur-sm rounded-3xl p-12 border border-orange-500/30 shadow-2xl">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Lock size={40} className="text-white" />
              </div>
              <h3 className="bebas-header text-3xl md:text-4xl text-orange-500 mb-6">
                UNLOCK EXCLUSIVE CONTENT
              </h3>
              <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
                Subscribe to get password access to unreleased footage, interviews, and sequel previews.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row max-w-lg mx-auto gap-0">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-gray-700 text-white px-6 py-4 rounded-l-2xl sm:rounded-r-none rounded-r-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg border border-gray-600 focus:border-orange-500"
              />
              <button
                onClick={subscribeForSequel}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-r-2xl sm:rounded-l-none rounded-l-2xl font-bold text-lg transition-all duration-300 hover:scale-105 border border-orange-500"
              >
                UNLOCK
              </button>
            </div>
          </div>
        </div>
      </div>      {/* Street Map Section */}
      <div className="py-20 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="bebas-header text-5xl md:text-6xl text-white mb-6">
              STREETS OF EVERETT
            </h2>
            <p className="text-gray-300 text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
              Explore the locations from Mac&apos;s story with crowd-sourced audio stories
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-12 border border-gray-700 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-700/50 backdrop-blur-sm rounded-2xl p-8 hover:bg-gray-600/50 transition-all duration-300 cursor-pointer hover:scale-105 border border-gray-600 hover:border-orange-500/50">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <MapPin className="text-white" size={32} />
                  </div>
                  <h3 className="font-bold text-white text-xl mb-3">The Corner</h3>
                  <p className="text-gray-300">Where it all started - 3 audio stories</p>
                </div>
                <div className="text-center">
                  <span className="bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm font-medium">
                    Listen Now
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-700/50 backdrop-blur-sm rounded-2xl p-8 hover:bg-gray-600/50 transition-all duration-300 cursor-pointer hover:scale-105 border border-gray-600 hover:border-orange-500/50">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <MapPin className="text-white" size={32} />
                  </div>
                  <h3 className="font-bold text-white text-xl mb-3">The Studio</h3>
                  <p className="text-gray-300">First recording sessions - 5 audio stories</p>
                </div>
                <div className="text-center">
                  <span className="bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm font-medium">
                    Listen Now
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-700/50 backdrop-blur-sm rounded-2xl p-8 hover:bg-gray-600/50 transition-all duration-300 cursor-pointer hover:scale-105 border border-gray-600 hover:border-orange-500/50 md:col-span-2 lg:col-span-1">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <MapPin className="text-white" size={32} />
                  </div>
                  <h3 className="font-bold text-white text-xl mb-3">Release Day</h3>
                  <p className="text-gray-300">Walking free - 2 audio stories</p>
                </div>
                <div className="text-center">
                  <span className="bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm font-medium">
                    Listen Now
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>      {/* Audio Narration Section */}
      <div className="bg-gray-900 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-6">
              <Volume2 className="mr-4" size={48} color="#f97316" />
              <h2 className="bebas-header text-5xl md:text-6xl text-white">
                HEAR MAC&apos;S STORY
              </h2>
            </div>
            <p className="text-gray-300 text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
              Listen to Mac Wayne narrate key moments from his journey in his own words
            </p>
          </div>

          <div className="space-y-8">
            <PremiumAudioPlayer
              src={getValidAudioSrc(prisonDaysTrack?.src || '/audio/sample-track.mp3')}
              title={prisonDaysTrack?.title || "The Beginning - Prison Days"}
              artist={prisonDaysTrack?.artist || "Mac Wayne"}
              duration={prisonDaysTrack?.duration || "8:45"}
              className="bg-black/50 border border-gray-700 hover:border-orange-500/50 transition-all duration-300"
              showWaveform={true}
              previewMode={!unlocked}
              previewDuration={30}
              contentType={PurchaseType.DOCUMENTARY}
              trackId={prisonDaysTrack?.id || "documentary-narration"}
            />
            
            <PremiumAudioPlayer
              src={getValidAudioSrc(blindnessTrack?.src || '/audio/sample-track.mp3')}
              title={blindnessTrack?.title || "Losing My Sight, Finding My Vision"}
              artist={blindnessTrack?.artist || "Mac Wayne"}
              duration={blindnessTrack?.duration || "12:30"}
              className="bg-black/50 border border-gray-700 hover:border-orange-500/50 transition-all duration-300"
              showWaveform={true}
              previewMode={!unlocked}
              previewDuration={30}
              contentType={PurchaseType.DOCUMENTARY}
              trackId={blindnessTrack?.id || "going-blind-story"}
            />
            
            <PremiumAudioPlayer
              src={getValidAudioSrc(musicPrisonTrack?.src || '/audio/sample-track.mp3')}
              title={musicPrisonTrack?.title || "Making Music Behind Bars"}
              artist={musicPrisonTrack?.artist || "Mac Wayne"}
              duration={musicPrisonTrack?.duration || "6:15"}
              className="bg-black/50 border border-gray-700 hover:border-orange-500/50 transition-all duration-300"
              showWaveform={true}
              previewMode={!unlocked}
              previewDuration={30}
              contentType={PurchaseType.DOCUMENTARY}
              trackId={musicPrisonTrack?.id || "music-in-prison"}
            />
          </div>
          
          <div className="mt-12 p-8 bg-orange-500/10 border border-orange-500/30 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center justify-center mb-4">
              <Headphones className="text-orange-500 mr-4" size={32} />
              <h3 className="text-orange-500 font-bold text-2xl">Accessibility Note</h3>
            </div>
            <p className="text-gray-300 text-lg text-center max-w-3xl mx-auto">
              All audio content includes full transcripts and detailed descriptions. 
              Use keyboard controls: Space to play/pause, arrow keys to navigate.
            </p>
          </div>
        </div>
      </div>      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-10 max-w-3xl w-full border border-gray-700 shadow-2xl">
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className={`px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg ${getEventColor(selectedEvent.type)}`}>
                  {selectedEvent.type.toUpperCase()}
                </span>
                <h2 className="bebas-header text-4xl md:text-5xl text-white mt-4 mb-2">{selectedEvent.title}</h2>
                <p className="text-orange-500 text-2xl font-bold">{selectedEvent.year}</p>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-white text-3xl transition-colors p-2 hover:bg-gray-700 rounded-full"
              >
                ×
              </button>
            </div>
            
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">{selectedEvent.description}</p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 flex items-center justify-center">
                <Play className="mr-3" size={24} />
                WATCH CLIP
              </button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 flex items-center justify-center">
                <Headphones className="mr-3" size={24} />
                AUDIO STORY
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
