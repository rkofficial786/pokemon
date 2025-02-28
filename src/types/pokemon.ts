// Type definitions
export interface Pokemon {
  id: number;
  name: string;
  types: Array<{
    type: {
      name: string;
    };
  }>;
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
  abilities: PokemonAbility[];
  base_experience?: string;
  evolution_chain?:any[];
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonSprites {
  front_default: string;
  front_shiny: string;
  back_default: string;
  back_shiny: string;
  other?: {
    "official-artwork"?: {
      front_default: string;
    };
  };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonMove {
  move: {
    name: string;
    url: string;
  };
  version_group_details: {
    level_learned_at: number;
    move_learn_method: {
      name: string;
      url: string;
    };
    version_group: {
      name: string;
      url: string;
    };
  }[];
}

export interface PokemonSpecies {
  name: string;
  url: string;
  flavor_text?: string;
}

export interface EvolutionChain {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionChain[];
  evolution_details: {
    min_level: number;
    item?: {
      name: string;
      url: string;
    };
    trigger: {
      name: string;
      url: string;
    };
  }[];
}

export interface TypeEffectiveness {
  doubleDamageTo: string[];
  doubleDamageFrom: string[];
  halfDamageTo: string[];
  halfDamageFrom: string[];
  noDamageTo: string[];
  noDamageFrom: string[];
}

export interface MoveDetail {
  id: number;
  name: string;
  type: {
    name: string;
  };
  power: number | null;
  pp: number;
  accuracy: number | null;
  damage_class: {
    name: string;
  };
}

export interface MoveInfo {
  move: {
    name: string;
    url: string;
  };
  version_group_details: Array<{
    level_learned_at: number;
    move_learn_method: {
      name: string;
    };
  }>;
  details?: MoveDetail;
}

export interface AbilityDetail {
  id: number;
  name: string;
  effect_entries: Array<{
    effect: string;
    language: {
      name: string;
    };
  }>;
  pokemon: Array<{
    pokemon: {
      name: string;
    };
  }>;
}

export interface AbilityInfo {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
  details?: AbilityDetail;
}
