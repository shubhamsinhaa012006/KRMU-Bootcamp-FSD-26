const CLIENT_ID = '948135a7660d407fbf36bb2e81d6355c';
const CLIENT_SECRET = '8d2db05ac43c46c89da22fddd168616f';

/**
 * Fetches an access token using the Client Credentials flow.
 * Note: Storing a Client Secret in frontend code is generally insecure for production apps,
 * but is perfectly fine for this local development demo!
 */
export const getClientCredentialsToken = async () => {
  // Check if we already have a valid token
  const existingToken = localStorage.getItem('spotify_access_token');
  const expiresAt = localStorage.getItem('spotify_expires_at');
  
  if (existingToken && expiresAt && new Date().getTime() < parseInt(expiresAt)) {
    return existingToken;
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
    }),
  });

  const data = await response.json();
  if (data.access_token) {
    localStorage.setItem('spotify_access_token', data.access_token);
    // Token usually expires in 3600 seconds (1 hour)
    const expiresTime = new Date().getTime() + (data.expires_in * 1000);
    localStorage.setItem('spotify_expires_at', expiresTime.toString());
    return data.access_token;
  }
  
  return null;
};

export const getAccessToken = () => {
  // We'll synchronously check the local storage.
  // If it's expired or missing, we trigger an async refresh via getClientCredentialsToken
  // in the actual API call logic.
  return localStorage.getItem('spotify_access_token');
};

export const clearToken = () => {
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_expires_at');
};
