import React from "react";
import AbilitiesTab from "./tabs/abilities";
import MovesTab from "./tabs/moves";
import StatsTab from "./tabs/stats";

interface DetailTabsProps {
  pokemon: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  typeColor: {
    bg: string;
    text: string;
    light: string;
  };
}

const DetailTabs: React.FC<DetailTabsProps> = ({
  pokemon,
  activeTab,
  setActiveTab,
  typeColor,
}) => {
  const tabs = [
    { id: "stats", label: "Stats" },
    { id: "abilities", label: "Abilities" },
    { id: "moves", label: "Moves" },
  ];

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-700">
        {tabs.map((tab) => (
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

      <div className="p-6">
        {activeTab === "stats" && (
          <StatsTab pokemon={pokemon} typeColor={typeColor} />
        )}
        {activeTab === "abilities" && <AbilitiesTab pokemon={pokemon} />}
        {activeTab === "moves" && (
          <MovesTab pokemon={pokemon} typeColor={typeColor} />
        )}
      </div>
    </div>
  );
};

export default DetailTabs;
