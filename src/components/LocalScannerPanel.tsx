import React, { useRef, useState } from 'react';
import { 
  FolderSearch, 
  FileAudio, 
  HardDrive, 
  Upload, 
  Play, 
  Cpu, 
  Trash2, 
  Sparkles,
  Smartphone,
  Music2
} from 'lucide-react';
import { Track } from '../types';
import { DynamicGlassButton } from './DynamicGlassButton';

interface Props {
  tracks: Track[];
  onAddTracks: (newTracks: Track[]) => void;
  onRemoveTrack: (trackId: string) => void;
  onPlayTrack: (track: Track) => void;
  currentTrackId?: string;
  isPlaying: boolean;
}

export const LocalScannerPanel: React.FC<Props> = ({
  tracks,
  onAddTracks,
  onRemoveTrack,
  onPlayTrack,
  currentTrackId,
  isPlaying,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scannedFilesCount, setScannedFilesCount] = useState(0);
  const [lastScannedPath, setLastScannedPath] = useState<string>('Internal Storage / Music');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const localTracks = tracks.filter((t) => t.source === 'local');

  const gradients = [
    'from-rose-600 to-red-700',
    'from-pink-600 to-purple-800',
    'from-indigo-600 to-blue-800',
    'from-amber-600 to-rose-700',
    'from-teal-500 to-emerald-800',
    'from-fuchsia-600 to-rose-800',
  ];

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsScanning(true);
    setScanProgress(10);
    setScannedFilesCount(files.length);

    const newTracks: Track[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setScanProgress(Math.round(((i + 1) / files.length) * 100));

      const ext = file.name.split('.').pop()?.toUpperCase() || 'AUDIO';
      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      const parts = cleanName.split('-');
      const artist = parts.length > 1 ? parts[0].trim() : 'Local Artist';
      const title = parts.length > 1 ? parts.slice(1).join('-').trim() : cleanName;

      const audioUrl = URL.createObjectURL(file);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

      newTracks.push({
        id: `local-${Date.now()}-${i}`,
        title: title || file.name,
        artist: artist || 'Local Audio',
        album: file.webkitRelativePath ? file.webkitRelativePath.split('/')[0] : 'Device Storage',
        duration: 180,
        source: 'local',
        coverGradient: gradients[i % gradients.length],
        audioUrl: audioUrl,
        format: `${ext} Audio`,
        fileSize: sizeMb,
        genre: 'Device Audio',
        lyrics: ['Direct hardware audio file from device storage.'],
        addedAt: Date.now(),
      });
    }

    setTimeout(() => {
      onAddTracks(newTracks);
      setIsScanning(false);
      setScanProgress(100);
      setLastScannedPath(files[0].webkitRelativePath ? files[0].webkitRelativePath.split('/')[0] : 'Device Files');
    }, 800);
  };

  const handleSimulatedScan = () => {
    setIsScanning(true);
    setScanProgress(20);
    setTimeout(() => setScanProgress(55), 400);
    setTimeout(() => setScanProgress(85), 800);
    setTimeout(() => {
      const sampleTrack: Track = {
        id: `local-demo-${Date.now()}`,
        title: 'Analog Dreamscapes (Lossless 24-bit)',
        artist: 'Hi-Fi Audio Master',
        album: 'Storage / FLAC Master Collection',
        duration: 205,
        source: 'local',
        format: 'FLAC (Lossless)',
        fileSize: '41.6 MB',
        genre: 'Audiophile Master',
        coverGradient: 'from-[#ff0033] via-rose-600 to-indigo-950',
        lyrics: [
          'Mastered in 24-bit 96kHz acoustic balance',
          'Zero compression, absolute clarity',
          'YouTube Music Device Files playback'
        ],
        addedAt: Date.now(),
      };
      onAddTracks([sampleTrack]);
      setIsScanning(false);
      setScanProgress(100);
      setLastScannedPath('/sdcard/Music/Hi-Res FLAC/');
    }, 1100);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="audio/*"
        onChange={handleFilesSelected}
        className="hidden"
      />
      <input
        ref={folderInputRef}
        type="file"
        // @ts-ignore
        webkitdirectory="true"
        directory="true"
        multiple
        onChange={handleFilesSelected}
        className="hidden"
      />

      {/* Hero Scanner Hub (YouTube Music Device Files Style) */}
      <div className="rounded-3xl p-6 sm:p-8 bg-[#181818]/90 border border-white/[0.08] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ff0000]/12 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#cc0000] to-[#ff0033] flex items-center justify-center text-white shadow-lg shadow-[#ff0000]/30 shrink-0">
              <FolderSearch size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Device Files &amp; Local Storage Scanner
                </h2>
                <span className="text-[11px] text-[#ff0033] font-bold bg-[#ff0000]/15 border border-[#ff0000]/25 px-2.5 py-0.5 rounded-full uppercase font-mono">
                  Offline Library
                </span>
              </div>
              <p className="text-sm text-zinc-400 mt-1 max-w-xl">
                Scan your Android internal storage, SD cards, and downloads into your YouTube Music library.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <DynamicGlassButton
              variant="primary"
              size="md"
              onClick={() => folderInputRef.current?.click()}
              disabled={isScanning}
              icon={<HardDrive size={16} />}
            >
              Scan Directory
            </DynamicGlassButton>

            <DynamicGlassButton
              variant="glass"
              size="md"
              onClick={() => fileInputRef.current?.click()}
              disabled={isScanning}
              icon={<Upload size={16} className="text-zinc-300" />}
            >
              Pick Files
            </DynamicGlassButton>
          </div>
        </div>

        {/* Scan progress */}
        {isScanning && (
          <div className="mt-6 pt-6 border-t border-white/[0.08] space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-xs text-zinc-300">
              <span className="flex items-center gap-2 font-medium">
                <Cpu size={14} className="text-[#ff0033] animate-spin" />
                Indexing audio tracks ({scannedFilesCount || 1} files)...
              </span>
              <span className="font-mono tabular-nums text-[#ff0033]">{scanProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#ff0000] rounded-full transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/[0.08]">
          <div>
            <span className="text-xs text-zinc-400 uppercase tracking-wider block font-semibold">Indexed</span>
            <span className="text-sm font-semibold text-white font-mono tabular-nums mt-0.5 block">
              {localTracks.length} Songs
            </span>
          </div>
          <div>
            <span className="text-xs text-zinc-400 uppercase tracking-wider block font-semibold">Audio Formats</span>
            <span className="text-sm font-semibold text-emerald-400 mt-0.5 block">
              FLAC / MP3 / WAV / AAC
            </span>
          </div>
          <div>
            <span className="text-xs text-zinc-400 uppercase tracking-wider block font-semibold">Target Path</span>
            <span className="text-sm font-semibold text-zinc-300 truncate max-w-[150px] mt-0.5 block" title={lastScannedPath}>
              {lastScannedPath}
            </span>
          </div>
          <div>
            <span className="text-xs text-zinc-400 uppercase tracking-wider block font-semibold">Simulation</span>
            <DynamicGlassButton
              variant="chip"
              size="xs"
              onClick={handleSimulatedScan}
              icon={<Sparkles size={12} className="text-[#ff0033]" />}
              className="mt-1"
            >
              Simulate SD Scan
            </DynamicGlassButton>
          </div>
        </div>
      </div>

      {/* Local Track List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileAudio size={18} className="text-[#ff0033]" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Device Files ({localTracks.length})
            </h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            Direct Hardware Playback
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {localTracks.map((track) => {
            const isCurrent = currentTrackId === track.id;
            return (
              <div
                key={track.id}
                onClick={() => onPlayTrack(track)}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-[#2b2b2b] border-[#ff0033]/60 shadow-md'
                    : 'bg-[#181818]/60 hover:bg-[#252525] border-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div 
                    className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${track.coverGradient} shrink-0 flex items-center justify-center relative shadow-md shadow-black/50`}
                  >
                    {isCurrent && isPlaying ? (
                      <div className="w-3 h-3 rounded-full bg-white animate-ping" />
                    ) : (
                      <Play size={18} fill="white" className="text-white ml-0.5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className={`text-sm font-bold truncate ${isCurrent ? 'text-[#ff0033]' : 'text-white'}`}>
                      {track.title}
                    </h4>
                    <p className="text-xs text-zinc-400 truncate mt-0.5">
                      {track.artist}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-1">
                      <span className="font-mono text-zinc-300 font-medium">{track.format}</span>
                      <span>·</span>
                      <span className="font-mono">{track.fileSize || 'Local file'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-mono text-zinc-400 tabular-nums">
                    {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                  </span>
                  <DynamicGlassButton
                    variant="icon-only"
                    size="xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveTrack(track.id);
                    }}
                    title="Remove from device index"
                    icon={<Trash2 size={13} className="text-rose-400" />}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
