// Type definitions
export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  sprites: {
    front_default: string;
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  weight: number;
  height: number;
  abilities: {
    ability: {
      name: string;
    };
    is_hidden: boolean;
  }[];
}
