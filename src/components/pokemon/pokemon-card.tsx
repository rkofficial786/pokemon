// components/pokemon/pokemon-card.tsx
import Link from "next/link";
import { useState } from "react";

// Type definitions
interface Pokemon {
  id: number;
  name: string;
  types: string[];
  sprites: {
    front_default: string;
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  weight: number;
  height: number;
  abilities: {
    ability: {
      name: string;
    };
    is_hidden: boolean;
  }[];
}

interface PokemonCardProps {
  pokemon: Pokemon;
}

// Map of Pokemon types to colors
const typeColors: Record<string, string> = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Get primary type and its color
  const mainType = pokemon.types[0] || "normal";
  const backgroundColor = typeColors[mainType] || "#A8A878";

  // Get sprite URL - prioritize official artwork if available
  const spriteUrl =
    pokemon.sprites.other["official-artwork"].front_default ||
    pokemon.sprites.front_default;

  // Format height and weight properly (convert to meters and kg)
  const height = (pokemon.height / 10).toFixed(1);
  const weight = (pokemon.weight / 10).toFixed(1);

  // Get key stats
  const hp = pokemon.stats.find((s) => s.stat.name === "hp")?.base_stat || 0;
  const attack =
    pokemon.stats.find((s) => s.stat.name === "attack")?.base_stat || 0;
  const speed =
    pokemon.stats.find((s) => s.stat.name === "speed")?.base_stat || 0;

  // Format name (capitalize first letter and replace hyphens with spaces)
  const formattedName = pokemon.name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <Link href={`/pokemon/${pokemon.id}`}>
      <div
        className="rounded-xl overflow-hidden bg-gray-800 border border-gray-700 h-full transition-all duration-300 hover:translate-y-[-8px]"
        style={{
          boxShadow: isHovered
            ? `0 10px 15px -3px ${backgroundColor}40`
            : "none",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="h-32 p-4 flex items-center justify-center relative"
          style={{
            background: `linear-gradient(to bottom right, ${backgroundColor}80, ${backgroundColor}20)`,
          }}
        >
          {/* Circular glow behind pokemon */}
          <div
            className="absolute w-24 h-24 rounded-full blur-xl opacity-60"
            style={{ backgroundColor }}
          />

          {/* Pokemon image */}
          <div
            className={`relative z-10 w-24 h-24 transition-transform duration-300 ${
              isHovered ? "scale-110 -rotate-8" : ""
            }`}
          >
            <img
              src={spriteUrl}
              alt={pokemon.name}
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>

          {/* Pokemon ID */}
          <div className="absolute top-2 right-3 text-white/60 font-mono text-sm">
            #{String(pokemon.id).padStart(3, "0")}
          </div>
        </div>

        <div className="p-4">
          {/* Pokemon Name with underline accent matching type color */}
          <h3 className="text-lg font-bold text-center text-gray-100 mb-3 pb-2 relative">
            {formattedName}
            <span
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 w-16 rounded-full"
              style={{ backgroundColor }}
            ></span>
          </h3>

          {/* Pokemon types */}
          <div className="flex justify-center gap-2 mb-3">
            {pokemon.types?.map((type) => (
              <span
                key={type}
                className="px-3 py-1 rounded-full text-white text-xs font-medium capitalize"
                style={{ backgroundColor: typeColors[type] || "#A8A878" }}
              >
                {type}
              </span>
            ))}
          </div>

          {/* Always visible basic stats in a more visually appealing way */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-700/50 rounded-lg p-2 text-center">
              <div className="text-xs text-gray-400">Height</div>
              <div className="font-medium text-gray-200">{height} m</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-2 text-center">
              <div className="text-xs text-gray-400">Weight</div>
              <div className="font-medium text-gray-200">{weight} kg</div>
            </div>
          </div>

          {/* Stats bars revealed on hover */}
        </div>
      </div>
    </Link>
  );
}
