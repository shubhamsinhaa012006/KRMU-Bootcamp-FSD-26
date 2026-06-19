import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter } from 'lucide-react';
import { usePlaylists } from '../hooks/usePlaylists';
import { PlaylistCard } from '../components/playlist/PlaylistCard';
import { MOODS } from '../data/predefinedSongs';
import { formatDuration } from '../utils/timeCalculations';

export const AllPlaylistsPage = () => {
  const { playlists, addPlaylist } = usePlaylists();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistMood, setNewPlaylistMood] = useState(MOODS[0].name);

  // Filter playlists
  const filteredPlaylists = playlists.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMood = selectedMood === 'All' || p.mood === selectedMood;
    const matchesFav = !showFavoritesOnly || p.isFavorite;
    return matchesSearch && matchesMood && matchesFav;
  });

  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    addPlaylist(newPlaylistName, newPlaylistMood);
    setIsCreateModalOpen(false);
    setNewPlaylistName('');
  };

  // Songs are now full objects, so sum durations directly
  const getPlaylistDuration = (playlist) => {
    const seconds = playlist.songs.reduce((acc, song) => acc + (song?.duration || 0), 0);
    return formatDuration(seconds);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full flex flex-col gap-8 pb-20"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Playlists</h1>
          <p className="text-neutral-400">Manage and organize your musical moods.</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-neutral-200 transition-colors"
        >
          <Plus size={20} />
          Create Playlist
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-surface p-4 rounded-3xl border border-white/5">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
          <input
            type="text"
            placeholder="Search playlists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/50 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0">
          <select
            value={selectedMood}
            onChange={(e) => setSelectedMood(e.target.value)}
            className="bg-black/50 border border-white/5 rounded-2xl py-3 px-4 text-white focus:outline-none cursor-pointer appearance-none min-w-[120px]"
          >
            <option value="All">All Moods</option>
            {MOODS.map(m => (
              <option key={m.name} value={m.name}>{m.name}</option>
            ))}
          </select>

          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl border transition-colors whitespace-nowrap ${
              showFavoritesOnly
                ? 'bg-workout/20 border-workout/50 text-workout'
                : 'bg-black/50 border-white/5 text-neutral-400 hover:text-white'
            }`}
          >
            <Filter size={18} />
            Favorites
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredPlaylists.map(playlist => (
            <motion.div
              key={playlist.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <PlaylistCard playlist={playlist} duration={getPlaylistDuration(playlist)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredPlaylists.length === 0 && (
        <div className="text-center py-20 text-neutral-500">
          <p className="text-xl">No playlists found.</p>
          {playlists.length === 0 && (
            <p className="text-sm mt-2">Click <strong className="text-white">Create Playlist</strong> to get started.</p>
          )}
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsCreateModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-surface border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Create Playlist</h2>
              <form onSubmit={handleCreatePlaylist} className="flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Playlist Name</label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                    placeholder="E.g., Deep Work Focus"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Select Mood</label>
                  <div className="grid grid-cols-2 gap-3">
                    {MOODS.map(m => (
                      <button
                        key={m.name}
                        type="button"
                        onClick={() => setNewPlaylistMood(m.name)}
                        className={`py-3 px-4 rounded-xl border text-sm font-medium transition-colors ${
                          newPlaylistMood === m.name
                            ? `bg-white/10 border-${m.color.replace('bg-', '')} text-white`
                            : 'bg-black/30 border-white/5 text-neutral-400 hover:bg-white/5'
                        }`}
                      >
                        {m.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-6 py-3 rounded-full text-neutral-400 hover:text-white transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 transition-colors"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
