import React from "react";
import { Playlist } from "../lib/playlists";

interface PlaylistSwitcherProps {
  playlists: Playlist[];
  activePlaylistId: string;
  onSelectPlaylist: (playlistId: string) => void;
}

export const PlaylistSwitcher: React.FC<PlaylistSwitcherProps> = ({
  playlists,
  activePlaylistId,
  onSelectPlaylist,
}) => {
  return (
    <div className="w-full flex items-center justify-center">
      <nav
        aria-label="Qawwali Playlists"
        className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 px-2 max-w-full rounded-full bg-[#35151C]/75 border border-[#D6A85C]/25 backdrop-blur-md shadow-md"
      >
        {playlists.map((pl) => {
          const isActive = pl.id === activePlaylistId;
          return (
            <button
              key={pl.id}
              onClick={() => onSelectPlaylist(pl.id)}
              className={`relative px-2.5 py-1 rounded-full text-[10.5px] font-medium tracking-wider transition-all duration-200 whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                isActive
                  ? "text-[#F4DFC0] bg-gradient-to-r from-[#541C25] to-[#35151C] border border-[#D6A85C]/50 shadow-sm"
                  : "text-[#F4DFC0]/60 hover:text-[#F4DFC0] hover:bg-[#541C25]/30 border border-transparent"
              }`}
            >
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#D6A85C] shadow-[0_0_4px_#D6A85C]"></span>
              )}
              <span>{pl.name}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
