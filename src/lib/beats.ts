// Beat generation utilities

export interface Beat {
  id: string;
  name: string;
  bpm: number;
  style: string;
  pattern: string;
  audioUrl?: string;
  producer?: string;
  license?: string;
}

// Configuration for beat loading
export const BEAT_CONFIG = {
  // Set to false to disable external audio URLs and use only synthesized beats
  useExternalAudio: true, // Enabled to use local audio files
  
  // CORS proxy URL (uncomment and modify if needed)
  corsProxy: undefined as string | undefined,
  // corsProxy: 'https://cors-anywhere.herokuapp.com/',
  
  // Fallback to synthesized beats on error
  fallbackToSynthesized: true,
  
  // Local beats directory (relative to public folder)
  localBeatsPath: '/beats/',
};

// Helper function to process audio URLs
export function processAudioUrl(url?: string): string | undefined {
  if (!url || !BEAT_CONFIG.useExternalAudio) return undefined;
  
  // If using CORS proxy
  if (BEAT_CONFIG.corsProxy) {
    return BEAT_CONFIG.corsProxy + url;
  }
  
  return url;
}

// If you're getting CORS errors with external audio, you have several options:
// 1. Host the audio files locally in the /public folder
// 2. Use a CORS proxy service (e.g., https://cors-anywhere.herokuapp.com/)
// 3. Set USE_EXTERNAL_AUDIO to false to use only synthesized beats
// 4. Configure your own backend to proxy the audio files
// 5. Use audio URLs from services that allow cross-origin requests

export const BEAT_STYLES = [
  'Boom Bap',
  'Trap',
  'Lo-Fi',
  'Old School',
  'Jazz Hop',
  'West Coast',
  'East Coast',
  'Drill',
  'Cloud Rap',
  'Experimental'
] as const;

export const BEAT_PATTERNS = [
  'kick-hat-snare-hat',
  'kick-kick-snare-hat',
  'kick-hat-kick-snare',
  'kick-snare-kick-kick-snare',
  'kick-hat-hat-snare',
  'kick-kick-hat-snare-hat-hat',
] as const;

// Free beat samples from various sources
// These are royalty-free beats suitable for non-commercial use
export const BEAT_SAMPLES: Beat[] = [
  // Local beats
  {
    id: 'local_freestyle_boom_bap',
    name: 'Behind Barz - Freestyle Rap Beat',
    bpm: 90, // Typical boom bap BPM, adjust if needed
    style: 'Boom Bap',
    pattern: 'kick-hat-snare-hat',
    audioUrl: '/beats/Freestyle Rap Beat Hard Boom Bap Type Beat Hip Hop Instrumental Behind Barz.mp3',
    producer: 'Behind Barz',
    license: 'Personal Use'
  },
  
  // External beats (may encounter CORS issues)
  // To fix CORS issues:
  // 1. Download these beats and host them locally in /public/beats/
  // 2. Or set BEAT_CONFIG.useExternalAudio = false to use only synthesized beats
  // 3. Or configure a CORS proxy in BEAT_CONFIG.corsProxy
  
  // Lo-Fi Beats
  {
    id: 'lofi_study_1',
    name: 'Study Session',
    bpm: 90,
    style: 'Lo-Fi',
    pattern: 'kick-hat-kick-snare',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3',
    producer: 'Pixabay',
    license: 'Royalty Free'
  },
  
  // Boom Bap Beats

  // Trap Beats
  {
    id: 'trap_hard_1',
    name: 'Dark Mode',
    bpm: 140,
    style: 'Trap',
    pattern: 'kick-kick-hat-snare-hat-hat',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/11/22/audio_febc508520.mp3',
    producer: 'Pixabay',
    license: 'Royalty Free'
  },

  // Jazz Hop
  // (Removed external beats)

  // Old School
  // (Removed external beats)

  // Experimental
  // (Removed external beats)

  // Additional beats from Free Music Archive and other sources
  // (Removed external beats)
];

// Fallback beat generation for when samples aren't available
export function generateRandomBeat(): Beat {
  // First try to get a random sample beat
  if (BEAT_SAMPLES.length > 0) {
    const randomIndex = Math.floor(Math.random() * BEAT_SAMPLES.length);
    const beat = { ...BEAT_SAMPLES[randomIndex] };
    // Process the audio URL through our helper
    if (beat.audioUrl) {
      beat.audioUrl = processAudioUrl(beat.audioUrl);
    }
    return beat;
  }
  
  // Fallback to generated beat
  const styles = BEAT_STYLES;
  const patterns = BEAT_PATTERNS;
  
  const randomStyle = styles[Math.floor(Math.random() * styles.length)];
  const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
  const randomBpm = Math.floor(Math.random() * (120 - 80 + 1)) + 80; // 80-120 BPM
  
  const beatId = `beat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    id: beatId,
    name: `${randomStyle} Beat ${randomBpm}BPM`,
    bpm: randomBpm,
    style: randomStyle,
    pattern: randomPattern,
    producer: 'Synthesized',
    license: 'Open Source'
  };
}

export function getBeatEmoji(style: string): string {
  const emojiMap: Record<string, string> = {
    'Boom Bap': '🥁',
    'Trap': '🔥',
    'Lo-Fi': '🌙',
    'Old School': '📻',
    'Jazz Hop': '🎺',
    'West Coast': '🌴',
    'East Coast': '🗽',
    'Drill': '💀',
    'Cloud Rap': '☁️',
    'Experimental': '🔬'
  };
  
  return emojiMap[style] || '🎵';
}

// Get beats by style
export function getBeatsByStyle(style: string): Beat[] {
  return BEAT_SAMPLES.filter(beat => beat.style === style);
}

// Get a random beat of a specific style
export function getRandomBeatByStyle(style: string): Beat | null {
  const styleBeats = getBeatsByStyle(style);
  if (styleBeats.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * styleBeats.length);
  return styleBeats[randomIndex];
}