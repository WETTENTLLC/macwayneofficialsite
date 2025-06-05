/**
 * Audio Track Management System for Mac Wayne Official Website
 * Centralized audio file definitions and metadata
 */

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: string;
  src: string;
  description?: string;
  genre?: string;
  releaseDate?: string;
  isPreview?: boolean;
  isFeatured?: boolean;
  transcription?: string; // For accessibility
  tags?: string[];
}

export const audioTracks: AudioTrack[] = [
  {
    id: 'prison-gates-opening',
    title: 'Prison Gates Opening',
    artist: 'Mac Wayne',
    album: 'Sound Effects',
    duration: '0:08',
    src: '/audio/prison-gates-opening.mp3',
    description: 'Dramatic sound effect of prison gates opening - the sound of freedom',
    genre: 'Sound Effect',
    isPreview: false,
    isFeatured: false,
    transcription: 'Heavy metal clanking, creaking hinges, echoing footsteps',
    tags: ['intro', 'sound-effect', 'dramatic']
  },
  {
    id: 'main-preview',
    title: 'Blind & Battered',
    artist: 'Mac Wayne',
    album: 'Blind & Battered',
    duration: '3:42',
    src: '/audio/blind-battered-preview.mp3',
    description: 'The title track that started it all - raw, honest storytelling from behind bars',
    genre: 'Hip-Hop/Rap',
    releaseDate: '2024',
    isPreview: true,
    isFeatured: true,
    transcription: 'Lyrics available in Braille format upon request',
    tags: ['featured', 'title-track', 'preview']
  },
  {
    id: 'cell-block-beats',
    title: 'Cell Block Beats - Intro',
    artist: 'Mac Wayne',
    album: 'Production Tutorials',
    duration: '2:30',
    src: '/audio/cell-block-beats-intro.mp3',
    description: 'Introduction to making beats with limited resources',
    genre: 'Instrumental/Tutorial',
    isPreview: true,
    transcription: 'Step-by-step instructions for creating beats in confined spaces',
    tags: ['tutorial', 'production', 'instrumental']
  },
  {
    id: 'street-stories',
    title: 'Street Stories',
    artist: 'Mac Wayne',
    duration: '4:12',
    src: '/audio/street-stories-preview.mp3',
    description: 'Latest track about life on the streets',
    genre: 'Hip-Hop/Rap',
    isPreview: true,
    tags: ['new-release', 'street-life', 'storytelling']
  },
  {
    id: 'behind-bars-beats',
    title: 'Behind Bars Beats Vol. 1',
    artist: 'Mac Wayne',
    album: 'Behind Bars Beats',
    duration: '2:55',
    src: '/audio/behind-bars-beats-preview.mp3',
    description: 'Instrumental beats created in prison',
    genre: 'Instrumental/Beats',
    isPreview: true,
    tags: ['instrumental', 'beats', 'prison-made']
  },
  {
    id: 'documentary-narration',
    title: 'The Beginning - Prison Days',
    artist: 'Mac Wayne',
    duration: '8:45',
    src: '/audio/documentary-narration.mp3',
    description: 'Mac Wayne narrates his early days in prison and how music became his escape',
    genre: 'Documentary Narration',
    isPreview: true,
    transcription: 'Full transcript: "When I first walked into that cell, I never imagined music would become my lifeline..."',
    tags: ['documentary', 'narration', 'prison-life', 'accessibility']
  },
  {
    id: 'going-blind-story',
    title: 'Losing My Sight, Finding My Vision',
    artist: 'Mac Wayne',
    duration: '12:30',
    src: '/audio/going-blind-story.mp3',
    description: 'The emotional journey of losing sight while incarcerated and finding new purpose',
    genre: 'Documentary Narration',
    isPreview: true,
    transcription: 'Full transcript available describing the medical condition and emotional impact',
    tags: ['documentary', 'narration', 'blindness', 'inspiration', 'accessibility']
  },
  {
    id: 'music-in-prison',
    title: 'Making Music Behind Bars',
    artist: 'Mac Wayne',
    duration: '6:15',
    src: '/audio/music-in-prison.mp3',
    description: 'How Mac created music with limited resources and improvised equipment',
    genre: 'Documentary Narration',
    isPreview: true,
    transcription: 'Detailed description of music production techniques used in prison',
    tags: ['documentary', 'narration', 'music-production', 'creativity', 'accessibility']
  }
];

/**
 * Get audio track by ID
 */
export function getAudioTrack(id: string): AudioTrack | undefined {
  return audioTracks.find(track => track.id === id);
}

/**
 * Get featured tracks
 */
export function getFeaturedTracks(): AudioTrack[] {
  return audioTracks.filter(track => track.isFeatured);
}

/**
 * Get tracks by tags
 */
export function getTracksByTag(tag: string): AudioTrack[] {
  return audioTracks.filter(track => track.tags?.includes(tag));
}

/**
 * Get all preview tracks
 */
export function getPreviewTracks(): AudioTrack[] {
  return audioTracks.filter(track => track.isPreview);
}

/**
 * Audio file validation and fallback handling
 */
export function getValidAudioSrc(src: string): string {
  // In production, this would check if the file exists and return src if valid
  // For now, we assume files exist since we created them, but keep fallback logic
  if (src && src !== '/audio/sample-track.mp3') {
    console.debug(`Using specific audio file: ${src}`);
    return src;
  }
  console.debug(`Audio request for: ${src}, falling back to sample`);
  return '/audio/sample-track.mp3';
}

/**
 * Get audio metadata for accessibility
 */
export function getAudioMetadata(track: AudioTrack) {
  return {
    title: track.title,
    artist: track.artist,
    duration: track.duration,
    description: track.description || '',
    transcription: track.transcription || 'Transcription available upon request',
    genre: track.genre || 'Music',
    album: track.album || ''
  };
}

/**
 * Get documentary-specific tracks
 */
export function getDocumentaryTracks(): AudioTrack[] {
  return getTracksByTag('documentary');
}

/**
 * Get tracks for a specific genre
 */
export function getTracksByGenre(genre: string): AudioTrack[] {
  return audioTracks.filter(track => track.genre?.toLowerCase().includes(genre.toLowerCase()));
}

/**
 * Get sound effect tracks
 */
export function getSoundEffects(): AudioTrack[] {
  return getTracksByGenre('Sound Effect');
}

/**
 * Get prison gates opening sound effect
 */
export function getPrisonGatesSound(): AudioTrack | null {
  return getAudioTrack('prison-gates-opening') || null;
}
