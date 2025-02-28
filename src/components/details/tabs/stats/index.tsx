import React from "react";

import { Pokemon } from "@/types/pokemon";
import StatBars from "./statbar";

interface StatsTabProps {
  pokemon: Pokemon;
  typeColor: {
    bg: string;
    text: string;
    light: string;
  };
}

const StatsTab: React.FC<StatsTabProps> = ({ pokemon, typeColor }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-100">Base Stats</h3>

      <div className=" gap-8">
        <StatBars pokemon={pokemon} typeColor={typeColor} />
      </div>
    </div>
  );
};

export default StatsTab;
