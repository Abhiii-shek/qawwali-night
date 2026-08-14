import React from "react";

interface VinylRecordProps {
  isPlaying: boolean;
  albumLabel?: string;
  className?: string;
}

export const VinylRecord: React.FC<VinylRecordProps> = ({
  isPlaying,
  albumLabel = "क़व्वाली महफ़िल",
  className = "",
}) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer Vinyl Body */}
      <div
        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#101827] border-2 border-[#252A22] shadow-[0_8px_24px_rgba(0,0,0,0.9)] flex items-center justify-center relative overflow-hidden animate-spin-slow transition-all duration-300"
        style={{
          animationPlayState: isPlaying ? "running" : "paused",
          backgroundImage:
            "radial-gradient(circle, #101827 0%, #17243A 40%, #101827 70%, #080C14 100%)",
        }}
      >
        {/* Concentric Vinyl Grooves */}
        <div className="absolute inset-1 rounded-full border border-white/5 pointer-events-none" />
        <div className="absolute inset-3 rounded-full border border-white/5 pointer-events-none" />
        <div className="absolute inset-5 rounded-full border border-white/5 pointer-events-none" />
        <div className="absolute inset-7 rounded-full border border-white/5 pointer-events-none" />

        {/* Vinyl Sheen/Reflection Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-full pointer-events-none" />

        {/* Antique Gold Center Label */}
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#D6A85C] via-[#C98238] to-[#541C25] border border-[#F4DFC0]/60 flex flex-col items-center justify-center p-1 text-center shadow-inner relative z-10">
          <span className="text-[7px] font-devanagari text-[#35151C] font-bold leading-none truncate max-w-full">
            {albumLabel}
          </span>
          <span className="text-[5px] font-mono text-[#35151C]/80 uppercase tracking-tighter">
            1990 • SUR
          </span>
          {/* Spindle Hole */}
          <div className="w-2 h-2 rounded-full bg-[#101827] border border-[#F4DFC0]/40 my-0.5" />
        </div>
      </div>
    </div>
  );
};
