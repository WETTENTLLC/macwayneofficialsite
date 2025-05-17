import React, { useState, useEffect } from 'react';
import { checkTicketAccess, LiveShow } from './LiveShowAccessManager';

interface LiveShowPlayerProps {
  show: LiveShow;
  accessCode: string;
  onInvalidAccess: () => void;
}

// Component to display live content for users with valid tickets
const LiveShowPlayer: React.FC<LiveShowPlayerProps> = ({ show, accessCode, onInvalidAccess }) => {
  const [isValidating, setIsValidating] = useState(true);
  const [isAccessValid, setIsAccessValid] = useState(false);
  const [hasStartedViewing, setHasStartedViewing] = useState(false);

  useEffect(() => {
    const validateAccess = async () => {
      try {
        const isValid = await checkTicketAccess(show.id, accessCode);
        setIsAccessValid(isValid);
        
        if (!isValid) {
          onInvalidAccess();
        }
      } catch (error) {
        console.error("Error validating ticket:", error);
        setIsAccessValid(false);
        onInvalidAccess();
      } finally {
        setIsValidating(false);
      }
    };

    validateAccess();
  }, [show.id, accessCode, onInvalidAccess]);

  // Track viewer analytics when they start watching
  const handleStartViewing = () => {
    setHasStartedViewing(true);
    
    // In a real implementation, this would log to your analytics system
    // Example: logStreamStartAnalytics(show.id, accessCode);
  };
  
  if (isValidating) {
    return (
      <div className="flex items-center justify-center p-8 bg-black/50 rounded-lg">
        <div className="animate-pulse text-yellow-lotus">
          Validating your access code...
        </div>
      </div>
    );
  }

  if (!isAccessValid) {
    return (
      <div className="p-8 bg-black/50 rounded-lg text-center">
        <div className="text-red-500 font-bold">
          Invalid access code. Please check your ticket information.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-2xl font-bold text-yellow-lotus">
        {show.title} - Exclusive Stream
      </h3>
      
      <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black">
        {!hasStartedViewing ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <button 
              onClick={handleStartViewing}
              className="px-8 py-4 bg-yellow-lotus text-black font-bold rounded-lg hover:bg-blue-lotus hover:text-white transition-colors"
            >
              Start Watching
            </button>
          </div>
        ) : show.streamUrl ? (
          // If it's a YouTube URL, embed the YouTube player
          show.streamUrl.includes('youtube.com') || show.streamUrl.includes('youtu.be') ? (
            <iframe
              src={show.streamUrl}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={show.title}
            ></iframe>
          ) : (
            // Otherwise use HTML5 video player (for direct video URLs)
            <video 
              src={show.streamUrl} 
              controls 
              className="w-full h-full"
              poster={show.previewImageUrl}
            >
              Your browser does not support the video tag.
            </video>
          )
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <p className="text-white">Stream will begin shortly...</p>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-black/50 rounded-lg">
        <p className="text-blue-200">{show.description}</p>
        <p className="mt-2 text-yellow-lotus">Show date: {show.date}</p>
      </div>
      
      {/* Chat or interaction component could be added here */}
    </div>
  );
};

export default LiveShowPlayer;
