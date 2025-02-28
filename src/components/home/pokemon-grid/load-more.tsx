
import React from 'react';

interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

 const LoadMoreButton =({ onClick, isLoading }: LoadMoreButtonProps) => {
  return (
    <div className="text-center mt-8">
      <button
        onClick={onClick}
        className="px-8 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 flex items-center gap-2 mx-auto"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Loading...
          </>
        ) : (
          "Load More Pokémon"
        )}
      </button>
    </div>
  );
}

export default LoadMoreButton