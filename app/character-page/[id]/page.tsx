"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  graphqlClient,
  GET_CHARACTER_BY_ID,
  GET_LOCATIONS,
} from "../../lib/graphql-client";
import {
  assignCharacter,
  getCharacterAssignment,
  removeCharacterAssignment,
  getLocationNames,
} from "../../lib/storage";

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
  const [locationName, setLocationName] = useState("");
  const [assignError, setAssignError] = useState<string | null>(null);
  const [assignSuccess, setAssignSuccess] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState<{
    locationName: string;
  } | null>(null);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [allLocations, setAllLocations] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch all locations once when modal opens
  useEffect(() => {
    if (showAssignModal && allLocations.length === 0) {
      fetchLocations();
    }
  }, [showAssignModal]);

  // Filter suggestions when locationName changes
  useEffect(() => {
    if (locationName.trim()) {
      const filtered = allLocations.filter((loc) =>
        loc.toLowerCase().includes(locationName.toLowerCase()),
      );
      setLocationSuggestions(filtered.slice(0, 5)); // Max 5 suggestions
      setShowSuggestions(true);
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  }, [locationName, allLocations]);

  const fetchLocations = async () => {
    try {
      const data = await graphqlClient.request(GET_LOCATIONS);
      if (data.locations?.results) {
        const names = data.locations.results
          .map((loc: any) => loc.name)
          .filter(Boolean);
        setAllLocations(names);
      }
    } catch (err) {
      console.error("Failed to fetch locations:", err);
    }
  };

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
        setError("Character not found");
      }
    } catch (err) {
      setError("Failed to fetch character details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = () => {
    if (!locationName.trim()) {
      setAssignError("Location name is required");
      return;
    }

    if (!character) return;

    const result = assignCharacter(
      character.id,
      character.name,
      locationName.trim(),
    );

    if (result.success) {
      setAssignSuccess(true);
      setCurrentAssignment({ locationName: locationName.trim() });
      setShowAssignModal(false);
      setLocationName("");
      setAssignError(null);
      setTimeout(() => setAssignSuccess(false), 3000);
    } else {
      setAssignError(result.error || "Failed to assign character");
    }
  };

  const handleRemoveAssignment = () => {
    if (!character) return;
    removeCharacterAssignment(character.id);
    setCurrentAssignment(null);
  };

  const statusColor =
    character?.status === "Alive"
      ? "bg-green-500"
      : character?.status === "Dead"
        ? "bg-red-500"
        : "bg-gray-500";

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
        <div className="text-red-500 mb-4">
          {error || "Character not found"}
        </div>
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
    <main className="min-h-screen bg-gray-50">
      {/* Toast */}
      {assignSuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          Character assigned successfully!
        </div>
      )}

      <div className="w-full px-6 py-6">
        {/* Back */}
        <div className="mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* IMAGE */}
          <div className="relative w-full h-72 lg:h-auto lg:min-h-125 rounded-2xl overflow-hidden bg-gray-200">
            <Image
              src={character.image}
              alt={character.name}
              fill
              className="object-cover"
            />
          </div>

          {/* INFO */}
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                {character.name}
              </h1>

              {currentAssignment && (
                <div className="mb-6 flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
                  📍 Assigned to{" "}
                  <strong>{currentAssignment.locationName}</strong>
                  <button
                    onClick={handleRemoveAssignment}
                    className="ml-2 text-sm underline"
                  >
                    Remove
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6 mb-6">
                {[
                  ["Status", character.status],
                  ["Gender", character.gender],
                  ["Species", character.species],
                  ["Type", character.type || "Unknown"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      {label}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {currentAssignment && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h2 className="font-semibold mb-3">Location</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 uppercase">Origin</p>
                      <p>{character.origin.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase">
                        Current Location
                      </p>
                      <p>{character.location.name}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!currentAssignment && (
              <button
                onClick={() => setShowAssignModal(true)}
                className="w-full mt-6 py-4 bg-indigo-500 text-white rounded-xl text-lg font-semibold hover:bg-indigo-600"
              >
                Assign To Location
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
