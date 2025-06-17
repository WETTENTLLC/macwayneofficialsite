'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, FastForward, Lock } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  title: string;
  artist?: string;
  duration?: string;
  className?: string;
  showWaveform?: boolean;
  previewMode?: boolean;
  previewDuration?: number;
  requiresPurchase?: boolean;
  onPurchaseClick?: () => void;
}

export default function AudioPlayer({ 
  src, 
  title, 
  artist = "Mac Wayne", 
  duration,
  className = "",
  showWaveform = false,
  previewMode = false,
  previewDuration = 30,
  requiresPurchase = false,
  onPurchaseClick
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [previewEnded, setPreviewEnded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      
      // Handle preview mode time limit
      if (previewMode && audio.currentTime >= previewDuration) {
        audio.pause();
        setIsPlaying(false);
        setPreviewEnded(true);
      }
    };
    
    const updateDuration = () => setTotalDuration(audio.duration);
    const handleEnd = () => {
      setIsPlaying(false);
      setPreviewEnded(false);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnd);
    };
  }, [previewMode, previewDuration]);
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (requiresPurchase) {
      // If the song requires purchase, show purchase prompt instead of playing
      if (onPurchaseClick) {
        onPurchaseClick();
      }
      return;
    }

    // Reset preview ended state when playing again
    if (previewEnded) {
      audio.currentTime = 0;
      setPreviewEnded(false);
    }

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    if (!audio || !progressBar || requiresPurchase) return;

    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    let newTime = clickPosition * totalDuration;
    
    // In preview mode, don't allow seeking past the preview duration
    if (previewMode && newTime > previewDuration) {
      newTime = previewDuration;
    }
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio || requiresPurchase) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio || requiresPurchase) return;
    
    const newVolume = parseFloat(e.target.value);
    
    if (audio) {
      audio.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate how much of the progress bar should be filled
  const progressPercentage = totalDuration ? (currentTime / totalDuration) * 100 : 0;
  
  // For preview mode, calculate the preview percentage relative to total duration
  const previewPercentage = previewMode && totalDuration ? (previewDuration / totalDuration) * 100 : 100;

  return (
    <div className={`bg-black/90 border border-orange-500/30 rounded-lg p-4 ${className}`}>
      <audio ref={audioRef} src={src} preload="metadata" />
      
      {/* Track Info */}
      <div className="mb-4 flex justify-between items-start">
        <div>
          <h3 className="text-orange-500 font-bold text-lg">{title}</h3>
          <p className="text-gray-300 text-sm">{artist}</p>
        </div>
        {previewMode && (
          <div className="bg-orange-500/20 text-orange-500 text-xs px-2 py-1 rounded-full">
            30-Sec Preview
          </div>
        )}
        {requiresPurchase && (
          <div className="bg-red-500/20 text-red-500 text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Lock size={12} />
            <span>Premium</span>
          </div>
        )}
      </div>      {/* Waveform Visualization (Placeholder) */}
      {showWaveform && (
        <div className="mb-4 h-16 bg-black/50 rounded flex items-center justify-center border border-orange-500/20">
          <div className="flex items-end space-x-1 h-12">
            {Array.from({ length: 40 }).map((_, i) => {
              const barPosition = (i / 40) * 100;
              const isInPreview = previewMode ? barPosition <= previewPercentage : true;
              
              return (
                <div
                  key={i}
                  className={`w-1 transition-all duration-75 ${
                    i < (progressPercentage / 100) * 40 
                      ? 'opacity-100' 
                      : isInPreview ? 'opacity-30' : 'opacity-10'
                  } ${
                    isInPreview ? 'bg-orange-500' : 'bg-gray-500'
                  }`}
                  style={{
                    height: `${Math.random() * 100}%`,
                    minHeight: '4px'
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div 
        ref={progressRef}
        className="mb-4 h-2 bg-gray-700 rounded-full cursor-pointer relative"
        onClick={handleProgressClick}
        role="slider"
        aria-label="Audio progress"
        aria-valuemin={0}
        aria-valuemax={totalDuration}
        aria-valuenow={currentTime}
      >
        {/* Preview limit indicator */}
        {previewMode && (
          <div 
            className="absolute top-0 bottom-0 bg-gray-500/30 rounded-full"
            style={{ 
              left: `${previewPercentage}%`, 
              right: 0 
            }}
          />
        )}
        
        <div 
          className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full transition-all duration-100"
          style={{ width: `${progressPercentage}%` }}
        />
        
        {previewMode && (
          <div 
            className="absolute top-0 h-full w-px bg-red-500"
            style={{ left: `${previewPercentage}%` }}
          />
        )}
        
        <div 
          className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-orange-500 rounded-full shadow-lg transition-all duration-100"
          style={{ left: `calc(${progressPercentage}% - 8px)` }}        />
      </div>
      
      {/* Time Display */}
      <div className="flex justify-between text-xs text-gray-400 mb-4">
        <span>{formatTime(currentTime)}</span>
        <span>
          {previewMode ? (
            <span className="flex items-center">
              <span className="text-orange-400">{formatTime(Math.min(currentTime, previewDuration))}</span>
              <span className="mx-1">/</span>
              <span>{formatTime(previewDuration)}</span>
            </span>
          ) : (
            duration || formatTime(totalDuration)
          )}
        </span>
      </div>

      {/* Preview ended message */}
      {previewEnded && (
        <div className="mb-4 p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg text-center text-sm">
          <p className="text-orange-400 font-semibold">Preview ended</p>
          <p className="text-gray-300 text-xs">Purchase the full track to listen to the complete song</p>
          {onPurchaseClick && (
            <button 
              onClick={onPurchaseClick}
              className="mt-2 px-4 py-1 bg-orange-500 hover:bg-orange-600 text-black text-sm rounded-full transition-colors"
            >
              Purchase Now
            </button>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Rewind */}
          <button
            onClick={() => {
              if (audioRef.current && !requiresPurchase) {
                audioRef.current.currentTime = Math.max(0, currentTime - 10);
              }
            }}
            disabled={requiresPurchase}
            className={`text-gray-400 hover:text-orange-500 transition-colors p-2 rounded-full hover:bg-orange-500/10 ${
              requiresPurchase ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Rewind 10 seconds"
          >
            <RotateCcw size={20} />
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className={`p-3 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg ${
              requiresPurchase 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-orange-500 hover:bg-orange-600 text-black'
            }`}
            aria-label={isPlaying ? "Pause" : requiresPurchase ? "Purchase to Play" : "Play"}
          >
            {requiresPurchase ? (
              <Lock size={24} />
            ) : (
              isPlaying ? <Pause size={24} /> : <Play size={24} />
            )}
          </button>

          {/* Fast Forward */}
          <button
            onClick={() => {
              if (audioRef.current && !requiresPurchase) {
                const maxTime = previewMode ? Math.min(previewDuration, totalDuration) : totalDuration;
                audioRef.current.currentTime = Math.min(maxTime, currentTime + 10);
              }
            }}
            disabled={requiresPurchase}
            className={`text-gray-400 hover:text-orange-500 transition-colors p-2 rounded-full hover:bg-orange-500/10 ${
              requiresPurchase ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Fast forward 10 seconds"
          >
            <FastForward size={20} />
          </button>
        </div>        {/* Volume Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleMute}
            disabled={requiresPurchase}
            className={`text-gray-400 hover:text-orange-500 transition-colors ${
              requiresPurchase ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            disabled={requiresPurchase}
            className={`w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider ${
              requiresPurchase ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Volume control"
          />
        </div>
      </div>

      {/* Purchase prompt for locked content */}
      {requiresPurchase && onPurchaseClick && (
        <div className="mt-4 text-center">
          <button 
            onClick={onPurchaseClick}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black rounded-lg transition-colors text-sm font-medium"
          >
            Unlock Full Track
          </button>
          <p className="mt-2 text-xs text-gray-400">
            Purchase required to listen to the full song
          </p>
        </div>
      )}

      {/* Accessibility Features */}
      <div className="sr-only" aria-live="polite">
        {isPlaying ? `Playing ${title}` : `Paused ${title}`}
        {previewMode && ` (30-second preview)`}
        {requiresPurchase && ` (Requires purchase)`}
        {` - ${formatTime(currentTime)} of ${previewMode ? formatTime(previewDuration) : formatTime(totalDuration)}`}
      </div>
    </div>
  );
}
