import { Pokemon } from "@/types/pokemon";
import Link from "next/link";
import { useState } from "react";

interface PokemonCardProps {
  pokemon: Pokemon;
}

const typeColors: any = {
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

  const mainType: any = pokemon.types[0] || "normal";
  const backgroundColor = typeColors[mainType] || "#A8A878";

  const spriteUrl =
    pokemon.sprites.other["official-artwork"].front_default ||
    pokemon.sprites.front_default;

  const height = (pokemon.height / 10).toFixed(1);
  const weight = (pokemon.weight / 10).toFixed(1);

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
          <div
            className="absolute w-24 h-24 rounded-full blur-xl opacity-60"
            style={{ backgroundColor }}
          />

          <div
            className={`relative z-10 w-24 h-24 transition-transform duration-300 ${
              isHovered ? "scale-180 -rotate-8" : ""
            }`}
          >
            <img
              src={spriteUrl}
              alt={pokemon.name}
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>

          <div className="absolute top-2 right-3 text-white/60 font-mono text-sm">
            #{String(pokemon.id).padStart(3, "0")}
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-bold text-center text-gray-100 mb-3 pb-2 relative">
            {formattedName}
            <span
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 w-16 rounded-full"
              style={{ backgroundColor }}
            ></span>
          </h3>

          <div className="flex justify-center gap-2 mb-3">
            {pokemon.types?.map((type: any) => (
              <span
                key={type}
                className="px-3 py-1 rounded-full text-white text-xs font-medium capitalize"
                style={{ backgroundColor: typeColors[type] || "#A8A878" }}
              >
                {type}
              </span>
            ))}
          </div>

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
        </div>
      </div>
    </Link>
  );
}
