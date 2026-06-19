
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, MinusCircle, ExternalLink, Play } from 'lucide-react';
import { formatDuration } from '../../utils/timeCalculations';

export const DraggableSongItem = ({ song, index, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: song.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center justify-between p-4 rounded-2xl bg-surface border transition-all ${
        isDragging ? 'opacity-50 border-white/20 shadow-2xl scale-[1.02]' : 'border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
      }`}
    >
      <div className="flex items-center gap-4 flex-1 overflow-hidden">
        <button 
          className="text-neutral-500 hover:text-white cursor-grab active:cursor-grabbing p-1"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={20} />
        </button>
        <span className="text-sm text-neutral-500 w-4 hidden sm:block">{index + 1}</span>
        
        {song.coverUrl ? (
          <img 
            src={song.coverUrl} 
            alt={song.title} 
            className="w-12 h-12 rounded-lg object-cover shadow-md"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center">
            <span className="text-neutral-500 text-xs">No img</span>
          </div>
        )}
        
        <div className="flex flex-col truncate pr-4">
          <span className="text-white font-medium truncate">{song.title}</span>
          <span className="text-sm text-neutral-400 truncate">{song.artist}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="hidden md:flex flex-col truncate max-w-[150px]">
          <span className="text-xs text-neutral-500 uppercase tracking-wider">Album</span>
          <span className="text-sm text-neutral-400 truncate">{song.album}</span>
        </div>
        
        <div className="flex items-center gap-3">
          {song.previewUrl && (
            <a 
              href={song.previewUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-white transition-colors"
              title="Preview Audio"
            >
              <Play size={18} />
            </a>
          )}
          {song.spotifyUrl && (
            <a 
              href={song.spotifyUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-[#1DB954] transition-colors"
              title="Open in Spotify"
            >
              <ExternalLink size={18} />
            </a>
          )}
        </div>

        <span className="text-sm text-neutral-400 w-12 text-right">
          {formatDuration(song.duration)}
        </span>
        
        <button 
          onClick={() => onRemove(song.id)}
          className="p-2 text-neutral-500 hover:text-workout transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          title="Remove from playlist"
        >
          <MinusCircle size={20} />
        </button>
      </div>
    </div>
  );
};
