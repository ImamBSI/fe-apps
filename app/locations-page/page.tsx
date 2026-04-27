// filepath: app/locations/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getLocationNames, getCharactersByLocation, CharacterAssignment } from '../lib/storage';

interface LocationData {
  name: string;
  characters: CharacterAssignment[];
}

export default function LocationsPage() {
  const [registeredLocations, setRegisteredLocations] = useState<LocationData[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = () => {
    setLoading(true);
    const locationNames = getLocationNames();
    const locationsData: LocationData[] = locationNames.map(name => ({
      name,
      characters: getCharactersByLocation(name)
    }));
    setRegisteredLocations(locationsData);
    setLoading(false);
  };

  const handleLocationClick = (location: LocationData) => {
    setSelectedLocation(location);
  };

  const clearSelection = () => {
    setSelectedLocation(null);
  };

  // Refresh when returning to this page
  useEffect(() => {
    const handleFocus = () => {
      loadLocations();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      <div className="max-w-md mx-auto md:max-w-6xl md:px-4">
        <header className="bg-white sticky top-0 z-40 shadow-sm">
          <div className="px-4 py-4">
            {selectedLocation ? (
              <div className="flex items-center gap-2">
                <button onClick={clearSelection} className="text-gray-600 hover:text-gray-900 text-2xl">
                  ←
                </button>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900">{selectedLocation.name}</h1>
                  <p className="text-sm text-gray-500">{selectedLocation.characters.length} character(s)</p>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Rick and Morty</h1>
                <p className="text-sm text-gray-500">Character by Location</p>
              </>
            )}
          </div>
        </header>

        <div className="p-2 md:p-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">Loading...</div>
            </div>
          ) : selectedLocation ? (
            // Show characters for selected location
            <div>
              {selectedLocation.characters.length > 0 ? (
                <div className="space-y-3">
                  {selectedLocation.characters.map((char) => (
                    <Link
                      key={char.characterId}
                      href={`/character/${char.characterId}`}
                      className="block"
                    >
                      <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                          👤
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{char.characterName}</h3>
                          <p className="text-xs text-gray-500">
                            Assigned: {new Date(char.assignedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No characters in this location
                </div>
              )}
            </div>
          ) : registeredLocations.length > 0 ? (
            // Show registered locations list
            <div>
              <p className="text-sm text-gray-500 mb-4">
                {registeredLocations.length} location(s) registered
              </p>
              <div className="space-y-2">
                {registeredLocations.map((location) => (
                  <button
                    key={location.name}
                    onClick={() => handleLocationClick(location)}
                    className="w-full text-left bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{location.name}</h3>
                        <p className="text-sm text-gray-500">
                          {location.characters.length} character(s)
                        </p>
                      </div>
                      <span className="text-gray-400">→</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Empty state - no registered locations
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="text-6xl mb-4">📍</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Locations Yet</h2>
              <p className="text-gray-500 max-w-sm">
                Assign characters to locations from the Character Detail page. 
                Registered locations will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
                