import React from 'react';

interface PokemonNotFoundProps {
  onBack: () => void;
}

export const PokemonNotFound: React.FC<PokemonNotFoundProps> = ({ onBack }) => {
  return (
    <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 text-center">
      <h2 className="text-2xl font-bold text-gray-100 mb-2">
        Pokemon Not Found
      </h2>
      <p className="text-gray-400 mb-4">
        The Pokémon you're looking for doesn't exist or hasn't been loaded
        yet.
      </p>
      <button
        onClick={onBack}
        className="px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-colors"
      >
        Go Back
      </button>
    </div>
  );
};