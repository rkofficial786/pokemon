import { Pokemon } from "@/types/pokemon";
import React from "react";

interface PokemonImageSectionProps {
  pokemon: Pokemon;
  typeColor: {
    bg: string;
    text: string;
    light: string;
  };
}

const PokemonImageSection: React.FC<PokemonImageSectionProps> = ({
  pokemon,
  typeColor,
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <MainPokemonImage pokemon={pokemon} typeColor={typeColor} />
      <SpriteGallery pokemon={pokemon} />
    </div>
  );
};

interface MainPokemonImageProps {
  pokemon: Pokemon;
  typeColor: {
    bg: string;
    text: string;
    light: string;
  };
}

const MainPokemonImage: React.FC<MainPokemonImageProps> = ({
  pokemon,
  typeColor,
}) => {
  return (
    <div className="relative w-60 h-60 md:w-80 md:h-80">
      <div
        className={`absolute inset-0 rounded-full opacity-30 blur-3xl ${typeColor.bg}`}
      ></div>
      <img
        src={
          pokemon.sprites?.other?.["official-artwork"]?.front_default ||
          pokemon.sprites?.front_default
        }
        alt={pokemon.name}
        width={300}
        height={300}
        className="object-contain drop-shadow-2xl z-10 relative hover:scale-150 hover:translate-x-8 transition-all ease-in duration-1000"
      />
    </div>
  );
};

interface SpriteGalleryProps {
  pokemon: any;
}

const SpriteGallery: React.FC<SpriteGalleryProps> = ({ pokemon }) => {
  const spriteTypes = [
    { key: "front_default", label: "Front" },
    { key: "back_default", label: "Back" },
    { key: "front_shiny", label: "Shiny" },
    { key: "back_shiny", label: "Shiny Back" },
  ];

  return (
    <div className="grid w-full grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
      {spriteTypes.map(
        (sprite) =>
          pokemon.sprites?.[sprite.key] && (
            <SpriteItem
              key={sprite.key}
              spriteUrl={pokemon.sprites[sprite.key]}
              altText={`${pokemon.name} ${sprite.label}`}
              label={sprite.label}
            />
          )
      )}
    </div>
  );
};

interface SpriteItemProps {
  spriteUrl: string;
  altText: string;
  label: string;
}

const SpriteItem: React.FC<SpriteItemProps> = ({
  spriteUrl,
  altText,
  label,
}) => {
  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-2">
      <div className="w-full sm:w-16 sm:h-16 relative">
        <img
          src={spriteUrl}
          alt={altText}
          className="object-contain w-full h-full"
        />
      </div>
      <p className="text-xs text-center mt-1 text-white/80">{label}</p>
    </div>
  );
};

export default PokemonImageSection;
