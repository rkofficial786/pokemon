"use client";

import { useEffect, useState } from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";
import LoadingSkeleton from "./loading-skeleton";
import FeaturedPokemonCard from "./card";

import { Pokemon } from "@/types/pokemon";
import { typeToColorFeatured } from "@/app/constants/colors";
import { useAppDispatch } from "@/lib/hooks";
import { getPokemonById } from "@/lib/features/pokemon";

const Featured = () => {
  const dispatch = useAppDispatch();
  const popularPokemonIds = [25, 6, 150, 149, 1];

  const [featuredPokemon, setFeaturedPokemon] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const fetchFeaturedPokemon = async () => {
      setIsLoading(true);

      try {
        const pokemonPromises = popularPokemonIds.map(async (id) => {
          const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${id}`
          );
          // const { payload } = await dispatch(getPokemonById(id));
          // console.log(payload,"payload id ka h");

          // const data = payload;
          const data = await response.json();

          // Extract the main type for color selection
          const mainType = data.types[0].type.name;

          return {
            id: data.id,
            name: data.name,
            type: data.types.map((t: any) => t.type.name).join("/"),
            bgColor:
              typeToColorFeatured[mainType] || "from-gray-500 to-gray-700",
            sprite: data.sprites.other["official-artwork"].front_default,
            stats: data.stats,
            height: data.height,
            weight: data.weight,
            abilities: data.abilities.map((a: any) => a.ability.name),
          };
        });

        const results = await Promise.all(pokemonPromises);
        setFeaturedPokemon(results);
      } catch (error) {
        console.error("Error fetching featured Pokémon:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedPokemon();
  }, []);

  useEffect(() => {
    if (featuredPokemon.length <= 1) return;

    const interval = setInterval(() => {
      if (!isTransitioning) {
        handlePokemonChange((currentIndex + 1) % featuredPokemon.length);
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [featuredPokemon.length, currentIndex, isTransitioning]);

  const handlePokemonChange = (newIndex: number) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <section className="py-8 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 mb-8 md:mb-12">
          <SparklesIcon className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-100">
            Featured Pokémon
          </h2>
          <SparklesIcon className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
        </div>

        {isLoading || featuredPokemon.length === 0 ? (
          <LoadingSkeleton height="h-96" />
        ) : (
          <div className="max-w-4xl mx-auto relative">
            <FeaturedPokemonCard
              pokemon={featuredPokemon[currentIndex]}
              isTransitioning={isTransitioning}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Featured;
