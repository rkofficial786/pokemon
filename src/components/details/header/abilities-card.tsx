import React from "react";
import { formatName } from "@/app/helpers/helper";
import { AbilityInfo } from "@/types/pokemon";

interface AbilitiesCardProps {
  abilities: AbilityInfo[];
}

const AbilitiesCard: React.FC<AbilitiesCardProps> = ({ abilities }) => {
  return (
    <div className="bg-black/20 backdrop-blur-sm p-4 rounded-lg">
      <div className="text-white/70 mb-1">Abilities</div>
      <div className="text-sm">
        {abilities.map((ability, index) => (
          <span key={ability.ability.name}>
            {formatName(ability.ability.name)}

            {index < abilities.length - 1 ? ", " : ""}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AbilitiesCard;
