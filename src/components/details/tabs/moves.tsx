
import { typeToColor } from "@/app/constants/colors";
import { formatName } from "@/app/helpers/helper";
import { MoveInfo } from "@/types/pokemon";
import React, { useState, useEffect } from "react";

interface MovesTabProps {
  pokemon: any;
  typeColor: {
    bg: string;
    text: string;
    light: string;
  };
}

const MovesTab: React.FC<MovesTabProps> = ({ pokemon, typeColor }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [movesWithDetails, setMovesWithDetails] = useState<MoveInfo[]>([]);

  useEffect(() => {
    const loadMoveDetails = async () => {
      if (!pokemon.moves || pokemon.moves.length === 0) return;

      setIsLoading(true);

      try {
        const updatedMoves = [...pokemon.moves];

        const batchSize = 5;
        for (let i = 0; i < updatedMoves.length; i += batchSize) {
          const batch = updatedMoves.slice(i, i + batchSize);

          await Promise.all(
            batch.map(async (move, batchIndex) => {
              try {
                const response = await fetch(move.move.url);
                const moveData = await response.json();

                updatedMoves[i + batchIndex] = {
                  ...updatedMoves[i + batchIndex],
                  details: {
                    id: moveData.id,
                    name: moveData.name,
                    type: moveData.type,
                    power: moveData.power,
                    pp: moveData.pp,
                    accuracy: moveData.accuracy,
                    damage_class: moveData.damage_class,
                  },
                };
              } catch (error) {
                console.error(`Failed to fetch details for ${move.move.name}`);
              }
            })
          );

          setMovesWithDetails([...updatedMoves]);
        }
      } catch (error) {
        console.error("Error loading move details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMoveDetails();
  }, [pokemon.moves]);

  const getMethodText = (moveInfo: MoveInfo) => {
    const details = moveInfo.version_group_details[0];
    if (!details) return "Unknown";

    return details.move_learn_method.name === "level-up"
      ? `Level ${details.level_learned_at}`
      : formatName(details.move_learn_method.name);
  };

  return (
    <div>
      {isLoading && movesWithDetails.length === 0 ? (
        <div className="flex justify-center p-8">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
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
              {movesWithDetails.map((moveInfo, index) => {
                const details = moveInfo.details;

                return (
                  <tr
                    key={moveInfo.move.name}
                    className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
                  >
                    <td className="px-6 py-4 font-medium capitalize">
                      {formatName(moveInfo.move.name)}
                    </td>
                    <td className="px-6 py-4">
                      {details ? (
                        <span
                          className={`px-2 py-1 rounded-full text-xs text-white ${
                            typeToColor[
                              details.type.name as keyof typeof typeToColor
                            ] || "bg-gray-600"
                          }`}
                        >
                          {details.type.name}
                        </span>
                      ) : (
                        <div className="w-16 h-6 bg-gray-700 rounded-full animate-pulse"></div>
                      )}
                    </td>
                    <td className="px-6 py-4 capitalize">
                      {details ? (
                        details.damage_class.name
                      ) : (
                        <div className="w-16 h-6 bg-gray-700 rounded-full animate-pulse"></div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {details ? (
                        details.power || "—"
                      ) : (
                        <div className="w-10 h-6 bg-gray-700 rounded-full animate-pulse"></div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {details ? (
                        details.pp
                      ) : (
                        <div className="w-10 h-6 bg-gray-700 rounded-full animate-pulse"></div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {details ? (
                        details.accuracy ? (
                          `${details.accuracy}%`
                        ) : (
                          "—"
                        )
                      ) : (
                        <div className="w-12 h-6 bg-gray-700 rounded-full animate-pulse"></div>
                      )}
                    </td>
                    <td className="px-6 py-4">{getMethodText(moveInfo)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && movesWithDetails.length === 0 && (
        <div className="bg-gray-900/50 rounded-lg p-6 text-center">
          <p className="text-gray-400">No moves found for this Pokémon.</p>
        </div>
      )}
    </div>
  );
};

export default MovesTab;
