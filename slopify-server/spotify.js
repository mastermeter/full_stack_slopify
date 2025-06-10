// spotify.js
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

let accessToken = null;
let expiresAt = null;

export const getSpotifyAccessToken = async () => {
  if (accessToken && expiresAt && Date.now() < expiresAt) {
    return accessToken;
  }

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    accessToken = response.data.access_token;
    expiresAt = Date.now() + response.data.expires_in * 1000;

    return accessToken;
  } catch (error) {
    console.error('Erreur lors de l’obtention du token Spotify:', error.response?.data || error.message);
    throw error;
  }
};
