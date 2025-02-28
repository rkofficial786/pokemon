import React from "react";
import PokemonImageSection from "./image";
import PokemonInfoSection from "./info";
import { Pokemon } from "@/types/pokemon";

interface PokemonDetailHeaderProps {
  pokemon: Pokemon;
  typeColor: {
    bg: string;
    text: string;
    light: string;
  };
}

const PokemonDetailHeader: React.FC<PokemonDetailHeaderProps> = ({
  pokemon,
  typeColor,
}) => {
  return (
    <div
      className={`rounded-2xl overflow-hidden shadow-xl mb-8 ${typeColor.light}`}
    >
      <div className="p-8 relative overflow-hidden">
        <BackgroundPattern />

        <div className="grid md:grid-cols-2 gap-8 relative z-10">
          <PokemonImageSection pokemon={pokemon} typeColor={typeColor} />

          <PokemonInfoSection pokemon={pokemon} typeColor={typeColor} />
        </div>
      </div>
    </div>
  );
};

const BackgroundPattern: React.FC = () => {
  return (
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-5 right-5 w-40 h-40 rounded-full border-8 border-white/30"></div>
      <div className="absolute bottom-5 left-5 w-20 h-20 rounded-full border-4 border-white/20"></div>
      <div className="absolute top-1/4 left-1/3 w-16 h-16 rounded-full border-2 border-white/20"></div>
    </div>
  );
};

export default PokemonDetailHeader;
