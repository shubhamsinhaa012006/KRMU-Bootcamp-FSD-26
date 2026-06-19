import { getClientCredentialsToken, clearToken } from './spotifyAuth';

const BASE_URL = 'https://api.spotify.com/v1';

async function fetchWebApi(endpoint, method = 'GET', body) {
  // Automatically fetch/refresh token if needed
  const token = await getClientCredentialsToken();
  if (!token) {
    throw new Error('Failed to obtain Spotify access token');
  }

  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    // If somehow the token is invalid, clear it so the next request fetches a new one
    clearToken();
    throw new Error('Token expired or invalid');
  }

  if (!res.ok) {
    throw new Error(`API error: ${res.statusText}`);
  }

  return await res.json();
}

/**
 * Maps a Spotify track object to our local format
 */
const mapSpotifyTrack = (item) => ({
  id: item.id,
  title: item.name,
  artist: item.artists.map((a) => a.name).join(', '),
  album: item.album.name,
  duration: Math.floor(item.duration_ms / 1000), // convert to seconds
  coverUrl: item.album.images[0]?.url || '',
  previewUrl: item.preview_url,
  spotifyUrl: item.external_urls?.spotify,
});

/**
 * Searches Spotify for tracks
 */
export async function searchTracks(query, limit = 10) {
  if (!query) return [];
  const data = await fetchWebApi(`search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`);
  if (!data.tracks || !data.tracks.items) return [];
  return data.tracks.items.map(mapSpotifyTrack);
}

/**
 * Gets details for specific tracks (max 50 at a time per Spotify docs)
 */
export async function getTracks(ids) {
  if (!ids || ids.length === 0) return [];
  
  const results = [];
  // Chunk ids into groups of 50
  for (let i = 0; i < ids.length; i += 50) {
    const chunk = ids.slice(i, i + 50).join(',');
    const data = await fetchWebApi(`tracks?ids=${chunk}`);
    if (data.tracks) {
      results.push(...data.tracks.filter(t => t !== null).map(mapSpotifyTrack));
    }
  }
  return results;
}
