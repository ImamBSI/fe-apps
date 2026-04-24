// filepath: app/lib/storage.ts
// Local storage helper for persisting character-location assignments

const STORAGE_KEY = 'rickmorty_assignments';

export interface CharacterAssignment {
  characterId: string;
  characterName: string;
  locationName: string;
  assignedAt: string;
}

export interface LocationData {
  name: string;
  characters: CharacterAssignment[];
}

// Get all assignments from storage
export function getAssignments(): CharacterAssignment[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// Save assignments to storage
export function saveAssignments(assignments: CharacterAssignment[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
}

// Get all unique location names
export function getLocationNames(): string[] {
  const assignments = getAssignments();
  const locations = new Set(assignments.map(a => a.locationName));
  return Array.from(locations).sort();
}

// Get characters by location name
export function getCharactersByLocation(locationName: string): CharacterAssignment[] {
  const assignments = getAssignments();
  return assignments.filter(a => a.locationName === locationName);
}

// Check if location name already exists
export function locationExists(locationName: string): boolean {
  const locations = getLocationNames();
  return locations.some(l => l.toLowerCase() === locationName.toLowerCase());
}

// Assign character to location
export function assignCharacter(
  characterId: string,
  characterName: string,
  locationName: string
): { success: boolean; error?: string } {
  const assignments = getAssignments();
  
  // Check if character already assigned
  const existingAssignment = assignments.find(a => a.characterId === characterId);
  if (existingAssignment) {
    return { success: false, error: 'Character already assigned to a location' };
  }
  
  // Check if location name is unique (case-insensitive)
  const locationExists = assignments.some(
    a => a.locationName.toLowerCase() === locationName.toLowerCase()
  );
  
  const newAssignment: CharacterAssignment = {
    characterId,
    characterName,
    locationName: locationName.trim(),
    assignedAt: new Date().toISOString(),
  };
  
  assignments.push(newAssignment);
  saveAssignments(assignments);
  
  return { success: true };
}

// Remove character from location
export function removeCharacterAssignment(characterId: string): void {
  const assignments = getAssignments();
  const filtered = assignments.filter(a => a.characterId !== characterId);
  saveAssignments(filtered);
}

// Get character assignment if exists
export function getCharacterAssignment(characterId: string): CharacterAssignment | undefined {
  const assignments = getAssignments();
  return assignments.find(a => a.characterId === characterId);
}