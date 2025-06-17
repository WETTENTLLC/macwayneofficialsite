'use client';

import { useState, useEffect, useRef } from 'react';
import { getPrisonGatesSound, getValidAudioSrc } from '../lib/audioTracks';

interface DramaticIntroProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function DramaticIntro({ onComplete, onSkip }: DramaticIntroProps) {
  const [stage, setStage] = useState<'loading' | 'prison-gates' | 'eyes-closed' | 'eyes-opening' | 'logo-reveal' | 'complete'>('loading');
  const audioRef = useRef<HTMLAudioElement>(null);
  const [eyeOpenProgress, setEyeOpenProgress] = useState(0);

  // Get prison gates sound effect
  const prisonGatesTrack = getPrisonGatesSound();
  const audioSrc = prisonGatesTrack ? getValidAudioSrc(prisonGatesTrack.src) : '/audio/sample-track.mp3';

  useEffect(() => {    // Start the sequence
    const timer = setTimeout(() => {
      setStage('prison-gates');
      
      // Play prison gates opening sound
      if (audioRef.current) {
        audioRef.current.volume = 0.7;
        audioRef.current.play().catch(console.error);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (stage === 'prison-gates') {
      // Transition to eyes closed after 2 seconds
      const timer = setTimeout(() => {
        setStage('eyes-closed');
      }, 2000);
      return () => clearTimeout(timer);
    }
    
    if (stage === 'eyes-closed') {
      // Start eyes opening animation after 1 second
      const timer = setTimeout(() => {
        setStage('eyes-opening');
        
        // Animate eye opening progress
        let progress = 0;
        const eyeTimer = setInterval(() => {
          progress += 2;
          setEyeOpenProgress(progress);
          
          if (progress >= 100) {
            clearInterval(eyeTimer);
            setStage('logo-reveal');
          }
        }, 50);
        
      }, 1000);
      return () => clearTimeout(timer);
    }
    
    if (stage === 'logo-reveal') {
      // Complete the intro after logo animation
      const timer = setTimeout(() => {
        setStage('complete');
        onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [stage, onComplete]);

  const handleSkip = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    onSkip();
  };

  if (stage === 'complete') {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">      {/* Audio */}
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="auto"
      />
      
      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 z-60 text-white/70 hover:text-white transition-colors text-sm font-medium"
        aria-label="Skip intro"
      >
        Skip Intro
      </button>

      {/* Prison Gates Opening */}
      {stage === 'prison-gates' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full bg-gradient-to-b from-gray-900 to-black">            {/* Prison bars */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex space-x-6">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-full bg-gradient-to-b from-gray-300 via-gray-500 to-gray-700 shadow-2xl"
                    style={{
                      animationDelay: `${i * 0.05}s`,
                      boxShadow: '0 0 20px rgba(0,0,0,0.8), inset 0 0 10px rgba(255,255,255,0.1)',
                      background: 'linear-gradient(to bottom, #d1d5db 0%, #6b7280 50%, #374151 100%)'
                    }}
                  >
                    {/* Rust and wear effects */}
                    <div className="w-full h-full opacity-60 bg-gradient-to-b from-orange-900/20 via-transparent to-orange-800/30" />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Gates opening effect */}
            <div className="absolute inset-0 flex">
              <div className="w-1/2 h-full bg-gradient-to-r from-gray-800 to-transparent animate-slide-left" />
              <div className="w-1/2 h-full bg-gradient-to-l from-gray-800 to-transparent animate-slide-right" />
            </div>
            
            {/* Dramatic lighting */}
            <div className="absolute inset-0 bg-gradient-radial from-orange-500/20 via-transparent to-black animate-pulse" />
          </div>
        </div>
      )}

      {/* Eyes Closed/Opening */}
      {(stage === 'eyes-closed' || stage === 'eyes-opening') && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          {/* First person eye view */}
          <div className="relative w-full h-full overflow-hidden">
            {/* Eyelids */}
            <div className="absolute inset-0 flex flex-col">
              {/* Upper eyelid */}
              <div
                className="w-full bg-gradient-to-b from-red-900/80 to-red-800/60 transition-all duration-1000"
                style={{
                  height: stage === 'eyes-closed' ? '50%' : `${50 - (eyeOpenProgress * 0.5)}%`,
                  transform: `translateY(${stage === 'eyes-opening' ? `-${eyeOpenProgress * 0.3}%` : '0'})`
                }}
              >
                {/* Eyelashes effect */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-black to-transparent opacity-60" />
              </div>
              
              {/* Lower eyelid */}
              <div
                className="w-full bg-gradient-to-t from-red-900/80 to-red-800/60 transition-all duration-1000"
                style={{
                  height: stage === 'eyes-closed' ? '50%' : `${50 - (eyeOpenProgress * 0.5)}%`,
                  transform: `translateY(${stage === 'eyes-opening' ? `${eyeOpenProgress * 0.3}%` : '0'})`
                }}
              >
                {/* Eyelashes effect */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-black to-transparent opacity-60" />
              </div>
            </div>
            
            {/* What's revealed when eyes open */}
            {stage === 'eyes-opening' && eyeOpenProgress > 20 && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-gray-900 to-black transition-opacity duration-1000"
                style={{ opacity: eyeOpenProgress / 100 }}
              >
                <div className="text-center">                  <div className="text-white/20 text-6xl font-bold mb-8 animate-pulse">
                    The Blind Visionary&apos;s Universe
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Logo Reveal */}
      {stage === 'logo-reveal' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
          <div className="text-center transform animate-fade-in-scale">
            {/* Main Logo */}
            <div className="mb-8">
              <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 animate-glow">
                MAC WAYNE
              </h1>
              <div className="h-1 w-32 bg-gradient-to-r from-orange-500 to-purple-600 mx-auto animate-expand" />
            </div>
              {/* Tagline */}
            <p className="text-2xl text-white/80 font-light tracking-wider animate-fade-in-up">
              The Blind Visionary&apos;s Universe
            </p>
            
            {/* Subtitle */}
            <p className="text-lg text-orange-400/70 mt-4 animate-fade-in-up-delayed">
              From Behind Bars to Beyond Limits
            </p>
            
            {/* Dramatic effects */}
            <div className="absolute inset-0 bg-gradient-radial from-orange-500/10 via-transparent to-transparent animate-pulse" />
            <div className="absolute inset-0 bg-gradient-conic from-orange-500/5 via-purple-500/5 to-orange-500/5 animate-spin-slow" />
          </div>
        </div>
      )}

      {/* Custom styles */}
      <style jsx>{`
        @keyframes slide-left {
          to {
            transform: translateX(-100%);
          }
        }
        
        @keyframes slide-right {
          to {
            transform: translateX(100%);
          }
        }
        
        @keyframes fade-in-scale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-up-delayed {
          0%, 50% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes glow {
          0%, 100% {
            text-shadow: 0 0 20px rgba(251, 146, 60, 0.5);
          }
          50% {
            text-shadow: 0 0 30px rgba(251, 146, 60, 0.8), 0 0 40px rgba(239, 68, 68, 0.5);
          }
        }
        
        @keyframes expand {
          from {
            width: 0;
          }
          to {
            width: 8rem;
          }
        }
        
        @keyframes spin-slow {
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-slide-left {
          animation: slide-left 2s ease-in-out forwards;
        }
        
        .animate-slide-right {
          animation: slide-right 2s ease-in-out forwards;
        }
        
        .animate-fade-in-scale {
          animation: fade-in-scale 2s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out 0.5s both;
        }
        
        .animate-fade-in-up-delayed {
          animation: fade-in-up-delayed 2s ease-out both;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        .animate-expand {
          animation: expand 1s ease-out 0.5s both;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
        
        .bg-gradient-conic {
          background: conic-gradient(var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
}
