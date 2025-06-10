// resolvers.js
import axios from 'axios';
import { getSpotifyAccessToken } from '../spotify.js';
import { getDb } from '../db.js';
import { ObjectId } from 'mongodb';

const resolvers = {
  Query: {
    // Retourne les événements de l'utilisateur connecté
    events: async (_, __, context) => {
      if (!context.user?.id) return [];
      const db = getDb();
      return await db.collection("events").find({ createdBy: context.user.id }).toArray();
    },

    // Retourne tous les événements
    allEvents: async () => {
      const db = getDb();
      return await db.collection("events").find().toArray();
    },

    // Recherche d'artiste via Spotify
    searchArtist: async (_, { name }) => {
      const token = await getSpotifyAccessToken();

      const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: name,
          type: 'artist',
          limit: 10,
        },
      });

      const artists = response.data.artists.items;

      return artists.map(artist => ({
        id: artist.id || artist.name,
        href: artist.external_urls?.spotify || null,
        imageUrl: artist.images?.[0]?.url || null,
        name: artist.name,
      }));
    },
  },

  Mutation: {
    // (à compléter selon ton code pour createEvent, updateEvent, etc.)
  },

  Event: {
    id: (event) => event._id?.toString?.() || event.id || event.name,
  },
};

export default resolvers;
