// filepath: app/lib/graphql-client.ts
import { GraphQLClient } from 'graphql-request';

const endpoint = 'https://rickandmortyapi.com/graphql';

export const graphqlClient = new GraphQLClient(endpoint);

// GraphQL Queries
export const GET_CHARACTERS = `
  query GetCharacters($page: Int!) {
    characters(page: $page) {
      info {
        pages
        next
        prev
      }
      results {
        id
        name
        image
        status
        species
        gender
        location {
          name
        }
      }
    }
  }
`;

export const GET_CHARACTER_BY_ID = `
  query GetCharacterById($id: ID!) {
    character(id: $id) {
      id
      name
      image
      status
      species
      gender
      type
      origin {
        name
        type
      }
      location {
        name
        type
      }
      episode {
        id
        name
        episode
      }
    }
  }
`;

export const GET_CHARACTERS_BY_LOCATION = `
  query GetCharactersByLocation($name: String!, $page: Int!) {
    locations(filter: { name: $name }) {
      results {
        id
        name
        type
        dimension
        residents {
          id
          name
          image
          status
          species
        }
      }
    }
  }
`;

export const GET_LOCATIONS = `
  query GetLocations {
    locations {
      results {
        id
        name
        type
        dimension
      }
    }
  }
`;