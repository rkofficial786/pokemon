import { Pokemon } from "@/types/pokemon";
import {
  BoltIcon,
  FireIcon,
  HeartIcon,
  ShieldExclamationIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";

interface StatBarsProps {
  pokemon: Pokemon;
  typeColor: {
    bg: string;
    text: string;
    light: string;
  };
}

const statIcons = {
  hp: HeartIcon,
  attack: FireIcon,
  defense: ShieldExclamationIcon,
  "special-attack": SparklesIcon,
  "special-defense": ShieldExclamationIcon,
  speed: BoltIcon,
};

const StatBars: React.FC<StatBarsProps> = ({ pokemon, typeColor }) => {
  const totalStats = pokemon.stats.reduce(
    (sum: number, stat: any) => sum + stat.base_stat,
    0
  );

  return (
    <div className="space-y-4">
      {pokemon.stats.map((stat: any) => {
        const StatIcon =
          statIcons[stat.stat.name as keyof typeof statIcons] || SparklesIcon;

        return (
          <div key={stat.stat.name} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <StatIcon className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-200 capitalize">
                  {stat.stat.name.replace("-", " ")}
                </span>
              </div>
              <span className="font-mono text-gray-300">{stat.base_stat}</span>
            </div>
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${typeColor.bg}`}
                style={{
                  width: `${Math.min(100, (stat.base_stat / 255) * 100)}%`,
                }}
              />
            </div>
          </div>
        );
      })}

      <div className="pt-4 border-t border-gray-700">
        <div className="flex justify-between font-bold">
          <span className="text-gray-200">Total</span>
          <span className="font-mono text-gray-300">{totalStats}</span>
        </div>
      </div>
    </div>
  );
};

export default StatBars;
