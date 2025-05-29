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
  {
    id: 'boombap_classic_1',
    name: 'Golden Era',
    bpm: 95,
    style: 'Boom Bap',
    pattern: 'kick-hat-snare-hat',
    audioUrl: 'https://cdn.pixabay.com/audio/2024/02/09/audio_4d36003605.mp3',
    producer: 'Pixabay',
    license: 'Royalty Free'
  },
  {
    id: 'boombap_street_1',
    name: 'Street Chronicles',
    bpm: 92,
    style: 'Boom Bap',
    pattern: 'kick-kick-snare-hat',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/10/25/audio_3266b47e86.mp3',
    producer: 'Pixabay',
    license: 'Royalty Free'
  },

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
  {
    id: 'trap_melodic_1',
    name: 'Night Drive',
    bpm: 145,
    style: 'Trap',
    pattern: 'kick-hat-hat-snare',
    audioUrl: 'https://cdn.pixabay.com/audio/2023/09/06/audio_c8c8a73467.mp3',
    producer: 'Pixabay',
    license: 'Royalty Free'
  },

  // Jazz Hop
  {
    id: 'jazzhop_smooth_1',
    name: 'Blue Note',
    bpm: 88,
    style: 'Jazz Hop',
    pattern: 'kick-hat-snare-hat',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/02/15/audio_6960b6b7d3.mp3',
    producer: 'Pixabay',
    license: 'Royalty Free'
  },

  // Old School
  {
    id: 'oldschool_funk_1',
    name: 'Block Party',
    bpm: 98,
    style: 'Old School',
    pattern: 'kick-snare-kick-kick-snare',
    audioUrl: 'https://cdn.pixabay.com/audio/2024/01/19/audio_8583de5b2f.mp3',
    producer: 'Pixabay',
    license: 'Royalty Free'
  },

  // Experimental
  {
    id: 'experimental_glitch_1',
    name: 'Digital Dreams',
    bpm: 110,
    style: 'Experimental',
    pattern: 'kick-hat-kick-snare',
    audioUrl: 'https://cdn.pixabay.com/audio/2023/10/30/audio_f1e7479233.mp3',
    producer: 'Pixabay',
    license: 'Royalty Free'
  },

  // Additional beats from Free Music Archive and other sources
  {
    id: 'westcoast_smooth_1',
    name: 'Sunset Boulevard',
    bpm: 93,
    style: 'West Coast',
    pattern: 'kick-hat-snare-hat',
    audioUrl: 'https://cdn.pixabay.com/audio/2023/07/04/audio_0d1a1582f8.mp3',
    producer: 'Pixabay',
    license: 'Royalty Free'
  },
  {
    id: 'drill_dark_1',
    name: 'Midnight Drill',
    bpm: 142,
    style: 'Drill',
    pattern: 'kick-kick-hat-snare-hat-hat',
    audioUrl: 'https://cdn.pixabay.com/audio/2024/03/14/audio_c128e2bb16.mp3',
    producer: 'Pixabay',
    license: 'Royalty Free'
  },
  {
    id: 'cloudrap_ethereal_1',
    name: 'Floating',
    bpm: 130,
    style: 'Cloud Rap',
    pattern: 'kick-hat-kick-snare',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/08/25/audio_e7ad2d6e6b.mp3',
    producer: 'Pixabay',
    license: 'Royalty Free'
  }
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