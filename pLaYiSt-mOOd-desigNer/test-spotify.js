import { getClientCredentialsToken } from './src/services/spotifyAuth.js';
import { searchTracks } from './src/services/spotifyApi.js';

async function run() {
  try {
    const token = await getClientCredentialsToken();
    console.log('Token:', token);
    const results = await searchTracks('Te');
    console.log('Results:', results);
  } catch (err) {
    console.error('Test error:', err);
  }
}
run();
