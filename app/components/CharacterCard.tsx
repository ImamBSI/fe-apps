// filepath: app/components/CharacterCard.tsx
import Image from 'next/image';
import Link from 'next/link';

interface Character {
  id: string;
  name: string;
  image: string;
  status: string;
  species: string;
  location: {
    name: string;
  };
}

interface CharacterCardProps {
  character: Character;
}

export default function CharacterCard({ character }: CharacterCardProps) {
  const statusColor = character.status === 'Alive' ? 'bg-green-500' : character.status === 'Dead' ? 'bg-red-500' : 'bg-gray-500';

  return (
    <Link href={`/character/${character.id}`} className="block">
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
        <div className="relative aspect-square">
          <Image
            src={character.image}
            alt={character.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${statusColor} border-2 border-white`} />
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-gray-900 truncate text-sm md:text-base">{character.name}</h3>
          <p className="text-xs text-gray-500 truncate">{character.species}</p>
          <p className="text-xs text-gray-400 truncate mt-1">{character.location?.name}</p>
        </div>
      </div>
    </Link>
  );
}