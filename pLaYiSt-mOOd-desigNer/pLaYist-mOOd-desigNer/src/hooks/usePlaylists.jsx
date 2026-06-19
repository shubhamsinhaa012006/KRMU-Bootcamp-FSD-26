import { createContext, useContext, useState, useEffect } from 'react';

const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
  const [playlists, setPlaylists] = useState(() => {
    const saved = localStorage.getItem('moodPlaylists');
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('moodPlaylists', JSON.stringify(playlists));
  }, [playlists]);

  const addPlaylist = (name, mood) => {
    const newPlaylist = {
      id: `playlist-${Date.now()}`,
      name,
      mood,
      isFavorite: false,
      songs: []
    };
    setPlaylists([newPlaylist, ...playlists]);
  };

  const deletePlaylist = (id) => {
    setPlaylists(playlists.filter(p => p.id !== id));
  };

  const toggleFavorite = (id) => {
    setPlaylists(playlists.map(p => 
      p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
    ));
  };

  const updatePlaylistSongs = (playlistId, newSongsList) => {
    setPlaylists(playlists.map(p => 
      p.id === playlistId ? { ...p, songs: newSongsList } : p
    ));
  };

  const updatePlaylist = (playlistId, newName, newMood) => {
    setPlaylists(playlists.map(p =>
      p.id === playlistId ? { ...p, name: newName, mood: newMood } : p
    ));
  };

  const getPlaylistStatistics = () => {
    const totalPlaylists = playlists.length;
    const favoritePlaylists = playlists.filter(p => p.isFavorite).length;
    let totalSongs = 0;
    let totalDuration = 0;
    const moodCounts = {};
    let longestPlaylist = { name: 'None', duration: 0 };

    playlists.forEach(p => {
      totalSongs += p.songs.length;
      let pDuration = 0;
      
      p.songs.forEach(song => {
        if (song && song.duration) {
          pDuration += song.duration;
        }
      });
      totalDuration += pDuration;

      if (pDuration > longestPlaylist.duration) {
        longestPlaylist = { name: p.name, duration: pDuration };
      }

      moodCounts[p.mood] = (moodCounts[p.mood] || 0) + 1;
    });

    let mostUsedMood = 'None';
    let maxMoodCount = 0;
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > maxMoodCount) {
        maxMoodCount = count;
        mostUsedMood = mood;
      }
    });

    return {
      totalPlaylists,
      favoritePlaylists,
      totalSongs,
      totalDuration,
      longestPlaylist: longestPlaylist.name,
      mostUsedMood,
      moodCounts
    };
  };

  return (
    <PlaylistContext.Provider value={{
      playlists,
      addPlaylist,
      deletePlaylist,
      toggleFavorite,
      updatePlaylistSongs,
      updatePlaylist,
      getPlaylistStatistics
    }}>
      {children}
    </PlaylistContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePlaylists = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error('usePlaylists must be used within a PlaylistProvider');
  }
  return context;
};
