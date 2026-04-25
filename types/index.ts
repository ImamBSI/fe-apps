export interface Character {
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

export interface CharactersResponse {
  characters: {
    info: {
      pages: number;
      next: number | null;
      prev: number | null;
    };
    results: Character[];
  };
}