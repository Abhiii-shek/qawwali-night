import React, { useState } from "react";
import { PLAYLISTS } from "../lib/playlists";
import { Clock } from "../components/Clock";
import { QawwaliPlayer } from "../components/QawwaliPlayer";
import { trackPlayerEvent } from "../lib/analytics";
import { Share2, Volume2, Info, Heart, Instagram } from "lucide-react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

export function QawwaliPage() {
  const [activePlaylistId, setActivePlaylistId] = useState<string>(PLAYLISTS[0].id);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [listenerCount] = useState<number>(198);
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  const activePlaylist =
    PLAYLISTS.find((p) => p.id === activePlaylistId) || PLAYLISTS[0];

  const handleSelectPlaylist = (id: string) => {
    setActivePlaylistId(id);
    setCurrentTrackIndex(0);
    setIsPlaying(true);
    trackPlayerEvent("playlist_change", { playlistId: id });
  };

  const handlePlayPause = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    trackPlayerEvent(nextState ? "play" : "pause", {
      trackId: activePlaylist.tracks[currentTrackIndex]?.id || "",
    });
  };

  const handlePrevious = () => {
    const prevIndex =
      currentTrackIndex === 0
        ? activePlaylist.tracks.length - 1
        : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    setIsPlaying(true);
    trackPlayerEvent("previous_track", {
      trackId: activePlaylist.tracks[prevIndex]?.id || "",
    });
  };

  const handleNext = () => {
    const nextIndex = (currentTrackIndex + 1) % activePlaylist.tracks.length;
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
    trackPlayerEvent("next_track", {
      trackId: activePlaylist.tracks[nextIndex]?.id || "",
    });
  };

  const handleSelectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    trackPlayerEvent("select_track", {
      trackId: activePlaylist.tracks[index]?.id || "",
    });
  };

  const handleStateChange = (stateNumber: number) => {
    // YT.PlayerState: 1 = PLAYING, 2 = PAUSED
    if (stateNumber === 1) {
      setIsPlaying(true);
    } else if (stateNumber === 2) {
      setIsPlaying(false);
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  const handleErrorSkip = () => {
    handleNext();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <main className="relative flex min-h-dvh flex-1 flex-col items-center justify-between overflow-hidden select-none py-3 px-3 sm:px-6">
      {/* 1. Fixed Responsive Background */}
      <div className="hero-bg fixed inset-0 -z-20 bg-cover bg-center transition-all duration-700" />

      {/* 2. Cinematic Dark Overlay */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black/50 via-black/20 to-black/90 pointer-events-none" />

      {/* 3. Paper / Film Grain Overlay */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none mix-blend-overlay opacity-25"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' h='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* TOP INFORMATION BAR */}
      <header
        className="w-full flex items-center justify-between z-20"
        style={{
          paddingTop: "max(0.75rem, env(safe-area-inset-top))",
          paddingLeft: "max(0.5rem, env(safe-area-inset-left))",
          paddingRight: "max(0.5rem, env(safe-area-inset-right))",
        }}
      >
        {/* Top Left: Clock */}
        <Clock />

        {/* Top Center: Qawwali Specific Status */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#35151C]/70 border border-[#D6A85C]/30 backdrop-blur-md shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#D6A85C] animate-ping" />
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#D6A85C] font-medium">
            ● MEHFIL LIVE • {listenerCount} LISTENING
          </span>
        </div>

        {/* Top Right: Understated Actions */}
        <div className="flex items-center gap-2">
          <a
            href="https://instagram.com/abhishekk._.rajbhar"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-[#35151C]/60 hover:bg-[#541C25] border border-[#D6A85C]/20 text-[#F4DFC0]/80 hover:text-[#D6A85C] flex items-center justify-center transition-colors cursor-pointer group"
            aria-label="Visit Instagram @abhishekk._.rajbhar"
            title="Instagram (@abhishekk._.rajbhar)"
          >
            <Instagram className="w-4 h-4 transition-transform group-hover:scale-110 text-[#D6A85C]" />
          </a>
          <button
            onClick={() => setShowInfoModal(true)}
            className="w-9 h-9 rounded-full bg-[#35151C]/60 hover:bg-[#541C25] border border-[#D6A85C]/20 text-[#F4DFC0]/80 hover:text-[#D6A85C] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Mehfil Info"
          >
            <Info className="w-4 h-4" />
          </button>
          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-full bg-[#35151C]/60 hover:bg-[#541C25] border border-[#D6A85C]/20 text-[#F4DFC0]/80 hover:text-[#D6A85C] flex items-center justify-center transition-colors cursor-pointer relative"
            aria-label="Share Mehfil link"
          >
            <Share2 className="w-4 h-4" />
            {copiedShare && (
              <span className="absolute -bottom-7 right-0 text-[9px] font-mono bg-[#D6A85C] text-[#35151C] px-2 py-0.5 rounded shadow whitespace-nowrap">
                Copied!
              </span>
            )}
          </button>
        </div>
      </header>

      {/* CENTRAL / UPPER TITLE TREATMENT */}
      <section className="flex flex-col items-center text-center my-3 sm:my-5 z-10 max-w-2xl px-2">
        {/* Top Ornamental Flourish */}
        <div className="flex items-center gap-2 text-[#D6A85C]/60 text-xs sm:text-sm mb-1 tracking-widest font-mono">
          <span>❖</span>
          <span className="h-[1px] w-8 bg-[#D6A85C]/40"></span>
          {/* <span>1990s NEIGHBORHOOD MEHFIL</span> */}
          <span className="h-[1px] w-8 bg-[#D6A85C]/40"></span>
          <span>❖</span>
        </div>

        {/* Devanagari Poster Title */}
        <h1 className="font-devanagari text-4xl sm:text-6xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-[#F4DFC0] via-[#D6A85C] to-[#C98238] drop-shadow-[0_4px_16px_rgba(84,28,37,0.9)] tracking-tight leading-none py-1">
          क़व्वाली नाइट
        </h1>

        {/* English Subtitle */}
        <p className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.28em] text-[#F4DFC0]/80 mt-1.5 flex items-center gap-2 drop-shadow-md">
          <span>MEHFIL</span>
          <span className="text-[#C98238]">●</span>
          <span>YAADEN</span>
          <span className="text-[#C98238]">●</span>
          <span>SUR</span>
        </p>
      </section>

      {/* BOTTOM-CENTERED QAWWALI PLAYER */}
      <QawwaliPlayer
        playlists={PLAYLISTS}
        activePlaylist={activePlaylist}
        currentTrackIndex={currentTrackIndex}
        isPlaying={isPlaying}
        onSelectPlaylist={handleSelectPlaylist}
        onPlayPause={handlePlayPause}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSelectTrack={handleSelectTrack}
        onStateChange={handleStateChange}
        onEnded={handleEnded}
        onErrorSkip={handleErrorSkip}
      />

      {/* FOOTER ATMOSPHERIC ELEMENTS */}
      <footer
        className="w-full flex items-center justify-between text-[10px] font-mono text-[#F4DFC0]/50 z-10 pt-2"
        style={{
          paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
          paddingLeft: "max(0.5rem, env(safe-area-inset-left))",
          paddingRight: "max(0.5rem, env(safe-area-inset-right))",
        }}
      >
        <div className="flex items-center gap-1.5">
          <Volume2 className="w-3 h-3 text-[#D6A85C]" />
          <span>HARMONIUM • TABLA • DHOLAK</span>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-[#D6A85C]/70">
          <span>A NIGHT OF QAWWALI & MEMORIES</span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://instagram.com/abhishekk._.rajbhar"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#D6A85C] hover:text-[#F4DFC0] transition-colors cursor-pointer"
            title="Follow @abhishekk._.rajbhar on Instagram"
          >
            <Instagram className="w-3 h-3" />
            <span className="hidden xs:inline">@abhishekk._.rajbhar</span>
          </a>
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3 text-[#541C25] fill-[#D6A85C]" />
            <span>1990s HERITAGE</span>
          </div>
        </div>
      </footer>

      {/* INFO MODAL */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#35151C] border border-[#D6A85C]/40 rounded-2xl p-6 max-w-md w-full shadow-2xl relative text-[#F4DFC0]">
            <div className="flex items-center justify-between border-b border-[#D6A85C]/20 pb-3 mb-4">
              <h3 className="font-devanagari text-xl text-[#D6A85C]">
                क़व्वाली नाइट के बारे में
              </h3>
              <button
                onClick={() => setShowInfoModal(false)}
                className="w-7 h-7 rounded-full bg-[#541C25] text-[#F4DFC0] flex items-center justify-center text-xs hover:bg-[#D6A85C] hover:text-[#35151C] transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs font-sans leading-relaxed text-[#F4DFC0]/85 mb-3">
              Experience the nostalgic atmosphere of an intimate 1990s South Asian neighborhood Qawwali Mehfil. Lit by warm hanging incandescent bulbs, surrounded by burgundy velvet carpets and brass tea trays.
            </p>

            <div className="bg-[#101827]/70 p-3 rounded-xl border border-[#D6A85C]/20 text-[11px] space-y-1.5 text-[#F4DFC0]/75 font-mono mb-4">
              <div>✦ Interactive Vintage Console with visible YouTube Mehfil videos.</div>
              <div>✦ Automatic transition to next track on complete or playback error.</div>
              <div>✦ Curated Sufi and Heritage Qawwali playlists.</div>
            </div>

            <a
              href="https://instagram.com/abhishekk._.rajbhar"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mb-2.5 py-2 rounded-xl bg-[#541C25] hover:bg-[#D6A85C] hover:text-[#35151C] border border-[#D6A85C]/40 text-[#D6A85C] font-semibold text-xs tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Instagram className="w-4 h-4" />
              <span>Connect on Instagram @abhishekk._.rajbhar</span>
            </a>

            <button
              onClick={() => setShowInfoModal(false)}
              className="w-full py-2.5 rounded-xl btn-brass text-[#35151C] font-semibold text-xs tracking-wider uppercase cursor-pointer"
            >
              Back to Mehfil
            </button>
          </div>
        </div>
      )}

      {/* Vercel Analytics & Speed Insights */}
      <Analytics />
      <SpeedInsights />
    </main>
  );
}

export default QawwaliPage;
