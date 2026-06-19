import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ArrowLeft, Clock, Music, Plus, Trash2, Heart, Search, Loader2 } from 'lucide-react';
import { usePlaylists } from '../hooks/usePlaylists';
import { MOODS } from '../data/predefinedSongs';
import { DraggableSongItem } from '../components/playlist/DraggableSongItem';
import { formatDuration } from '../utils/timeCalculations';
import { searchTracks } from '../services/spotifyApi';

export const PlaylistDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playlists, updatePlaylistSongs, deletePlaylist, toggleFavorite, updatePlaylist } = usePlaylists();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editMood, setEditMood] = useState('');
  
  // Spotify Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const playlist = playlists.find(p => p.id === id);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        setIsSearching(true);
        try {
          const results = await searchTracks(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error("Error searching Spotify", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const moodObj = playlist ? (MOODS.find(m => m.name === playlist.mood) || MOODS[0]) : MOODS[0];
  const currentSongs = useMemo(() => playlist?.songs || [], [playlist?.songs]);

  const totalDuration = useMemo(() => {
    return currentSongs.reduce((acc, curr) => acc + (curr.duration || 0), 0);
  }, [currentSongs]);

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-2xl text-white mb-4">Playlist not found</h2>
        <button onClick={() => navigate('/playlists')} className="text-primary hover:underline">
          Go back
        </button>
      </div>
    );
  }

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = currentSongs.findIndex(s => s.id === active.id);
      const newIndex = currentSongs.findIndex(s => s.id === over.id);
      
      const newSongs = arrayMove(currentSongs, oldIndex, newIndex);
      updatePlaylistSongs(playlist.id, newSongs);
    }
  };

  const removeSong = (songId) => {
    const newSongs = currentSongs.filter(song => song.id !== songId);
    updatePlaylistSongs(playlist.id, newSongs);
  };

  const addSong = (songObj) => {
    if (!currentSongs.find(s => s.id === songObj.id)) {
      updatePlaylistSongs(playlist.id, [...currentSongs, songObj]);
    }
  };

  const handleDeletePlaylist = () => {
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      deletePlaylist(playlist.id);
      navigate('/playlists');
    }
  };

  const handleEditPlaylist = (e) => {
    e.preventDefault();
    if (!editName.trim()) return;
    updatePlaylist(playlist.id, editName, editMood);
    setIsEditModalOpen(false);
  };

  const openEditModal = () => {
    setEditName(playlist.name);
    setEditMood(playlist.mood);
    setIsEditModalOpen(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full flex flex-col gap-8 pb-20"
    >
      <button 
        onClick={() => navigate('/playlists')}
        className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors w-fit"
      >
        <ArrowLeft size={20} />
        Back to Playlists
      </button>

      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden p-8 md:p-12 border border-white/10">
        <div className={`absolute inset-0 opacity-20 bg-gradient-to-br from-${moodObj.color.replace('bg-', '')} to-black blur-xl`} />
        <div className={`absolute inset-0 bg-gradient-to-t from-background to-transparent`} />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end gap-8">
          <div className={`w-40 h-40 md:w-56 md:h-56 rounded-2xl flex items-center justify-center shadow-2xl ${moodObj.color} bg-opacity-20 backdrop-blur-md border border-white/20 overflow-hidden relative`}>
            {currentSongs.length > 0 && currentSongs[0].coverUrl ? (
              <img src={currentSongs[0].coverUrl} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay" />
            ) : null}
            <Music size={80} className="text-white opacity-50 relative z-10" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/20 ${moodObj.color.replace('bg-', 'text-')}`}>
                {playlist.mood}
              </span>
              <span className="text-sm font-medium text-neutral-400 uppercase tracking-widest">Playlist</span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              {playlist.name}
            </h1>
            
            <div className="flex items-center gap-6 text-sm font-medium text-neutral-300">
              <button 
                onClick={() => toggleFavorite(playlist.id)}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Heart size={20} className={playlist.isFavorite ? "fill-workout text-workout" : ""} />
                {playlist.isFavorite ? 'Favorited' : 'Add to Favorites'}
              </button>
              <span className="flex items-center gap-2">
                <Music size={18} className="text-neutral-500" />
                {currentSongs.length} songs
              </span>
              <span className="flex items-center gap-2">
                <Clock size={18} className="text-neutral-500" />
                {formatDuration(totalDuration)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions & Song List */}
      <div className="flex flex-col gap-6 mt-4">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-2xl font-bold text-white">Songs</h2>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full font-semibold hover:bg-neutral-200 transition-colors"
            >
              <Plus size={18} />
              <span className="hidden sm:block">Add Songs</span>
            </button>
            <button 
              onClick={openEditModal}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white border border-white/20 rounded-full font-semibold hover:bg-white/20 transition-colors"
            >
              <span className="hidden sm:block">Edit</span>
            </button>
            <button 
              onClick={handleDeletePlaylist}
              className="flex items-center gap-2 px-5 py-2.5 bg-workout/10 text-workout border border-workout/20 rounded-full font-semibold hover:bg-workout/20 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {currentSongs.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl text-neutral-500">
            <Music size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-xl mb-4">This playlist is empty.</p>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="text-primary hover:underline"
            >
              Search Spotify for songs
            </button>
          </div>
        ) : (
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={currentSongs.map(s => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-3">
                {currentSongs.map((song, index) => (
                  <DraggableSongItem 
                    key={song.id} 
                    song={song} 
                    index={index}
                    onRemove={removeSong}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Add Song Modal with Spotify Search */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsAddModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[80vh] flex flex-col bg-surface border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/10 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Search className="text-primary" /> Search Spotify
                  </h2>
                  <button 
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-neutral-400 hover:text-white"
                  >
                    Close
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Search for songs, artists..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
              
              <div className="p-6 overflow-y-auto flex flex-col gap-4 flex-1">
                {isSearching ? (
                  <div className="flex flex-col items-center justify-center py-10 text-neutral-400">
                    <Loader2 size={32} className="animate-spin mb-4 text-primary" />
                    <p>Searching Spotify...</p>
                  </div>
                ) : searchResults.length === 0 && searchQuery.trim().length > 0 ? (
                  <p className="text-center text-neutral-500 py-10">No results found for "{searchQuery}"</p>
                ) : searchResults.length === 0 ? (
                  <p className="text-center text-neutral-500 py-10">Type a song name above to search Spotify.</p>
                ) : (
                  searchResults.map(song => {
                    const isAdded = currentSongs.find(s => s.id === song.id);
                    return (
                      <div key={song.id} className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${isAdded ? 'border-primary/30 bg-primary/5' : 'border-white/5 hover:bg-white/5'}`}>
                        <div className="flex items-center gap-4 flex-1 overflow-hidden">
                          {song.coverUrl ? (
                            <img src={song.coverUrl} alt="" className="w-12 h-12 rounded object-cover shadow-lg" />
                          ) : (
                            <div className="w-12 h-12 rounded bg-neutral-800 flex items-center justify-center">
                              <Music size={20} className="text-neutral-500" />
                            </div>
                          )}
                          <div className="truncate pr-4">
                            <p className="text-white font-medium truncate">{song.title}</p>
                            <p className="text-sm text-neutral-400 truncate">{song.artist}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => !isAdded && addSong(song)}
                          disabled={isAdded}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${isAdded ? 'bg-transparent text-neutral-500 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                        >
                          {isAdded ? 'Added' : 'Add'}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Playlist Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsEditModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-surface border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Edit Playlist</h2>
              <form onSubmit={handleEditPlaylist} className="flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Playlist Name</label>
                  <input 
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
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
                        onClick={() => setEditMood(m.name)}
                        className={`py-3 px-4 rounded-xl border text-sm font-medium transition-colors ${
                          editMood === m.name 
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
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-6 py-3 rounded-full text-neutral-400 hover:text-white transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 transition-colors"
                  >
                    Save Changes
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
