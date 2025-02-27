// app/pokemon/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getPokemonById } from "@/lib/features/pokemon";
import Image from "next/image";
import {
  HeartIcon,
  BoltIcon,
  ShieldExclamationIcon,
  FireIcon,
  SparklesIcon,
  ArrowLeftIcon,
  ScaleIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/solid";
import LoadingSkeleton from "@/components/ui/loading-skeleton";

// Type mapping for backgrounds and colors
const typeToColor: Record<string, { bg: string; text: string; light: string }> =
  {
    normal: {
      bg: "bg-gray-400",
      text: "text-gray-800",
      light: "bg-gray-400/20",
    },
    fire: {
      bg: "bg-orange-500",
      text: "text-orange-600",
      light: "bg-orange-500/20",
    },
    water: {
      bg: "bg-blue-500",
      text: "text-blue-600",
      light: "bg-blue-500/20",
    },
    electric: {
      bg: "bg-yellow-400",
      text: "text-yellow-600",
      light: "bg-yellow-400/20",
    },
    grass: {
      bg: "bg-green-500",
      text: "text-green-600",
      light: "bg-green-500/20",
    },
    ice: { bg: "bg-blue-200", text: "text-blue-700", light: "bg-blue-200/20" },
    fighting: {
      bg: "bg-red-600",
      text: "text-red-700",
      light: "bg-red-600/20",
    },
    poison: {
      bg: "bg-purple-500",
      text: "text-purple-700",
      light: "bg-purple-500/20",
    },
    ground: {
      bg: "bg-yellow-600",
      text: "text-yellow-700",
      light: "bg-yellow-600/20",
    },
    flying: {
      bg: "bg-indigo-300",
      text: "text-indigo-700",
      light: "bg-indigo-300/20",
    },
    psychic: {
      bg: "bg-pink-500",
      text: "text-pink-700",
      light: "bg-pink-500/20",
    },
    bug: { bg: "bg-lime-500", text: "text-lime-700", light: "bg-lime-500/20" },
    rock: {
      bg: "bg-yellow-700",
      text: "text-yellow-800",
      light: "bg-yellow-700/20",
    },
    ghost: {
      bg: "bg-purple-700",
      text: "text-purple-800",
      light: "bg-purple-700/20",
    },
    dragon: {
      bg: "bg-indigo-600",
      text: "text-indigo-800",
      light: "bg-indigo-600/20",
    },
    dark: { bg: "bg-gray-700", text: "text-gray-800", light: "bg-gray-700/20" },
    steel: {
      bg: "bg-gray-400",
      text: "text-gray-700",
      light: "bg-gray-400/20",
    },
    fairy: {
      bg: "bg-pink-300",
      text: "text-pink-700",
      light: "bg-pink-300/20",
    },
  };

// Map stats to icons
const statIcons = {
  hp: HeartIcon,
  attack: FireIcon,
  defense: ShieldExclamationIcon,
  "special-attack": SparklesIcon,
  "special-defense": ShieldExclamationIcon,
  speed: BoltIcon,
};

const PokemonDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedPokemon, isLoading, error } = useAppSelector(
    (state) => state.pokemon
  );
  const [activeTab, setActiveTab] = useState("stats");

  useEffect(() => {
    if (id) {
      dispatch(getPokemonById(id));
    }
  }, [dispatch, id]);

  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

  // Format the Pokemon ID with leading zeros
  const formatId = (id: number) => {
    return String(id).padStart(3, "0");
  };

  // Format name (capitalize first letter and replace hyphens with spaces)
  const formatName = (name: string) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <LoadingSkeleton variant="detail" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-red-900/30 border border-red-700 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-2">
            Error Loading Pokémon
          </h2>
          <p className="text-gray-300 mb-4">{error.toString()}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!selectedPokemon) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-100 mb-2">
            Pokemon Not Found
          </h2>
          <p className="text-gray-400 mb-4">
            The Pokémon you're looking for doesn't exist or hasn't been loaded
            yet.
          </p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Get primary type and its color
  const mainType = selectedPokemon.types[0]?.type?.name || "normal";
  const typeColor = typeToColor[mainType] || typeToColor.normal;

  // Get the evolution chain if available
  const evolutionChain = selectedPokemon.evolution_chain || [];

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center text-gray-300 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Pokédex
        </button>

        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div
            className={`rounded-2xl overflow-hidden shadow-xl mb-8 ${typeColor.light}`}
          >
            <div className="p-8 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-5 right-5 w-40 h-40 rounded-full border-8 border-white/30"></div>
                <div className="absolute bottom-5 left-5 w-20 h-20 rounded-full border-4 border-white/20"></div>
                <div className="absolute top-1/4 left-1/3 w-16 h-16 rounded-full border-2 border-white/20"></div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 relative z-10">
                {/* Image Section */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-60 h-60 md:w-80 md:h-80">
                    <div
                      className={`absolute inset-0 rounded-full opacity-30 blur-3xl ${typeColor.bg}`}
                    ></div>
                    <img
                      src={
                        selectedPokemon.sprites?.other?.["official-artwork"]
                          ?.front_default ||
                        selectedPokemon.sprites?.front_default
                      }
                      alt={selectedPokemon.name}
                      width={300}
                      height={300}
                      className="object-contain drop-shadow-2xl z-10 relative"
                    />
                  </div>

                  {/* Sprite Gallery */}
                  <div className="flex gap-4 mt-6">
                    {[
                      { key: "front_default", label: "Front" },
                      { key: "back_default", label: "Back" },
                      { key: "front_shiny", label: "Shiny" },
                      { key: "back_shiny", label: "Shiny Back" },
                    ].map(
                      (sprite) =>
                        selectedPokemon.sprites?.[sprite.key] && (
                          <div
                            key={sprite.key}
                            className="bg-black/20 backdrop-blur-sm rounded-lg p-2"
                          >
                            <div className="w-16 h-16 relative">
                              <img
                                src={selectedPokemon.sprites[sprite.key]}
                                alt={`${selectedPokemon.name} ${sprite.label}`}
                                className="object-contain"
                              />
                            </div>
                            <p className="text-xs text-center mt-1 text-white/80">
                              {sprite.label}
                            </p>
                          </div>
                        )
                    )}
                  </div>
                </div>

                {/* Info Section */}
                <div className="text-white">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="px-3 py-1 bg-white/20 rounded-full text-sm font-mono">
                      #{formatId(selectedPokemon.id)}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold capitalize">
                      {formatName(selectedPokemon.name)}
                    </h1>
                  </div>

                  {/* Pokemon Types */}
                  <div className="flex gap-3 my-4">
                    {selectedPokemon.types.map((typeInfo) => (
                      <span
                        key={typeInfo.type.name}
                        className={`px-4 py-2 rounded-full text-white text-sm font-semibold capitalize ${
                          typeToColor[typeInfo.type.name]?.bg || "bg-gray-600"
                        }`}
                      >
                        {typeInfo.type.name}
                      </span>
                    ))}
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-black/20 backdrop-blur-sm p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-white/70 mb-1">
                        <ArrowsUpDownIcon className="w-4 h-4" />
                        <span>Height</span>
                      </div>
                      <div className="text-xl font-semibold">
                        {(selectedPokemon.height / 10).toFixed(1)}m
                      </div>
                    </div>
                    <div className="bg-black/20 backdrop-blur-sm p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-white/70 mb-1">
                        <ScaleIcon className="w-4 h-4" />
                        <span>Weight</span>
                      </div>
                      <div className="text-xl font-semibold">
                        {(selectedPokemon.weight / 10).toFixed(1)}kg
                      </div>
                    </div>
                    <div className="bg-black/20 backdrop-blur-sm p-4 rounded-lg">
                      <div className="text-white/70 mb-1">Base Exp.</div>
                      <div className="text-xl font-semibold">
                        {selectedPokemon.base_experience}
                      </div>
                    </div>
                    <div className="bg-black/20 backdrop-blur-sm p-4 rounded-lg">
                      <div className="text-white/70 mb-1">Abilities</div>
                      <div className="text-sm">
                        {selectedPokemon.abilities.map((ability, index) => (
                          <span key={ability.ability.name}>
                            {formatName(ability.ability.name)}
                            {ability.is_hidden && (
                              <span className="ml-1 opacity-70">(Hidden)</span>
                            )}
                            {index < selectedPokemon.abilities.length - 1
                              ? ", "
                              : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Species Info - If available */}
                  {selectedPokemon.species && (
                    <div className="bg-black/20 backdrop-blur-sm p-4 rounded-lg mb-4">
                      <p className="italic text-white/90">
                        {selectedPokemon.species.flavor_text ||
                          `${formatName(
                            selectedPokemon.name
                          )} is a ${selectedPokemon.types
                            .map((t) => t.type.name)
                            .join(
                              "/"
                            )} type Pokémon introduced in Generation I.`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {/* Tabs Navigation */}
            <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-700">
              {[
                { id: "stats", label: "Stats" },
                { id: "abilities", label: "Abilities" },
                { id: "moves", label: "Moves" },
                { id: "evolution", label: "Evolution" },
                { id: "locations", label: "Locations" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? `${typeColor.text} border-b-2 border-current`
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tabs Content */}
            <div className="p-6">
              {/* Stats Tab */}
              {activeTab === "stats" && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-100">
                    Base Stats
                  </h3>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Stat Bars */}
                    <div className="space-y-4">
                      {selectedPokemon.stats.map((stat) => {
                        const StatIcon =
                          statIcons[stat.stat.name as keyof typeof statIcons] ||
                          SparklesIcon;

                        return (
                          <div key={stat.stat.name} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <StatIcon className="w-5 h-5 text-gray-400" />
                                <span className="font-medium text-gray-200 capitalize">
                                  {stat.stat.name.replace("-", " ")}
                                </span>
                              </div>
                              <span className="font-mono text-gray-300">
                                {stat.base_stat}
                              </span>
                            </div>
                            <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${typeColor.bg}`}
                                style={{
                                  width: `${Math.min(
                                    100,
                                    (stat.base_stat / 255) * 100
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}

                      {/* Total Stats */}
                      <div className="pt-4 border-t border-gray-700">
                        <div className="flex justify-between font-bold">
                          <span className="text-gray-200">Total</span>
                          <span className="font-mono text-gray-300">
                            {selectedPokemon.stats.reduce(
                              (sum, stat) => sum + stat.base_stat,
                              0
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stat Chart - Would be implemented with a radar chart in a real app */}
                    <div className="flex flex-col items-center justify-center bg-gray-900/50 rounded-lg p-4">
                      <h4 className="text-gray-300 mb-4">Stat Distribution</h4>
                      <div className="relative w-full h-60 flex items-center justify-center">
                        <div className="text-gray-500 text-lg">
                          Radar chart would go here
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Type Effectiveness */}
                  <div className="mt-8 pt-6 border-t border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-100 mb-4">
                      Type Effectiveness
                    </h3>
                    <p className="text-gray-400 mb-4">
                      How other types affect this Pokémon based on its typing.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* This would be populated based on type calculations in a real app */}
                      <div className="bg-gray-900/50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-300 mb-2">
                          Weak To (2×)
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {/* Example types */}
                          <span className="px-2 py-1 bg-red-600 rounded-full text-xs text-white">
                            fire
                          </span>
                        </div>
                      </div>

                      <div className="bg-gray-900/50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-300 mb-2">
                          Resistant To (½×)
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {/* Example types */}
                          <span className="px-2 py-1 bg-blue-600 rounded-full text-xs text-white">
                            water
                          </span>
                        </div>
                      </div>

                      <div className="bg-gray-900/50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-300 mb-2">
                          Immune To (0×)
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {/* Example types */}
                          <span className="px-2 py-1 bg-purple-600 rounded-full text-xs text-white">
                            ghost
                          </span>
                        </div>
                      </div>

                      <div className="bg-gray-900/50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-300 mb-2">
                          Normal Damage (1×)
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {/* Example types */}
                          <span className="px-2 py-1 bg-gray-600 rounded-full text-xs text-white">
                            normal
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Abilities Tab */}
              {activeTab === "abilities" && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-100 mb-6">
                    Abilities
                  </h3>

                  <div className="grid gap-6">
                    {selectedPokemon.abilities.map((ability) => (
                      <div
                        key={ability.ability.name}
                        className="bg-gray-900/50 rounded-lg p-6"
                      >
                        <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                          <h4 className="text-xl font-bold text-gray-100 capitalize">
                            {formatName(ability.ability.name)}
                          </h4>

                          {ability.is_hidden && (
                            <span className="px-3 py-1 bg-purple-900/50 text-purple-300 text-xs rounded-full">
                              Hidden Ability
                            </span>
                          )}
                        </div>

                        <p className="text-gray-300">
                          {/* This would come from additional API calls in a real implementation */}
                          This ability allows the Pokémon to perform special
                          actions based on its type and characteristics.
                        </p>

                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <h5 className="font-medium text-gray-400 mb-2">
                            Pokémon with this ability:
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {/* This would be populated from additional API calls */}
                            <span className="px-3 py-1 bg-gray-800 rounded-lg text-sm text-gray-300">
                              {formatName(selectedPokemon.name)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Moves Tab */}
              {activeTab === "moves" && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-100 mb-4">
                    Moves
                  </h3>

                  <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                    {["All", "Level Up", "TM/HM", "Egg", "Tutor"].map(
                      (category) => (
                        <button
                          key={category}
                          className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                            category === "All"
                              ? `${typeColor.bg} text-white`
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          }`}
                        >
                          {category}
                        </button>
                      )
                    )}
                  </div>

                  <div className="relative overflow-x-auto rounded-lg">
                    <table className="w-full text-left text-gray-300">
                      <thead className="text-xs uppercase bg-gray-700 text-gray-300">
                        <tr>
                          <th className="px-6 py-3">Name</th>
                          <th className="px-6 py-3">Type</th>
                          <th className="px-6 py-3">Category</th>
                          <th className="px-6 py-3">Power</th>
                          <th className="px-6 py-3">PP</th>
                          <th className="px-6 py-3">Accuracy</th>
                          <th className="px-6 py-3">Method</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPokemon.moves
                          .slice(0, 10)
                          .map((moveInfo, index) => (
                            <tr
                              key={moveInfo.move.name}
                              className={
                                index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                              }
                            >
                              <td className="px-6 py-4 font-medium capitalize">
                                {formatName(moveInfo.move.name)}
                              </td>
                              <td className="px-6 py-4">
                                {/* This would come from additional API calls */}
                                <span
                                  className={`px-2 py-1 rounded-full text-xs text-white ${typeColor.bg}`}
                                >
                                  {mainType}
                                </span>
                              </td>
                              <td className="px-6 py-4">Physical</td>
                              <td className="px-6 py-4">60</td>
                              <td className="px-6 py-4">20</td>
                              <td className="px-6 py-4">95%</td>
                              <td className="px-6 py-4">
                                {moveInfo.version_group_details[0]
                                  ?.move_learn_method?.name === "level-up"
                                  ? `Level ${moveInfo.version_group_details[0]?.level_learned_at}`
                                  : formatName(
                                      moveInfo.version_group_details[0]
                                        ?.move_learn_method?.name || "unknown"
                                    )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {selectedPokemon.moves.length > 10 && (
                    <div className="text-center mt-6">
                      <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
                        Show More Moves ({selectedPokemon.moves.length - 10}{" "}
                        remaining)
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Evolution Tab */}
              {activeTab === "evolution" && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-100 mb-6">
                    Evolution Chain
                  </h3>

                  {evolutionChain.length > 0 ? (
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                      {/* This would be populated from additional API calls in a real implementation */}
                      <div className="flex items-center">
                        <div className="text-center">
                          <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-2"></div>
                          <p className="text-gray-300">Base Form</p>
                        </div>

                        <div className="mx-4 text-gray-500">→</div>

                        <div className="text-center">
                          <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-2"></div>
                          <p className="text-gray-300">Stage 1</p>
                        </div>

                        <div className="mx-4 text-gray-500">→</div>

                        <div className="text-center">
                          <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-2"></div>
                          <p className="text-gray-300">Stage 2</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-900/50 rounded-lg p-6 text-center">
                      <p className="text-gray-400">
                        This Pokémon does not evolve or evolution data is
                        unavailable.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Locations Tab */}
              {activeTab === "locations" && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-100 mb-6">
                    Encounter Locations
                  </h3>

                  <div className="bg-gray-900/50 rounded-lg p-6 text-center">
                    <p className="text-gray-400">
                      Location data would be displayed here.
                    </p>
                    <p className="text-gray-500 mt-2">
                      This would be populated from additional API calls in a
                      real implementation.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetailPage;
