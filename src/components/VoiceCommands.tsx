'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

// Define missing TypeScript interfaces for Web Speech API
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface VoiceCommand {
  command: string;
  action: () => void;
  description: string;
}

interface VoiceCommandsProps {
  onNavigate?: (path: string) => void;
  className?: string;
}

export default function VoiceCommands({ onNavigate, className = "" }: VoiceCommandsProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      speechSynthesis.speak(utterance);
    }
  }, []);

  const navigateAndSpeak = useCallback((path: string, message: string) => {
    onNavigate?.(path);
    speakText(message);
  }, [onNavigate, speakText]);

  // Voice commands configuration
  const commands: VoiceCommand[] = useMemo(() => [
    {
      command: 'go home',
      action: () => navigateAndSpeak('/', 'Going to homepage'),
      description: 'Navigate to homepage'
    },
    {
      command: 'open shop',
      action: () => navigateAndSpeak('/shop', 'Opening Mac Wayne store'),
      description: 'Navigate to shop'
    },
    {
      command: 'live help',
      action: () => navigateAndSpeak('/live', 'Opening live assistance portal'),
      description: 'Navigate to live assistance'
    },
    {
      command: 'documentary',
      action: () => navigateAndSpeak('/documentary', 'Opening documentary experience'),
      description: 'Navigate to documentary'
    },
    {
      command: 'loyalty program',
      action: () => navigateAndSpeak('/loyalty', 'Opening Sheriff Thizz rewards'),
      description: 'Navigate to loyalty program'
    },
    {
      command: 'help me',
      action: () => speakText('I am Mac Wayne, the Blind Visionary. You can say commands like: go home, open shop, live help, documentary, or loyalty program. You can also say stop listening to disable voice commands.'),
      description: 'Get help with voice commands'
    },
    {
      command: 'stop listening',
      action: () => {
        setIsListening(false);
        speakText('Voice commands disabled');
      },
      description: 'Disable voice commands'
    },
    {
      command: 'start listening',
      action: () => {
        setIsListening(true);
        speakText('Voice commands enabled');
      },
      description: 'Enable voice commands'
    }
  ], [navigateAndSpeak, speakText]);
  const processCommand = useCallback((spokenText: string) => {
    const normalizedText = spokenText.toLowerCase().trim();
    setLastCommand(normalizedText);

    const matchedCommand = commands.find(cmd => 
      normalizedText.includes(cmd.command.toLowerCase())
    );

    if (matchedCommand) {
      matchedCommand.action();
    } else {
      speakText(`Command not recognized: ${normalizedText}. Say "help me" for available commands.`);
    }
  }, [commands, speakText]);
  useEffect(() => {
    console.log('VoiceCommands component mounted');
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      console.log('Speech recognition is supported');
      setIsSupported(true);
      
      // Use a more specific type for the speech recognition constructor
      const SpeechRecognitionConstructor = (window as unknown as {
        webkitSpeechRecognition: new () => SpeechRecognition;
        SpeechRecognition: new () => SpeechRecognition;
      }).webkitSpeechRecognition || (window as unknown as {
        webkitSpeechRecognition: new () => SpeechRecognition;
        SpeechRecognition: new () => SpeechRecognition;
      }).SpeechRecognition;
      
      const recognitionInstance = new SpeechRecognitionConstructor();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscript(finalTranscript);
          processCommand(finalTranscript);
        }
      };

      recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          speakText('Microphone access denied. Please enable microphone permissions.');
        }
      };

      recognitionInstance.onend = () => {
        if (isListening) {
          recognitionInstance.start();
        }
      };

      setRecognition(recognitionInstance);
    }
  }, [processCommand, isListening, speakText]);

  useEffect(() => {
    if (!recognition) return;

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening, recognition]);

  const toggleListening = () => {
    if (!isSupported) {
      speakText('Voice commands are not supported in this browser');
      return;
    }

    setIsListening(!isListening);
    if (!isListening) {
      speakText('Voice commands activated. Say "help me" for commands.');
    } else {
      speakText('Voice commands deactivated.');
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isSupported) {
    return (
      <div className={`bg-black/90 border border-gray-600 rounded-lg p-4 ${className}`}>
        <div className="flex items-center space-x-3">
          <MicOff className="text-gray-500" size={20} />
          <span className="text-gray-400 text-sm">Voice commands not supported</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-black/90 border border-orange-500/30 rounded-lg p-4 ${className}`}>
      {/* Voice Control Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${isListening ? 'bg-red-600' : 'bg-gray-700'}`}>
            {isListening ? <Mic className="text-white" size={20} /> : <MicOff className="text-gray-300" size={20} />}
          </div>
          <div>
            <h3 className="text-orange-500 font-bold">Voice Commands</h3>
            <p className="text-gray-400 text-sm">
              {isListening ? 'Listening...' : 'Click to activate'}
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
              aria-label="Stop speaking"
            >
              <VolumeX size={16} />
            </button>
          )}
          <button
            onClick={toggleListening}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isListening 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-orange-500 hover:bg-orange-600 text-black'
            }`}
            aria-label={isListening ? 'Stop voice commands' : 'Start voice commands'}
          >
            {isListening ? 'Stop' : 'Start'}
          </button>
        </div>
      </div>

      {/* Status Indicators */}
      {isListening && (
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 text-sm font-medium">Recording</span>
          </div>
          {transcript && (
            <div className="bg-gray-900/50 p-3 rounded border border-gray-600">
              <p className="text-gray-300 text-sm">Heard: &quot;{transcript}&quot;</p>
            </div>
          )}
        </div>
      )}

      {/* Recent Command */}
      {lastCommand && (
        <div className="mb-4 bg-orange-500/10 border border-orange-500/30 p-3 rounded">
          <p className="text-orange-400 text-sm">Last command: &quot;{lastCommand}&quot;</p>
        </div>
      )}

      {/* Available Commands */}
      <div className="space-y-2">
        <h4 className="text-white font-medium text-sm mb-3">Available Commands:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {commands.slice(0, 6).map((cmd, index) => (
            <div key={index} className="bg-gray-900/50 p-2 rounded border border-gray-700">
              <span className="text-orange-400 font-medium">&quot;{cmd.command}&quot;</span>
              <p className="text-gray-400">{cmd.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Accessibility Info */}
      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded">
        <div className="flex items-center space-x-2 mb-1">
          <Volume2 className="text-blue-400" size={16} />
          <span className="text-blue-400 text-sm font-medium">Accessibility Feature</span>
        </div>
        <p className="text-gray-300 text-xs">
          This voice command system is designed for visually impaired users. 
          Say &quot;help me&quot; anytime for guidance.
        </p>
      </div>

      {/* Screen Reader Support */}
      <div className="sr-only" aria-live="polite">
        {isListening && "Voice commands are active"}
        {lastCommand && `Processed command: ${lastCommand}`}
        {isSpeaking && "Mac Wayne is speaking"}
      </div>
    </div>
  );
}
