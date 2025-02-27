// components/home/catchy-feature.tsx
"use client";

import { useEffect, useState } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection";
import { useAppDispatch } from "@/lib/hooks";
import Link from "next/link";
import {
  HeartIcon,
  BoltIcon,
  ScaleIcon,
  ArrowsUpDownIcon,
  FireIcon,
  SparklesIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/solid";

// Define types for Pokemon data
interface PokemonStat {
  base_stat: number;
  stat: {
    name: string;
  };
}

interface FeaturedPokemon {
  id: number;
  name: string;
  type: string;
  bgColor: string;
  sprite: string | null;
  stats: PokemonStat[];
  height: number;
  weight: number;
  abilities: string[];
}

// Map of types to gradient colors
const typeToColor: Record<string, string> = {
  normal: "from-gray-400 to-gray-500",
  fire: "from-orange-500 to-red-600",
  water: "from-blue-400 to-blue-600",
  electric: "from-yellow-400 to-yellow-500",
  grass: "from-green-400 to-green-600",
  ice: "from-blue-200 to-blue-400",
  fighting: "from-red-600 to-red-800",
  poison: "from-purple-400 to-purple-600",
  ground: "from-yellow-600 to-yellow-800",
  flying: "from-blue-300 to-purple-400",
  psychic: "from-pink-400 to-pink-600",
  bug: "from-green-500 to-green-700",
  rock: "from-yellow-700 to-yellow-900",
  ghost: "from-indigo-400 to-indigo-700",
  dragon: "from-blue-600 to-purple-700",
  dark: "from-gray-700 to-gray-900",
  steel: "from-gray-400 to-gray-600",
  fairy: "from-pink-300 to-pink-500",
};

// Map of stats to icons and colors
const statIcons: Record<string, { icon: React.ElementType; color: string }> = {
  hp: { icon: HeartIcon, color: "#ff5959" },
  attack: { icon: FireIcon, color: "#f5ac78" },
  defense: { icon: ShieldExclamationIcon, color: "#9db7f5" },
  "special-attack": { icon: SparklesIcon, color: "#9499f8" },
  "special-defense": { icon: ShieldExclamationIcon, color: "#a7db8d" },
  speed: { icon: BoltIcon, color: "#fa92b2" },
};

export default function CatchyFeature() {
  const dispatch = useAppDispatch();
  // Popular Pokémon IDs to feature
  const popularPokemonIds = [25, 6, 150, 149, 1, 7, 4, 9, 3, 12, 143, 130, 131];

  const [featuredPokemon, setFeaturedPokemon] = useState<FeaturedPokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVisible, ref] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.2,
  });

  // Fetch featured Pokémon data
  useEffect(() => {
    const fetchFeaturedPokemon = async () => {
      setIsLoading(true);

      try {
        // Get 5 random Pokémon from our popular list
        const shuffled = [...popularPokemonIds].sort(() => 0.5 - Math.random());
        const selectedIds = shuffled.slice(0, 5);

        const pokemonPromises = selectedIds.map(async (id) => {
          const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${id}`
          );
          const data = await response.json();

          // Extract the main type for color selection
          const mainType = data.types[0].type.name;

          return {
            id: data.id,
            name: data.name,
            type: data.types.map((t: any) => t.type.name).join("/"),
            bgColor: typeToColor[mainType] || "from-gray-500 to-gray-700",
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
        // Fallback to default if API fails
        setFeaturedPokemon([
          {
            id: 25,
            name: "pikachu",
            type: "electric",
            bgColor: "from-yellow-400 to-yellow-600",
            sprite: null,
            stats: [],
            height: 4,
            weight: 60,
            abilities: ["static"],
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedPokemon();
  }, []);

  // Auto rotate featured Pokemon
  useEffect(() => {
    if (featuredPokemon.length === 0) return;

    const interval = setInterval(() => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % featuredPokemon.length);
          setIsTransitioning(false);
        }, 500);
      }
    }, 7000); // Increased time to allow users to read the content

    return () => clearInterval(interval);
  }, [featuredPokemon.length, isTransitioning]);

  // Handle empty state or loading
  if (isLoading || featuredPokemon.length === 0) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-100">
            Featured Pokémon
          </h2>

          <div className="max-w-4xl mx-auto relative h-96">
            <div className="absolute inset-0 rounded-2xl overflow-hidden bg-gray-800 animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  const current = featuredPokemon[currentIndex];

  // Format name to capitalize first letter
  const formattedName =
    current.name.charAt(0).toUpperCase() +
    current.name.slice(1).replace(/-/g, " ");

  // Get top stats
  const topStats = current.stats
    .sort((a, b) => b.base_stat - a.base_stat)
    .slice(0, 3);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 mb-12">
          <SparklesIcon className="w-6 h-6 text-yellow-400" />
          <h2 className="text-3xl font-bold text-center text-gray-100">
            Featured Pokémon
          </h2>
          <SparklesIcon className="w-6 h-6 text-yellow-400" />
        </div>

        <div
          //   ref={ref}
          className={`max-w-4xl mx-auto relative h-[28rem] transition-all duration-1000 opacity-100 translate-y-0
          `}
        >
          <div
            className={`absolute inset-0 rounded-2xl overflow-hidden transition-opacity duration-500 ${
              isTransitioning ? "opacity-0" : "opacity-100"
            } bg-gradient-to-r ${
              current.bgColor
            } p-8 flex flex-col md:flex-row items-center shadow-xl`}
          >
            {/* Info Section */}
            <div className="md:w-1/2 text-white z-10">
              <div className="flex items-center text-white/70 font-mono mb-1">
                <span className="inline-block bg-white/20 px-2 py-1 rounded-md">
                  #{String(current.id).padStart(3, "0")}
                </span>
              </div>

              <h3 className="text-4xl font-bold mb-3 drop-shadow-md">
                {formattedName}
              </h3>

              <div className="mb-4 flex flex-wrap gap-2">
                {current.type.split("/").map((type) => (
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

              {/* Physical attributes */}
              <div className="flex gap-6 mb-6">
                <div className="flex items-center">
                  <ArrowsUpDownIcon className="w-5 h-5 mr-1 text-white/70" />
                  <span className="text-sm">
                    {(current.height / 10).toFixed(1)}m
                  </span>
                </div>
                <div className="flex items-center">
                  <ScaleIcon className="w-5 h-5 mr-1 text-white/70" />
                  <span className="text-sm">
                    {(current.weight / 10).toFixed(1)}kg
                  </span>
                </div>
              </div>

              {/* Top Stats */}
              <div className="mb-6 space-y-2">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">
                  Top Stats
                </h4>
                {topStats.map((stat) => {
                  const { icon: Icon, color } = statIcons[stat.stat.name] || {
                    icon: SparklesIcon,
                    color: "#ffffff",
                  };

                  return (
                    <div
                      key={stat.stat.name}
                      className="flex items-center gap-2"
                    >
                      <Icon className="w-4 h-4" style={{ color }} />
                      <div className="capitalize text-sm">
                        {stat.stat.name.replace("-", " ")}:
                      </div>
                      <div className="font-bold">{stat.base_stat}</div>
                      <div className="flex-1 h-1.5 bg-black/30 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              (stat.base_stat / 150) * 100
                            )}%`,
                            backgroundColor: color,
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

            

              <Link
                href={`/pokemon/${current.id}`}
                className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors inline-flex items-center gap-2 group"
              >
                View Details
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>

            {/* Image Section */}
            <div className="md:w-1/2 flex justify-center mt-6 md:mt-0">
              <div className="relative w-60 h-60 md:w-72 md:h-72">
                {current.sprite && (
                  <img
                    src={current.sprite}
                    alt={current.name}
                    className="w-full h-full drop-shadow-2xl object-contain"
                  />
                )}

                {!current.sprite && (
                  <div className="w-full h-full flex items-center justify-center bg-white/10 rounded-full">
                    <p className="text-white">Image unavailable</p>
                  </div>
                )}

                {/* Spotlight effect */}
                <div className="absolute inset-0 rounded-full bg-white/10 blur-3xl -z-10"></div>
              </div>
            </div>

            {/* Decorative Pokeball background */}
            <div className="absolute right-0 bottom-0 w-72 h-72 opacity-10">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full fill-current text-white"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="5"
                  fill="none"
                />
                <line
                  x1="5"
                  y1="50"
                  x2="95"
                  y2="50"
                  stroke="currentColor"
                  strokeWidth="5"
                />
                <circle cx="50" cy="50" r="15" />
              </svg>
            </div>

            {/* Decorative pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-5 left-5 w-20 h-20 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-20 right-5 w-16 h-16 border-2 border-white rounded-full"></div>
              <div className="absolute top-1/4 right-1/4 w-12 h-12 border-2 border-white rounded-full"></div>
            </div>
          </div>

          {/* Navigation dots */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
            {featuredPokemon.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isTransitioning) {
                    setIsTransitioning(true);
                    setTimeout(() => {
                      setCurrentIndex(index);
                      setIsTransitioning(false);
                    }, 500);
                  }
                }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? "bg-red-500" : "bg-gray-700"
                } hover:bg-red-400`}
                aria-label={`View Pokémon ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
