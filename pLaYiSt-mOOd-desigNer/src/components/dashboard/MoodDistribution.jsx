
import { usePlaylists } from '../../hooks/usePlaylists';
import { MOODS } from '../../data/predefinedSongs';

export const MoodDistribution = () => {
  const { getPlaylistStatistics } = usePlaylists();
  const { moodCounts, totalPlaylists } = getPlaylistStatistics();

  if (totalPlaylists === 0) return null;

  return (
    <div className="bg-surface border border-white/5 rounded-3xl p-6 mt-8">
      <h3 className="text-xl font-bold text-white mb-6">Mood Distribution</h3>
      
      <div className="space-y-4">
        {MOODS.map(mood => {
          const count = moodCounts[mood.name] || 0;
          const percentage = totalPlaylists > 0 ? Math.round((count / totalPlaylists) * 100) : 0;
          
          return (
            <div key={mood.name} className="flex items-center gap-4">
              <div className="w-24 text-sm font-medium text-neutral-400">
                {mood.name}
              </div>
              <div className="flex-1 h-3 bg-black/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${mood.color} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="w-12 text-right text-sm font-medium text-neutral-300">
                {percentage}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
