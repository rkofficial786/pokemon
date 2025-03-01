import { formatName } from "@/helpers/helper";
import { AbilityInfo } from "@/types/pokemon";
import React, { useState, useEffect } from "react";

interface AbilitiesTabProps {
  pokemon: any;
}

const AbilitiesTab: React.FC<AbilitiesTabProps> = ({ pokemon }) => {
  const [abilitiesWithDetails, setAbilitiesWithDetails] = useState<
    AbilityInfo[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAbilityDetails = async () => {
      if (!pokemon?.abilities?.length) return;

      setIsLoading(true);

      try {
        const updatedAbilities = [...pokemon.abilities];

        await Promise.all(
          updatedAbilities.map(async (ability, index) => {
            try {
              const response = await fetch(ability.ability.url);
              const data = await response.json();

              updatedAbilities[index] = {
                ...ability,
                details: {
                  id: data.id,
                  name: data.name,
                  effect_entries: data.effect_entries,
                  pokemon: data.pokemon.slice(0, 6),
                },
              };
            } catch (error) {
              console.error(
                `Failed to fetch details for ${ability.ability.name}:`,
                error
              );
            }
          })
        );

        setAbilitiesWithDetails(updatedAbilities);
      } catch (error) {
        console.error("Error fetching ability details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAbilityDetails();
  }, [pokemon?.abilities]);

  const getAbilityDescription = (ability: AbilityInfo) => {
    if (!ability.details) return null;

    const englishEntry = ability.details.effect_entries.find(
      (entry) => entry.language.name === "en"
    );

    return englishEntry?.effect || "No description available.";
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-100 mb-6">Abilities</h3>

      {isLoading && abilitiesWithDetails.length === 0 ? (
        <div className="flex justify-center p-8">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          {abilitiesWithDetails.map((ability) => (
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
                {ability.details ? (
                  getAbilityDescription(ability)
                ) : (
                  <div className="w-full h-4 bg-gray-700 rounded animate-pulse mb-2"></div>
                )}
              </p>

              {ability.details && ability.details.pokemon.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <h5 className="font-medium text-gray-400 mb-2">
                    Other Pokémon with this ability:
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {ability.details.pokemon
                      .filter((p) => p.pokemon.name !== pokemon.name)
                      .slice(0, 5)
                      .map((p) => (
                        <span
                          key={p.pokemon.name}
                          className="px-3 py-1 bg-gray-800 rounded-lg text-sm text-gray-300"
                        >
                          {formatName(p.pokemon.name)}
                        </span>
                      ))}

                    {ability.details.pokemon.length > 6 && (
                      <span className="px-3 py-1 bg-gray-800 rounded-lg text-sm text-gray-400">
                        +{ability.details.pokemon.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!isLoading && abilitiesWithDetails.length === 0 && (
        <div className="bg-gray-900/50 rounded-lg p-6 text-center">
          <p className="text-gray-400">No abilities found for this Pokémon.</p>
        </div>
      )}
    </div>
  );
};

export default AbilitiesTab;
