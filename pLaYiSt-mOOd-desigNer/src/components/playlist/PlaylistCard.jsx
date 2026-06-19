import { useNavigate } from 'react-router-dom';
import { Heart, Clock, Music } from 'lucide-react';
import { MOODS } from '../../data/predefinedSongs';
import { usePlaylists } from '../../hooks/usePlaylists';

export const PlaylistCard = ({ playlist, duration }) => {
  const navigate = useNavigate();
  const { toggleFavorite } = usePlaylists();

  const moodObj = MOODS.find(m => m.name === playlist.mood) || MOODS[0];
  const songCount = playlist.songs.length;

  return (
    <div
      onClick={() => navigate(`/playlists/${playlist.id}`)}
      className="group relative flex flex-col bg-surface border border-white/5 rounded-3xl overflow-hidden hover:border-white/10 transition-all cursor-pointer hover:-translate-y-1"
    >
      {/* Background glow based on mood */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br from-transparent to-${moodObj.color.replace('bg-', '')}`} />

      {/* Album art strip from first song if available */}
      {playlist.songs.length > 0 && playlist.songs[0]?.coverUrl && (
        <div className="h-24 w-full overflow-hidden relative">
          <img
            src={playlist.songs[0].coverUrl}
            alt=""
            className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500 scale-105 group-hover:scale-100 transition-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface" />
        </div>
      )}

      <div className="p-6 flex flex-col flex-1 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 ${moodObj.color.replace('bg-', 'text-')}`}>
            {playlist.mood}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(playlist.id);
            }}
            className="p-2 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm transition-colors"
            aria-label={playlist.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              size={18}
              className={playlist.isFavorite ? 'fill-workout text-workout' : 'text-neutral-400'}
            />
          </button>
        </div>

        <h3 className="text-2xl font-bold text-white mb-2 truncate group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-neutral-400 transition-all">
          {playlist.name}
        </h3>

        <div className="mt-auto pt-6 flex items-center justify-between text-sm text-neutral-400">
          <div className="flex items-center gap-2">
            <Music size={16} />
            <span>{songCount} songs</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>{duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
