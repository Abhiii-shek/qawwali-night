import React, { useEffect, useRef, useState } from "react";
import { trackPlayerEvent } from "../lib/analytics";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubePlayerProps {
  videoId: string;
  trackId: string;
  isPlaying: boolean;
  onStateChange: (state: number) => void;
  onProgressUpdate: (currentTime: number, duration: number) => void;
  onEnded: () => void;
  onErrorSkip: () => void;
  userSeekTo?: number | null;
  onSeekHandled?: () => void;
  onPlayerReadyInstance?: (player: any) => void;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoId,
  trackId,
  isPlaying,
  onStateChange,
  onProgressUpdate,
  onEnded,
  onErrorSkip,
  userSeekTo,
  onSeekHandled,
  onPlayerReadyInstance,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [isApiReady, setIsApiReady] = useState<boolean>(false);
  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);

  // Load YouTube IFrame API once
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setIsApiReady(true);
      return;
    }

    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (previousCallback) previousCallback();
      setIsApiReady(true);
    };

    if (!document.getElementById("yt-iframe-api-script")) {
      const script = document.createElement("script");
      script.id = "yt-iframe-api-script";
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);
    }
  }, []);

  // Handle empty or missing videoId
  useEffect(() => {
    if (!videoId || !videoId.trim()) {
      const timer = setTimeout(() => {
        onErrorSkip();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [videoId]);

  // Initialize YouTube Player when videoId or API changes
  useEffect(() => {
    if (!isApiReady || !containerRef.current || !videoId || !videoId.trim()) return;

    let isMounted = true;
    setIsPlayerReady(false);
    onProgressUpdate(0, 0);

    // Destroy existing instance if any
    if (playerRef.current && typeof playerRef.current.destroy === "function") {
      try {
        playerRef.current.destroy();
      } catch (e) {
        // ignore
      }
      playerRef.current = null;
    }

    const playerDiv = document.createElement("div");
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(playerDiv);

    playerRef.current = new window.YT.Player(playerDiv, {
      videoId: videoId,
      playerVars: {
        autoplay: isPlaying ? 1 : 0,
        controls: 1,
        modestbranding: 1,
        rel: 0,
        fs: 1,
        iv_load_policy: 3,
        playsinline: 1,
      },
      events: {
        onReady: (event: any) => {
          if (!isMounted) return;
          setIsPlayerReady(true);
          if (onPlayerReadyInstance) {
            onPlayerReadyInstance(event.target);
          }
          if (isPlaying) {
            try {
              event.target.playVideo();
            } catch (e) {
              // ignore
            }
          }
        },
        onStateChange: (event: any) => {
          if (!isMounted) return;
          const state = event.data;
          onStateChange(state);

          // YT.PlayerState.ENDED is 0
          if (state === 0) {
            onEnded();
          }
        },
        onError: (event: any) => {
          if (!isMounted) return;
          const errorCode = event.data;
          trackPlayerEvent("track_unavailable", {
            errorCode,
            videoId,
            trackId,
          });
          onErrorSkip();
        },
      },
    });

    return () => {
      isMounted = false;
    };
  }, [videoId, isApiReady]);

  // Handle Play/Pause changes from parent UI
  useEffect(() => {
    if (!playerRef.current || !isPlayerReady) return;
    try {
      if (isPlaying) {
        const state = playerRef.current.getPlayerState?.();
        if (state !== 1 && state !== 3) {
          playerRef.current.playVideo?.();
        }
      } else {
        const state = playerRef.current.getPlayerState?.();
        if (state === 1 || state === 3) {
          playerRef.current.pauseVideo?.();
        }
      }
    } catch (e) {
      // ignore
    }
  }, [isPlaying, isPlayerReady]);

  // Handle user seeking
  useEffect(() => {
    if (
      userSeekTo !== undefined &&
      userSeekTo !== null &&
      playerRef.current &&
      isPlayerReady
    ) {
      try {
        playerRef.current.seekTo(userSeekTo, true);
        if (isPlaying) {
          playerRef.current.playVideo();
        }
      } catch (e) {
        console.warn("Seek error:", e);
      }
      if (onSeekHandled) onSeekHandled();
    }
  }, [userSeekTo, isPlayerReady]);

  // Continuously poll currentTime and duration every 500ms when player is ready
  useEffect(() => {
    if (!isPlayerReady || !playerRef.current) return;

    const poll = () => {
      try {
        if (
          playerRef.current &&
          typeof playerRef.current.getCurrentTime === "function" &&
          typeof playerRef.current.getDuration === "function"
        ) {
          const current = playerRef.current.getCurrentTime() || 0;
          const dur = playerRef.current.getDuration() || 0;
          if (typeof current === "number" && !isNaN(current)) {
            onProgressUpdate(current, dur);
          }
        }
      } catch (e) {
        // ignore
      }
    };

    poll();
    const interval = setInterval(poll, 500);

    return () => {
      clearInterval(interval);
    };
  }, [isPlayerReady, videoId]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl bg-[#35151C]">
      {/* Decorative Stage Lines */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#D6A85C]/60 to-transparent z-10 pointer-events-none" />

      {/* Visible YouTube Container */}
      <div ref={containerRef} className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:rounded-xl" />
    </div>
  );
};
