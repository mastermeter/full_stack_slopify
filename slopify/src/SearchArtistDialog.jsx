import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { SEARCH_ARTIST } from './graphql/queries';

const SearchArtistDialog = ({ onSelect, onClose }) => {
  const [query, setQuery] = useState('');
  const [searchArtist, { data, loading, error }] = useLazyQuery(SEARCH_ARTIST);

  const handleSearch = () => {
    if (query.trim()) {
      searchArtist({ variables: { name: query } });
    }
  };

  return (
    <div className="dialog">
      <div className="dialog-content">
        <h3>Rechercher un artiste Spotify</h3>
        <input
          type="text"
          placeholder="Nom de l'artiste"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Chercher</button>
        <button onClick={onClose}>Fermer</button>

        {loading && <p>Recherche en cours...</p>}
        {error && <p>Erreur : {error.message}</p>}

        {data?.searchArtist && (
          <ul>
            {data.searchArtist.map((artist) => (
              <li
                key={artist.id}
                style={{ cursor: 'pointer', marginBottom: '1rem' }}
                onClick={() => {
                  onSelect(artist);
                  onClose();
                }}
              >
                <img
                  src={artist.imageUrl}
                  alt={artist.name}
                  style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '50%' }}
                />
                <span style={{ marginLeft: 10 }}>{artist.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchArtistDialog;
