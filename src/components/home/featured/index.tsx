"use client";

import { useEffect, useState } from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";
import LoadingSkeleton from "./loading-skeleton";
import FeaturedPokemonCard from "./card";

import { Pokemon } from "@/types/pokemon";
import { typeToColorFeatured } from "@/constants/colors";
import { useAppDispatch } from "@/lib/hooks";
import { getPokemonById } from "@/lib/features/pokemon";

const Featured = () => {
  const dispatch = useAppDispatch();
  const [randomPokemonIds, setRandomPokemonIds] = useState<number[]>([]);

  const [featuredPokemon, setFeaturedPokemon] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Generate 10 random Pokémon IDs between 1 and 1000
  useEffect(() => {
    const generateRandomIds = () => {
      const ids: number[] = [];
      while (ids.length < 10) {
        const randomId = Math.floor(Math.random() * 1000) + 1;
        if (!ids.includes(randomId)) {
          ids.push(randomId);
        }
      }
      return ids;
    };

    setRandomPokemonIds(generateRandomIds());
  }, []);

  useEffect(() => {
    const fetchFeaturedPokemon = async () => {
      if (randomPokemonIds.length === 0) return;
      
      setIsLoading(true);

      try {
        const pokemonPromises = randomPokemonIds.map(async (id) => {
          try {
            const { payload: data } = await dispatch(getPokemonById(id));
            
            if (!data || !data.types || !data.types[0]) {
              return null;
            }

            const mainType = data.types[0].type.name;

            return {
              id: data.id,
              name: data.name,
              type: data.types.map((t: any) => t.type.name).join("/"),
              bgColor:
                typeToColorFeatured[mainType] || "from-gray-500 to-gray-700",
              sprite: data.sprites?.other?.["official-artwork"]?.front_default || data.sprites?.front_default,
              stats: data.stats,
              height: data.height,
              weight: data.weight,
              abilities: data.abilities?.map((a: any) => a.ability.name) || [],
            };
          } catch (error) {
            console.error(`Error fetching Pokémon ID ${id}:`, error);
            return null;
          }
        });

        const results = await Promise.all(pokemonPromises);
        const validResults = results.filter(result => result !== null);
        setFeaturedPokemon(validResults);
      } catch (error) {
        console.error("Error fetching featured Pokémon:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedPokemon();
  }, [randomPokemonIds, dispatch]);

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
    <section id="featured" className="py-8 md:py-16">
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
            
            <div className="flex justify-center mt-4 gap-2">
              {featuredPokemon.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePokemonChange(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentIndex ? "bg-yellow-400" : "bg-gray-600"
                  } transition-colors`}
                  aria-label={`View Pokémon ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Featured;