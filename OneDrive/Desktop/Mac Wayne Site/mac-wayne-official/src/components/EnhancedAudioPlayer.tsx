'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface EnhancedAudioPlayerProps {
  src: string;
  title: string;
  artist?: string;
  duration?: string;
  className?: string;
  showWaveform?: boolean;
}

export default function EnhancedAudioPlayer({ 
  src, 
  title, 
  artist = "Mac Wayne", 
  duration,
  className = "",
  showWaveform = false 
}: EnhancedAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This will only run on the client, after hydration
    setIsClient(true);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setTotalDuration(audio.duration);
    const handleEnd = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnd);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(err => console.error("Error playing audio:", err));
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    if (!audio || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * totalDuration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const volumeBar = volumeRef.current;
    if (!audio || !volumeBar) return;

    const rect = volumeBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newVolume = Math.max(0, Math.min(1, clickPosition));
    
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`enhanced-player ${className}`}>
      <audio 
        ref={audioRef} 
        src={src} 
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      <div className="player-content p-3">
        <div className="flex items-center gap-3">
          <button 
            className="play-pause-btn"
            onClick={togglePlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          
          <div className="track-info flex-1">
            <div className="track-title">{title}</div>
            <div className="track-artist">{artist}</div>
          </div>
          
          <div className="time-display whitespace-nowrap">
            {formatTime(currentTime)} / {duration || formatTime(totalDuration)}
          </div>
          
          <div className="volume-control hidden sm:flex">
            <button 
              onClick={toggleMute}
              className="text-gray-300 hover:text-white"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            
            <div 
              className="volume-slider"
              onClick={handleVolumeChange}
              ref={volumeRef}
            >
              <div 
                className="volume-level" 
                style={{ width: `${isMuted ? 0 : volume * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div 
          className="progress-container mt-3"
          onClick={handleProgressClick}
          ref={progressRef}
        >
          <div 
            className="progress-bar" 
            style={{ width: `${(currentTime / totalDuration) * 100 || 0}%` }}
          ></div>
        </div>          {showWaveform && (
          <div className="waveform-container">
            {Array.from({ length: 30 }).map((_, i) => {
              // Use a predictable pattern based on index instead of random values
              const barHeight = 30 + ((i % 5) * 15);
              return (
                <div
                  key={i}
                  className={`waveform-bar ${isPlaying ? 'active' : 'inactive'}`}
                  style={{ 
                    ...(isClient ? { animationDelay: `${i * 0.05}s` } : {}),
                    height: `${barHeight}%`,
                    ...(isClient ? { animationPlayState: isPlaying ? 'running' : 'paused' } : {})
                  }}
                ></div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
