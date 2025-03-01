import React from "react";
import Link from "next/link";
import {
  ArrowsUpDownIcon,
  ScaleIcon,
  FireIcon,
  BoltIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid";
import { formatName } from "@/helpers/helper";
import TopStats from "./top-stats";

interface PokemonStat {
  base_stat: number;
  stat: {
    name: string;
  };
}

interface FeaturedPokemonProps {
  pokemon: {
    id: number;
    name: string;
    type: string;
    bgColor: string;
    sprite: string | null;
    stats: PokemonStat[];
    height: number;
    weight: number;
  };
  isTransitioning: boolean;
}

const FeaturedPokemonCard: React.FC<FeaturedPokemonProps> = ({
  pokemon,
  isTransitioning,
}) => {
  const topStats = [...pokemon.stats]
    .sort((a, b) => b.base_stat - a.base_stat)
    .slice(0, 3);

  return (
    <div
      className={`relative rounded-2xl overflow-hidden transition-opacity duration-500 ${
        isTransitioning ? "opacity-0" : "opacity-100"
      } bg-gradient-to-r ${
        pokemon.bgColor
      } p-4 md:p-8 flex flex-col md:flex-row items-center shadow-xl h-auto md:h-[28rem]`}
    >
      <div className="md:w-1/2 w-full text-white z-10 mb-4 md:mb-0">
        <div className="flex items-center text-white/70 font-mono mb-1">
          <span className="inline-block bg-white/20 px-2 py-1 rounded-md">
            #{String(pokemon.id).padStart(3, "0")}
          </span>
        </div>

        <h3 className="text-3xl md:text-4xl font-bold mb-3 drop-shadow-md">
          {formatName(pokemon.name)}
        </h3>

        <TypeBadges types={pokemon.type} />

        <div className="flex gap-6 my-4">
          <div className="flex items-center">
            <ArrowsUpDownIcon className="w-5 h-5 mr-1 text-white/70" />
            <span className="text-sm">{(pokemon.height / 10).toFixed(1)}m</span>
          </div>
          <div className="flex items-center">
            <ScaleIcon className="w-5 h-5 mr-1 text-white/70" />
            <span className="text-sm">
              {(pokemon.weight / 10).toFixed(1)}kg
            </span>
          </div>
        </div>

        <div className="mb-6">
          <TopStats stats={topStats} />
        </div>

        <Link
          href={`/pokemon/${pokemon.id}`}
          className="px-6 py-3 whitespace-nowrap bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors inline-flex items-center gap-2 group"
        >
          View Details
          <ArrowRightIcon />
        </Link>
      </div>

      <div className="md:w-1/2 flex justify-center">
        <div className="relative w-48 h-48 md:w-60 md:h-60 lg:w-72 lg:h-72">
          {pokemon.sprite ? (
            <img
              src={pokemon.sprite}
              alt={pokemon.name}
              className="w-full h-full drop-shadow-2xl object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/10 rounded-full">
              <p className="text-white">Image unavailable</p>
            </div>
          )}

          <div className="absolute inset-0 rounded-full bg-white/10 blur-3xl -z-10"></div>
        </div>
      </div>
    </div>
  );
};

interface TypeBadgesProps {
  types: string;
}

const TypeBadges: React.FC<TypeBadgesProps> = ({ types }) => {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {types.split("/").map((type) => (
        <span
          key={type}
          className="px-3 py-1 rounded-full bg-black/20 text-white text-sm font-medium capitalize flex items-center gap-1"
        >
          {type === "fire" && <FireIcon className="w-4 h-4" />}
          {type === "electric" && <BoltIcon className="w-4 h-4" />}
          {type}
        </span>
      ))}
    </div>
  );
};

export default FeaturedPokemonCard;
