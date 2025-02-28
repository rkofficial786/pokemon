import React from "react";
import { ArrowsUpDownIcon, ScaleIcon } from "@heroicons/react/24/solid";
import { formatId, formatName } from "@/app/helpers/helper";
import TypeBadges from "./type-badge";
import InfoCard from "./info-card";
import AbilitiesCard from "./abilities-card";
import { Pokemon } from "@/types/pokemon";

interface PokemonInfoSectionProps {
  pokemon: Pokemon;
  typeColor: {
    bg: string;
    text: string;
    light: string;
  };
}

const PokemonInfoSection: React.FC<PokemonInfoSectionProps> = ({
  pokemon,
  typeColor,
}) => {
  return (
    <div className="text-white">
      <PokemonNameHeader pokemon={pokemon} />
      <TypeBadges types={pokemon.types} />
      <BasicInfoGrid pokemon={pokemon} />
      <SpeciesInfo pokemon={pokemon} />
    </div>
  );
};

interface PokemonNameHeaderProps {
  pokemon: any;
}

const PokemonNameHeader: React.FC<PokemonNameHeaderProps> = ({ pokemon }) => {
  return (
    <div className="flex items-center gap-4 mb-2">
      <div className="px-3 py-1 bg-white/20 rounded-full text-sm font-mono">
        #{formatId(pokemon.id)}
      </div>
      <h1 className="text-4xl md:text-5xl font-bold capitalize">
        {formatName(pokemon.name)}
      </h1>
    </div>
  );
};

interface BasicInfoGridProps {
  pokemon: Pokemon;
}

const BasicInfoGrid: React.FC<BasicInfoGridProps> = ({ pokemon }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <InfoCard
        icon={<ArrowsUpDownIcon className="w-4 h-4" />}
        label="Height"
        value={`${(pokemon.height / 10).toFixed(1)}m`}
      />
      <InfoCard
        icon={<ScaleIcon className="w-4 h-4" />}
        label="Weight"
        value={`${(pokemon.weight / 10).toFixed(1)}kg`}
      />
      <InfoCard label="Base Exp." value={pokemon.base_experience || "—"} />
      <AbilitiesCard abilities={pokemon.abilities} />
    </div>
  );
};

interface SpeciesInfoProps {
  pokemon: any;
}

const SpeciesInfo: React.FC<SpeciesInfoProps> = ({ pokemon }) => {
  if (!pokemon.species) return null;

  return (
    <div className="bg-black/20 backdrop-blur-sm p-4 rounded-lg mb-4">
      <p className="italic text-white/90">
        {pokemon.species.flavor_text ||
          `${formatName(pokemon.name)} is a ${pokemon.types
            .map((t: any) => t.type.name)
            .join("/")} type Pokémon introduced in Generation I.`}
      </p>
    </div>
  );
};

export default PokemonInfoSection;
