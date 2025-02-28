import React from "react";
import { Pokemon } from "@/types/pokemon";
import PokemonCard from "./pokemon-card";
import LoadingSkeleton from "@/components/ui/loading-skeleton";

interface PokemonGridProps {
  pokemon: Pokemon[];
  isLoading: boolean;
  skeletonCount: number;
  skeletonStartIndex: number;
}

const Grid = ({
  pokemon,
  isLoading,
  skeletonCount,
  skeletonStartIndex,
}: PokemonGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {pokemon.map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}

      {isLoading && (
        <LoadingSkeleton
          count={skeletonCount}
          startIndex={skeletonStartIndex}
        />
      )}
    </div>
  );
};
export default Grid;
