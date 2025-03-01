export const typeToColor: Record<string, { bg: string; text: string; light: string }> = {
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


  export const  typeToColorFeatured: Record<string, string> = {
    normal: "from-gray-400 to-gray-500",
    fire: "from-orange-500 to-red-600",
    water: "from-blue-400 to-blue-600",
    electric: "from-yellow-400 to-yellow-500",
    grass: "from-green-400 to-green-600",
    ice: "from-blue-200 to-blue-400",
    fighting: "from-red-600 to-red-800",
    poison: "from-purple-400 to-purple-600",
    ground: "from-yellow-600 to-yellow-800",
    flying: "from-blue-300 to-purple-400",
    psychic: "from-pink-400 to-pink-600",
    bug: "from-green-500 to-green-700",
    rock: "from-yellow-700 to-yellow-900",
    ghost: "from-indigo-400 to-indigo-700",
    dragon: "from-blue-600 to-purple-700",
    dark: "from-gray-700 to-gray-900",
    steel: "from-gray-400 to-gray-600",
    fairy: "from-pink-300 to-pink-500",
  };