import React, { useRef } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";

interface PlayerControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSeek: (seconds: number) => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
}

export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onPrevious,
  onNext,
  onSeek,
  isMuted,
  onToggleMute,
}) => {
  const railRef = useRef<HTMLDivElement>(null);

  const calculateSeekPercent = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!railRef.current || duration <= 0) return;
    const rect = railRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = x / rect.width;
    onSeek(percent * duration);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    calculateSeekPercent(e);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!railRef.current || duration <= 0) return;
      const rect = railRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(moveEvent.clientX - rect.left, rect.width));
      const percent = x / rect.width;
      onSeek(percent * duration);
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const progressPercent = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {/* Previous Button */}
      <button
        onClick={onPrevious}
        aria-label="Previous track"
        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#35151C] border border-[#D6A85C]/30 text-[#F4DFC0] hover:text-[#D6A85C] hover:border-[#D6A85C]/60 flex items-center justify-center shadow transition-all active:scale-95 cursor-pointer shrink-0"
      >
        <SkipBack className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
      </button>

      {/* Play / Pause Main Brass Knob */}
      <button
        onClick={onPlayPause}
        aria-label={isPlaying ? "Pause qawwali" : "Play qawwali"}
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full btn-brass text-[#35151C] flex items-center justify-center ring-1 ring-white/30 transition-transform duration-200 active:scale-95 cursor-pointer shrink-0 shadow-[0_2px_10px_rgba(201,130,56,0.4)]"
      >
        {isPlaying ? (
          <Pause className="w-3.5 h-3.5 fill-[#35151C] stroke-[#35151C]" />
        ) : (
          <Play className="w-3.5 h-3.5 fill-[#35151C] stroke-[#35151C] ml-0.5" />
        )}
      </button>

      {/* Next Button */}
      <button
        onClick={onNext}
        aria-label="Next track"
        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#35151C] border border-[#D6A85C]/30 text-[#F4DFC0] hover:text-[#D6A85C] hover:border-[#D6A85C]/60 flex items-center justify-center shadow transition-all active:scale-95 cursor-pointer shrink-0"
      >
        <SkipForward className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
      </button>

      {/* Digital Time Counter Badge (Always visible on all screens!) */}
      <div
        className="flex items-center gap-1 font-mono text-[10px] text-[#D6A85C] bg-[#35151C]/90 px-2 py-0.5 rounded-md border border-[#D6A85C]/25 shrink-0 select-none shadow-inner"
        title="Current playback time / Total duration"
      >
        <span className="text-[#F4DFC0] font-semibold">{formatTime(currentTime)}</span>
        <span className="text-[#D6A85C]/50">/</span>
        <span className="text-[#F4DFC0]/70">{formatTime(duration)}</span>
      </div>

      {/* Seekbar Rail (visible on sm screens and up) */}
      <div className="hidden sm:flex items-center gap-1.5 w-20 md:w-32 lg:w-40">
        <div
          ref={railRef}
          onPointerDown={handlePointerDown}
          className="relative flex-1 h-4 flex items-center cursor-pointer group touch-none py-1"
          role="slider"
          aria-label="Seek track"
          aria-valuemin={0}
          aria-valuemax={duration || 100}
          aria-valuenow={currentTime}
        >
          <div className="w-full h-[3px] bg-[#35151C]/90 rounded-full overflow-hidden border border-[#D6A85C]/25">
            <div
              className="h-full bg-gradient-to-r from-[#C98238] to-[#D6A85C] transition-all duration-150"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#F4DFC0] border border-[#C98238] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{ left: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Mute Toggle Button */}
      <button
        onClick={onToggleMute}
        aria-label={isMuted ? "Unmute audio" : "Mute audio"}
        className="w-7 h-7 flex items-center justify-center text-[#F4DFC0]/70 hover:text-[#D6A85C] transition-colors rounded-full cursor-pointer shrink-0"
      >
        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};
