// filepath: app/lib/poke-api.ts
import { Character, CharactersResponse } from '@/types';

const POKE_API_BASE = 'https://pokeapi.co/api/v2';

interface PokeAPIResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}

interface PokeAPIDetail {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: {
    slot: number;
    type: {
      name: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
    };
  }[];
  height: number;
  weight: number;
}

export async function fetchPokemon(page: number = 1, limit: number = 20): Promise<CharactersResponse> {
  const offset = (page - 1) * limit;
  
  const listResponse = await fetch(`${POKE_API_BASE}/pokemon?limit=${limit}&offset=${offset}`);
  if (!listResponse.ok) throw new Error('Failed to fetch Pokemon list');
  
  const listData: PokeAPIResponse = await listResponse.json();
  
  // Fetch details for each Pokemon
  const pokemonDetails = await Promise.all(
    listData.results.map(async (pokemon) => {
      const detailResponse = await fetch(pokemon.url);
      return detailResponse.json();
    })
  );
  
  const characters: Character[] = pokemonDetails.map((pokemon: PokeAPIDetail) => ({
    id: String(pokemon.id),
    name: capitalizeFirst(pokemon.name),
    image: pokemon.sprites.front_default,
    status: 'Unknown', // Pokemon doesn't have status
    species: pokemon.types.map(t => t.type.name).join(', '),
    gender: 'Unknown', // Pokemon don't have gender in this API
    location: {
      name: `Height: ${pokemon.height / 10}m, Weight: ${pokemon.weight / 10}kg`,
    },
  }));
  
  return {
    characters: {
      info: {
        pages: Math.ceil(listData.count / limit),
        next: listData.next ? page + 1 : null,
        prev: listData.previous ? page - 1 : null,
      },
      results: characters,
    },
  };
}

export async function fetchPokemonById(id: string): Promise<Character> {
  const response = await fetch(`${POKE_API_BASE}/pokemon/${id}`);
  if (!response.ok) throw new Error('Failed to fetch Pokemon');
  
  const pokemon: PokeAPIDetail = await response.json();
  
  return {
    id: String(pokemon.id),
    name: capitalizeFirst(pokemon.name),
    image: pokemon.sprites.front_default,
    status: 'Unknown',
    species: pokemon.types.map(t => t.type.name).join(', '),
    gender: 'Unknown',
    location: {
      name: `Height: ${pokemon.height / 10}m, Weight: ${pokemon.weight / 10}kg`,
    },
  };
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}