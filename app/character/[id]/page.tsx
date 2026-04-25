// filepath: app/character/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { graphqlClient, GET_CHARACTER_BY_ID } from '../../lib/graphql-client';
import { 
  assignCharacter, 
  getCharacterAssignment, 
  removeCharacterAssignment,
  getLocationNames 
} from '../../lib/storage';

interface Character {
  id: string;
  name: string;
  image: string;
  status: string;
  species: string;
  gender: string;
  type: string;
  origin: {
    name: string;
    type: string;
  };
  location: {
    name: string;
    type: string;
  };
}

interface CharacterResponse {
  character: Character;
}

export default function CharacterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [assignError, setAssignError] = useState<string | null>(null);
  const [assignSuccess, setAssignSuccess] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState<{locationName: string} | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchCharacter(params.id as string);
    }
  }, [params.id]);

  useEffect(() => {
    // Check if character is already assigned
    if (character) {
      const assignment = getCharacterAssignment(character.id);
      if (assignment) {
        setCurrentAssignment({ locationName: assignment.locationName });
      }
    }
  }, [character]);

  const fetchCharacter = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await graphqlClient.request(GET_CHARACTER_BY_ID, { id });
      if (data.character) {
        setCharacter(data.character);
      } else {
        setError('Character not found');
      }
    } catch (err) {
      setError('Failed to fetch character details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = () => {
    if (!locationName.trim()) {
      setAssignError('Location name is required');
      return;
    }
    
    if (!character) return;
    
    const result = assignCharacter(character.id, character.name, locationName.trim());
    
    if (result.success) {
      setAssignSuccess(true);
      setCurrentAssignment({ locationName: locationName.trim() });
      setShowAssignModal(false);
      setLocationName('');
      setAssignError(null);
      setTimeout(() => setAssignSuccess(false), 3000);
    } else {
      setAssignError(result.error || 'Failed to assign character');
    }
  };

  const handleRemoveAssignment = () => {
    if (!character) return;
    removeCharacterAssignment(character.id);
    setCurrentAssignment(null);
  };

  const statusColor = character?.status === 'Alive' ? 'bg-green-500' : character?.status === 'Dead' ? 'bg-red-500' : 'bg-gray-500';

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </main>
    );
  }

  if (error || !character) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-red-500 mb-4">{error || 'Character not found'}</div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Go Back
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      {/* Success Toast */}
      {assignSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          Character assigned successfully!
        </div>
      )}

      <div className="max-w-md mx-auto md:max-w-4xl">
        {/* Back Button */}
        <div className="p-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <span>←</span>
            <span>Back</span>
          </button>
        </div>

        {/* Character Image */}
        <div className="relative h-64 md:h-96 w-full">
          <Image
            src={character.image}
            alt={character.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Character Info */}
        <div className="p-4 md:p-6">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{character.name}</h1>
            <div className={`w-3 h-3 rounded-full ${statusColor}`} />
          </div>

          {/* Assigned Location Badge */}
          {currentAssignment && (
            <div className="mb-4 flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
              <span>📍 Assigned to: <strong>{currentAssignment.locationName}</strong></span>
              <button 
                onClick={handleRemoveAssignment}
                className="ml-2 text-blue-600 hover:text-blue-800 text-sm underline"
              >
                Remove
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-xs text-gray-500 uppercase">Status</p>
              <p className="font-medium text-gray-900">{character.status}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-xs text-gray-500 uppercase">Species</p>
              <p className="font-medium text-gray-900">{character.species}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-xs text-gray-500 uppercase">Gender</p>
              <p className="font-medium text-gray-900">{character.gender}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-xs text-gray-500 uppercase">Type</p>
              <p className="font-medium text-gray-900">{character.type || 'Unknown'}</p>
            </div>
          </div>

          {/* Location Info */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Location</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Origin</p>
                <p className="font-medium text-gray-900">{character.origin.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Current Location</p>
                <p className="font-medium text-gray-900">{character.location.name}</p>
              </div>
            </div>
          </div>

          {/* Assign Button */}
          {!currentAssignment && (
            <button
              onClick={() => setShowAssignModal(true)}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Assign to Location
            </button>
          )}
        </div>
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Assign Character</h2>
            <p className="text-gray-600 mb-4">
              Assign <strong>{character.name}</strong> to a location
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location Name
              </label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => {
                  setLocationName(e.target.value);
                  setAssignError(null);
                }}
                placeholder="Enter unique location name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {assignError && (
                <p className="text-red-500 text-sm mt-1">{assignError}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setLocationName('');
                  setAssignError(null);
                }}
                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}