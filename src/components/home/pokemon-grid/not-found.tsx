// components/ui/no-results.tsx
import React from 'react';

interface NoResultsProps {
  searchActive: boolean;
  onClearSearch: () => void;
}

export default function NoResults({ searchActive, onClearSearch }: NoResultsProps) {
  return (
    <div className="text-center py-20">
      <p className="text-2xl text-gray-400 mb-4">No Pokémon found</p>
      <p className="text-gray-500">Try adjusting your search</p>
      {searchActive && (
        <button
          onClick={onClearSearch}
          className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Clear Search
        </button>
      )}
    </div>
  );
}