
import React from "react";
import {
  HeartIcon,
  BoltIcon,
  FireIcon,
  SparklesIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/solid";

interface PokemonStat {
  base_stat: number;
  stat: {
    name: string;
  };
}

interface TopStatsProps {
  stats: PokemonStat[];
}

const statIcons: Record<string, { icon: React.ElementType; color: string }> = {
  hp: { icon: HeartIcon, color: "#ff5959" },
  attack: { icon: FireIcon, color: "#f5ac78" },
  defense: { icon: ShieldExclamationIcon, color: "#9db7f5" },
  "special-attack": { icon: SparklesIcon, color: "#9499f8" },
  "special-defense": { icon: ShieldExclamationIcon, color: "#a7db8d" },
  speed: { icon: BoltIcon, color: "#fa92b2" },
};

const TopStats: React.FC<TopStatsProps> = ({ stats }) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">
        Top Stats
      </h4>
      {stats.map((stat) => {
        const { icon: Icon, color } = statIcons[stat.stat.name] || {
          icon: SparklesIcon,
          color: "#ffffff",
        };

        return (
          <div key={stat.stat.name} className="flex items-center gap-2">
            <Icon className="w-4 h-4" style={{ color }} />
            <div className="capitalize text-sm">
              {stat.stat.name.replace("-", " ")}:
            </div>
            <div className="font-bold">{stat.base_stat}</div>
            <div className="flex-1 h-1.5 bg-black/30 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(100, (stat.base_stat / 150) * 100)}%`,
                  backgroundColor: color,
                }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TopStats;
