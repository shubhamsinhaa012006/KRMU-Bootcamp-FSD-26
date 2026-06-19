
import { usePlaylists } from '../../hooks/usePlaylists';
import { formatDuration } from '../../utils/timeCalculations';
import { ListMusic, Heart, Clock, Activity, Music, TrendingUp } from 'lucide-react';

const Card = ({ title, value, subtitle, icon: Icon, colorClass }) => (
  <div className="relative overflow-hidden rounded-3xl p-6 bg-surface border border-white/5 group hover:border-white/10 transition-colors">
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity ${colorClass}`} />
    
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl bg-white/5 ${colorClass.replace('bg-', 'text-')}`}>
        <Icon size={24} />
      </div>
    </div>
    
    <div>
      <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
      <p className="text-sm font-medium text-neutral-400">{title}</p>
      {subtitle && <p className="text-xs text-neutral-500 mt-2">{subtitle}</p>}
    </div>
  </div>
);

export const PlaylistOverviewCards = () => {
  const { getPlaylistStatistics } = usePlaylists();
  const stats = getPlaylistStatistics();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card 
        title="Total Playlists"
        value={stats.totalPlaylists}
        icon={ListMusic}
        colorClass="bg-primary"
      />
      <Card 
        title="Favorite Playlists"
        value={stats.favoritePlaylists}
        icon={Heart}
        colorClass="bg-workout" // Red-ish for favorites
      />
      <Card 
        title="Total Songs"
        value={stats.totalSongs}
        icon={Music}
        colorClass="bg-focus" // Violet
      />
      <Card 
        title="Total Listening Time"
        value={formatDuration(stats.totalDuration)}
        icon={Clock}
        colorClass="bg-relax" // Emerald
      />
      <Card 
        title="Top Mood"
        value={stats.mostUsedMood}
        icon={Activity}
        colorClass="bg-party" // Amber
      />
      <Card 
        title="Longest Playlist"
        value={stats.longestPlaylist || 'N/A'}
        icon={TrendingUp}
        colorClass="bg-study" // Indigo
      />
    </div>
  );
};
