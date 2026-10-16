import { SuggestedTrack, Track, SuggestionMood } from '../types';

export const CURATED_SUGGESTIONS: SuggestedTrack[] = [
  {
    id: 'sug-1',
    title: 'Neon Nights & Starlight Drive',
    artist: 'Timecop1983 & FM-84',
    album: 'Lovers & Horizons',
    duration: 232,
    source: 'youtube',
    youtubeId: '4xDzrJKXOOY',
    coverGradient: 'from-fuchsia-500 via-indigo-600 to-cyan-500',
    genre: 'Synthwave / Retro',
    lyrics: [
      'Starlight reflects on the dark dashboard',
      'Driving into the purple twilight haze',
      'Memories replay like an old cassette',
      'Lost in the neon highway maze'
    ],
    addedAt: Date.now() - 120000,
    reason: 'Similar to Midnight City Chill',
    matchScore: 97,
    mood: 'drive',
  },
  {
    id: 'sug-2',
    title: 'Warm Matcha & Rain on Glass',
    artist: 'ChilledCow Society',
    album: 'Tokyo Tea Room Sessions',
    duration: 178,
    source: 'youtube',
    youtubeId: '5qap5aO4i9A',
    coverGradient: 'from-amber-400 via-emerald-600 to-teal-900',
    genre: 'Lofi / Ambient Jazz',
    lyrics: [
      'Steam rising slow from the ceramic cup',
      'Raindrops sliding down cold window glass',
      'Lo-fi piano chords gently ringing out',
      'Watching the quiet shadows pass'
    ],
    addedAt: Date.now() - 240000,
    reason: 'Top Chill Pick on YouTube Music',
    matchScore: 94,
    mood: 'chill',
  },
  {
    id: 'sug-3',
    title: 'Hyperdrive Cyber Core',
    artist: 'Glitch Protocol',
    album: 'Sub-Zero Binary',
    duration: 215,
    source: 'youtube',
    youtubeId: 'WPni755-Krg',
    coverGradient: 'from-cyan-400 via-purple-600 to-pink-600',
    genre: 'Electronic / Bass',
    lyrics: [
      'Binary surge through the optic cable',
      'Frequency rising to 140 BPM',
      'Liquid electrons across the grid',
      'Pulse to the digital sound gem'
    ],
    addedAt: Date.now() - 360000,
    reason: 'High Energy Workout Mix',
    matchScore: 91,
    mood: 'energy',
  },
  {
    id: 'sug-4',
    title: 'Deep Spatial Resonance (432Hz)',
    artist: 'Alpha Wave Lab',
    album: 'Cognitive Harmony',
    duration: 290,
    source: 'local',
    format: 'FLAC (Lossless)',
    fileSize: '42.8 MB',
    coverGradient: 'from-sky-400 via-blue-700 to-slate-950',
    genre: 'Binaural / Focus',
    lyrics: [
      'Calibrated for deep alpha frequency focus',
      'Harmonic resonance balance at 432Hz',
      'Absolute lossless clarity'
    ],
    addedAt: Date.now() - 480000,
    reason: 'Recommended for Deep Focus',
    matchScore: 96,
    mood: 'focus',
  },
  {
    id: 'sug-5',
    title: 'Fireside Pine & Cedar Strings',
    artist: 'Oakhaven Ensemble',
    album: 'Autumn Smoke EP',
    duration: 195,
    source: 'youtube',
    youtubeId: 'DWcJFNfaw9c',
    coverGradient: 'from-amber-500 via-orange-600 to-stone-900',
    genre: 'Acoustic / Warmth',
    lyrics: [
      'Crackle of firewood in the hearth',
      'Gentle fingerpicking on cedar wood',
      'A warm breeze stirring through the pines',
      'Rest here as long as you should'
    ],
    addedAt: Date.now() - 600000,
    reason: 'Acoustic Harmony Discovery',
    matchScore: 89,
    mood: 'acoustic',
  },
  {
    id: 'sug-6',
    title: 'Liquid Shinkansen Speedline',
    artist: 'Kenji Takahashi & Waveform',
    album: 'Tokyo Express 300km/h',
    duration: 220,
    source: 'local',
    format: 'WAV (24-bit/96kHz)',
    fileSize: '49.4 MB',
    coverGradient: 'from-teal-400 via-cyan-600 to-blue-900',
    genre: 'City Pop / High-Res',
    lyrics: [
      'Gliding silent along elevated tracks',
      'City skyline lights blinking by',
      'Purity of rhythm in motion',
      'Under the violet evening sky'
    ],
    addedAt: Date.now() - 720000,
    reason: 'Lossless Local Gem',
    matchScore: 93,
    mood: 'drive',
  }
];

export function getSuggestionsForCurrentTrack(currentTrack: Track | null): SuggestedTrack[] {
  if (!currentTrack) return CURATED_SUGGESTIONS;

  const genre = currentTrack.genre?.toLowerCase() || '';

  return CURATED_SUGGESTIONS.map((sug) => {
    let match = sug.matchScore;
    let customReason = sug.reason;

    if (genre.includes('synth') || genre.includes('cyber') || genre.includes('electronic')) {
      if (sug.mood === 'drive' || sug.mood === 'energy') {
        match = Math.min(99, match + 5);
        customReason = `Perfect sonic match for ${currentTrack.artist}`;
      }
    } else if (genre.includes('lofi') || genre.includes('chill') || genre.includes('ambient')) {
      if (sug.mood === 'chill' || sug.mood === 'focus') {
        match = Math.min(99, match + 5);
        customReason = `Chillout vibes matching ${currentTrack.title}`;
      }
    } else if (genre.includes('acoustic') || genre.includes('folk')) {
      if (sug.mood === 'acoustic') {
        match = 98;
        customReason = `Natural resonance companion to ${currentTrack.title}`;
      }
    }

    return {
      ...sug,
      matchScore: match,
      reason: customReason,
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}
