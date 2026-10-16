import { Track } from '../types';

export const INITIAL_YOUTUBE_TRACKS: Track[] = [
  {
    id: 'yt-1',
    title: 'Midnight City Chill (Synthwave Odyssey)',
    artist: 'Lofi Girl & Synth Records',
    album: 'Neon Horizon Sessions',
    duration: 214,
    source: 'youtube',
    youtubeId: 'jfKfPfyJRdk', // Classic Lofi beats stream
    coverGradient: 'from-cyan-500 via-indigo-600 to-violet-800',
    genre: 'Synthwave / Lofi',
    lyrics: [
      'Glow in the city neon lights',
      'Drifting across the empty highways',
      'Glass reflections catching starry heights',
      'In the frequency of midnight sound',
      'Listen to the pulse of the horizon',
      'Soundwaves weaving through the calm rain',
      'Floating high above the quiet ground'
    ],
    addedAt: Date.now() - 3600000,
  },
  {
    id: 'yt-2',
    title: 'Golden Hour Reflections',
    artist: 'Aura Soundscapes & K-Chill',
    album: 'Sunlight & Cassettes',
    duration: 185,
    source: 'youtube',
    youtubeId: '5qap5aO4i9A', // Lofi hip hop radio
    coverGradient: 'from-amber-400 via-rose-500 to-purple-700',
    genre: 'Chillhop / Acoustic',
    lyrics: [
      'Warm sunlight through amber glass',
      'Minutes ticking slowly by',
      'Shadows dancing on the polished floor',
      'Harmonies suspended in the sky',
      'Melt into the soothing groove',
      'No rush, no friction, just the flow'
    ],
    addedAt: Date.now() - 7200000,
  },
  {
    id: 'yt-3',
    title: 'Cyberpunk Fluid Motion',
    artist: 'Vector Pulse',
    album: 'Liquid Chrome Vol. 2',
    duration: 242,
    source: 'youtube',
    youtubeId: '4xDzrJKXOOY', // Synthwave electro stream
    coverGradient: 'from-fuchsia-600 via-purple-700 to-cyan-500',
    genre: 'Electronic / Cyber',
    lyrics: [
      'Chrome droplets on the lens',
      'Binary echoes in the dark',
      'Liquid energy surging through the core',
      'Feel the electric spark',
      'Accelerate into the digital stream',
      'Beyond the glass boundary'
    ],
    addedAt: Date.now() - 10800000,
  },
  {
    id: 'yt-4',
    title: 'Acoustic Rain & Coffee',
    artist: 'Sylvan Woods',
    album: 'Quiet Cabin Tape',
    duration: 198,
    source: 'youtube',
    youtubeId: 'DWcJFNfaw9c', // Ambient acoustic
    coverGradient: 'from-emerald-500 via-teal-700 to-slate-900',
    genre: 'Indie Folk / Ambient',
    lyrics: [
      'Raindrops tapping on the windowsill',
      'Steam rising from the mug in hand',
      'Fingerpicked nylon strings gently ring',
      'A timeless peace across the land',
      'Rest your mind in natural tone'
    ],
    addedAt: Date.now() - 14400000,
  },
  {
    id: 'yt-5',
    title: 'Deep Focus Ambient Atmosphere',
    artist: 'Astral Flow',
    album: 'Spatial Resonance',
    duration: 310,
    source: 'youtube',
    youtubeId: 'WPni755-Krg', // Ambient concentration
    coverGradient: 'from-sky-400 via-blue-600 to-indigo-950',
    genre: 'Ambient / Focus',
    lyrics: [
      '[Instrumental atmospheric immersion]',
      'Deep resonance waves',
      'Expanding mental clarity',
      'Spatial sonic landscapes'
    ],
    addedAt: Date.now() - 18000000,
  }
];

export const INITIAL_LOCAL_TRACKS: Track[] = [
  {
    id: 'local-1',
    title: 'Liquid Glass Anthem (Original Mix)',
    artist: 'AuraSound Studio',
    album: 'Internal Storage / Music',
    duration: 160,
    source: 'local',
    format: 'FLAC (Lossless)',
    fileSize: '34.2 MB',
    genre: 'Progressive Electronic',
    coverGradient: 'from-teal-400 via-cyan-500 to-blue-600',
    lyrics: [
      'Reflections bending through the frost',
      'Pure liquid clarity in motion',
      'Every frequency precision aligned',
      'Deep in the lossless ocean',
      'Feel the glass resonate'
    ],
    addedAt: Date.now() - 86400000,
  },
  {
    id: 'local-2',
    title: 'Midnight Drive in Tokyo',
    artist: 'Kenji Takahashi',
    album: 'Download / Shuto Expressway',
    duration: 192,
    source: 'local',
    format: 'MP3 (320kbps)',
    fileSize: '8.4 MB',
    genre: 'City Pop / Lo-Fi',
    coverGradient: 'from-rose-500 via-violet-600 to-slate-900',
    lyrics: [
      'Tokyo tower flashing red and gold',
      'Cruising down the bay route',
      'Basslines humming through the doors',
      'A quiet story untold'
    ],
    addedAt: Date.now() - 172800000,
  },
  {
    id: 'local-3',
    title: 'Deep Subwoofer Bass Test (24-bit Master)',
    artist: 'Acoustic Lab Labs',
    album: 'SD Card / Audio Tests',
    duration: 135,
    source: 'local',
    format: 'WAV (96kHz / 24-bit)',
    fileSize: '48.1 MB',
    genre: 'Audiophile Master',
    coverGradient: 'from-amber-500 via-orange-600 to-stone-900',
    lyrics: [
      'Testing low sub-bass 30Hz - 60Hz',
      'Purity of signal path confirmed',
      'Full dynamic range active'
    ],
    addedAt: Date.now() - 259200000,
  }
];
