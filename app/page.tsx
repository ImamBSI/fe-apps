// filepath: app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { graphqlClient, GET_CHARACTERS } from './lib/graphql-client';
import CharacterCard from './components/CharacterCard';

interface Character {
  id: string;
  name: string;
  image: string;
  status: string;
  species: string;
  gender: string;
  location: {
    name: string;
  };
}

interface CharactersResponse {
  characters: {
    info: {
      pages: number;
      next: number | null;
      prev: number | null;
    };
    results: Character[];
  };
}

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCharacters(page);
  }, [page]);

  const fetchCharacters = async (pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await graphqlClient.request<CharactersResponse>(GET_CHARACTERS, { page: pageNum });
      if (pageNum === 1) {
        setCharacters(data.characters.results);
      } else {
        setCharacters((prev) => [...prev, ...data.characters.results]);
      }
      setTotalPages(data.characters.info.pages);
    } catch (err) {
      setError('Failed to fetch characters');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      <div className="max-w-md mx-auto md:max-w-6xl md:px-4">
        <header className="bg-white sticky top-0 z-40 shadow-sm">
          <div className="px-4 py-4">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Rick and Morty</h1>
            <p className="text-sm text-gray-500">Characters</p>
          </div>
        </header>

        {error && (
          <div className="p-4 m-4 bg-red-50 text-red-600 rounded-lg">
            {error}
            <button onClick={() => fetchCharacters(page)} className="ml-2 underline">
              Retry
            </button>
          </div>
        )}

        <div className="p-2 md:p-4">
          {loading && characters.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">Loading...</div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {characters.map((character) => (
                  <CharacterCard key={character.id} character={character} />
                ))}
              </div>

              {loading && characters.length > 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-500">Loading more...</div>
                </div>
              )}

              {!loading && page < totalPages && (
                <div className="text-center py-8">
                  <button
                    onClick={loadMore}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
