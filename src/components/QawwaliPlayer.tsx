import React, { useState, useRef, useEffect } from "react";
import { Playlist, Track } from "../lib/playlists";
import { YouTubePlayer } from "./YouTubePlayer";
import { PlayerControls, formatTime } from "./PlayerControls";
import { PlaylistSwitcher } from "./PlaylistSwitcher";
import { ListMusic, Maximize2, Sparkles } from "lucide-react";

interface QawwaliPlayerProps {
  playlists: Playlist[];
  activePlaylist: Playlist;
  currentTrackIndex: number;
  isPlaying: boolean;
  onSelectPlaylist: (playlistId: string) => void;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSelectTrack: (index: number) => void;
  onStateChange: (state: number) => void;
  onEnded: () => void;
  onErrorSkip: () => void;
}

export const QawwaliPlayer: React.FC<QawwaliPlayerProps> = ({
  playlists,
  activePlaylist,
  currentTrackIndex,
  isPlaying,
  onSelectPlaylist,
  onPlayPause,
  onPrevious,
  onNext,
  onSelectTrack,
  onStateChange,
  onEnded,
  onErrorSkip,
}) => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [userSeekTo, setUserSeekTo] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showQueue, setShowQueue] = useState<boolean>(false);
  const [isExpandedVideo, setIsExpandedVideo] = useState<boolean>(false);
  const topRailRef = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<any>(null);

  const currentTrack: Track =
    activePlaylist.tracks[currentTrackIndex] || activePlaylist.tracks[0];

  // Reset time and duration when active track changes
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
  }, [currentTrack.id]);

  // Periodic 1-second interval calling player.getCurrentTime() on the YouTube IFrame instance
  useEffect(() => {
    if (!isPlaying) return;

    const intervalId = setInterval(() => {
      if (
        ytPlayerRef.current &&
        typeof ytPlayerRef.current.getCurrentTime === "function"
      ) {
        try {
          const curr = ytPlayerRef.current.getCurrentTime();
          const dur =
            typeof ytPlayerRef.current.getDuration === "function"
              ? ytPlayerRef.current.getDuration()
              : 0;

          if (typeof curr === "number" && !isNaN(curr)) {
            setCurrentTime(curr);
          }
          if (typeof dur === "number" && !isNaN(dur) && dur > 0) {
            setDuration(dur);
          }
        } catch (err) {
          // Ignore iframe errors
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isPlaying, currentTrack.id]);

  const handleProgressUpdate = (curr: number, dur: number) => {
    setCurrentTime(curr);
    if (dur && dur > 0) {
      setDuration(dur);
    }
  };

  const handleSeek = (seconds: number) => {
    setCurrentTime(seconds);
    setUserSeekTo(seconds);
  };

  const handleTopRailSeek = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!topRailRef.current || duration <= 0) return;
    const rect = topRailRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = x / rect.width;
    handleSeek(percent * duration);
  };

  const progressPercent = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  return (
    <>
      {/* Floating Bottom Ultra-Compact Strip Player (saloon.wtf style) */}
      <div className="fixed bottom-3 sm:bottom-5 inset-x-2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 w-[calc(100%-1rem)] sm:w-[700px] max-w-[96vw] z-30 flex flex-col items-center gap-1.5 transition-all">
        
        {/* Sleek Micro Playlist Switcher Pills */}
        <PlaylistSwitcher
          playlists={playlists}
          activePlaylistId={activePlaylist.id}
          onSelectPlaylist={onSelectPlaylist}
        />

        {/* Collapsible Track Queue Drawer */}
        {showQueue && (
          <div className="w-full p-2.5 rounded-2xl bg-[#35151C]/95 border border-[#D6A85C]/40 backdrop-blur-2xl shadow-2xl max-h-48 overflow-y-auto space-y-1 animate-fade-in text-[#F4DFC0]">
            <div className="text-[10px] font-mono text-[#D6A85C] uppercase tracking-wider mb-1.5 flex items-center justify-between px-1">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>{activePlaylist.name}</span>
              </span>
              <button
                onClick={() => setShowQueue(false)}
                className="text-[10px] text-[#F4DFC0]/60 hover:text-[#D6A85C] cursor-pointer"
              >
                ✕
              </button>
            </div>
            {activePlaylist.tracks.map((tr, idx) => {
              const isCurr = idx === currentTrackIndex;
              return (
                <button
                  key={tr.id}
                  onClick={() => {
                    onSelectTrack(idx);
                    setShowQueue(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isCurr
                      ? "bg-[#541C25] text-[#F4DFC0] border border-[#D6A85C]/50 font-semibold"
                      : "text-[#F4DFC0]/75 hover:bg-[#541C25]/40 hover:text-[#F4DFC0]"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono text-[10px] text-[#D6A85C]">
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="truncate text-[11.5px]">{tr.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#F4DFC0]/50 ml-2">
                    {tr.duration}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Ultra-Compact Dock Bar (Single Sleek Row) */}
        <div className="w-full bg-gradient-to-r from-[#17243A]/95 via-[#35151C]/95 to-[#101827]/95 border border-[#D6A85C]/35 rounded-2xl p-2 shadow-[0_10px_35px_rgba(0,0,0,0.9)] backdrop-blur-2xl relative overflow-hidden flex items-center justify-between gap-2">
          
          {/* Top Interactive Progress Rail */}
          <div
            ref={topRailRef}
            onPointerDown={handleTopRailSeek}
            className="absolute top-0 inset-x-0 h-1 bg-[#35151C]/80 cursor-pointer group pointer-events-auto z-10"
            title={`Seek: ${formatTime(currentTime)} / ${formatTime(duration)}`}
          >
            <div
              className="h-full bg-gradient-to-r from-[#C98238] to-[#D6A85C] shadow-[0_0_6px_#D6A85C]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Left Block: Micro Video Preview Frame & Track Info */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {/* Single YouTube Player Frame */}
            <div
              onClick={() => setIsExpandedVideo(!isExpandedVideo)}
              className={`transition-all duration-300 ${
                isExpandedVideo
                  ? "fixed inset-4 sm:inset-10 z-50 bg-[#35151C]/95 border-2 border-[#D6A85C]/60 rounded-2xl p-3 sm:p-5 shadow-[0_0_50px_rgba(0,0,0,0.95)] backdrop-blur-2xl flex flex-col justify-between"
                  : "w-12 h-8 sm:w-14 sm:h-9 shrink-0 rounded-lg overflow-hidden border border-[#D6A85C]/40 relative group cursor-pointer shadow-sm bg-black"
              }`}
            >
              {isExpandedVideo && (
                <div className="flex items-center justify-between border-b border-[#D6A85C]/20 pb-2 mb-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#D6A85C]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>QAWWALI MEHFIL STAGE — LIVE VIDEO</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExpandedVideo(false);
                    }}
                    className="text-xs px-2.5 py-1 rounded-full bg-[#541C25] text-[#F4DFC0] hover:bg-[#D6A85C] hover:text-[#35151C] transition-colors cursor-pointer font-semibold"
                  >
                    Close Theater ✕
                  </button>
                </div>
              )}

              <div className={isExpandedVideo ? "w-full flex-1 rounded-xl overflow-hidden shadow-2xl relative" : "w-full h-full"}>
                <YouTubePlayer
                  videoId={currentTrack.videoId}
                  trackId={currentTrack.id}
                  isPlaying={isPlaying}
                  onStateChange={onStateChange}
                  onProgressUpdate={handleProgressUpdate}
                  onEnded={onEnded}
                  onErrorSkip={onErrorSkip}
                  userSeekTo={userSeekTo}
                  onSeekHandled={() => setUserSeekTo(null)}
                  onPlayerReadyInstance={(instance) => {
                    ytPlayerRef.current = instance;
                  }}
                />
              </div>

              {isExpandedVideo && (
                <div className="flex items-center justify-between text-xs text-[#F4DFC0] pt-3 border-t border-[#D6A85C]/20 mt-2">
                  <div className="truncate">
                    <span className="font-semibold">{currentTrack.title}</span> — <span className="text-[#F4DFC0]/75">{currentTrack.artist}</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#D6A85C] shrink-0 ml-2">{currentTrack.film} ({currentTrack.year})</span>
                </div>
              )}

              {!isExpandedVideo && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[#D6A85C] transition-opacity pointer-events-none">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            {/* Track Info */}
            <div className="min-w-0 flex-1">
              <h2 className="text-xs font-semibold text-[#F4DFC0] leading-tight truncate">
                {currentTrack.title}
              </h2>
              <p className="text-[10.5px] text-[#F4DFC0]/70 truncate font-sans">
                {currentTrack.artist} <span className="hidden sm:inline text-[#D6A85C] font-mono">• {currentTrack.film}</span>
              </p>
            </div>
          </div>

          {/* Center/Right Block: Transport Controls */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <PlayerControls
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              onPlayPause={onPlayPause}
              onPrevious={onPrevious}
              onNext={onNext}
              onSeek={handleSeek}
              isMuted={isMuted}
              onToggleMute={() => setIsMuted(!isMuted)}
            />

            {/* Track Queue Toggle Button */}
            <button
              onClick={() => setShowQueue(!showQueue)}
              className="w-7 h-7 rounded-full bg-[#35151C] hover:bg-[#541C25] text-[#D6A85C] border border-[#D6A85C]/30 flex items-center justify-center transition-colors cursor-pointer text-[10px] font-mono shrink-0 ml-0.5"
              aria-label="Queue"
              title="Track Queue"
            >
              <ListMusic className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
