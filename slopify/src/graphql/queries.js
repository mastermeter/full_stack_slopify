// src/graphql/queries.js
import { gql } from '@apollo/client';

export const SEARCH_ARTIST = gql`
  query SearchArtist($name: String!) {
    searchArtist(name: $name) {
      id
      name
      href
      imageUrl
    }
  }
`;
