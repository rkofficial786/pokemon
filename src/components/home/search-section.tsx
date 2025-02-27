// components/home/search-section.tsx
'use client';

import { setSearchTerm, setTypeFilter } from '@/lib/features/ui';
import { useAppDispatch } from '@/lib/hooks';
import { useState, useEffect, useRef } from 'react';


// Pokemon types with their associated colors
const pokemonTypes = [
  { name: 'normal', color: '#A8A878' },
  { name: 'fire', color: '#F08030' },
  { name: 'water', color: '#6890F0' },
  { name: 'electric', color: '#F8D030' },
  { name: 'grass', color: '#78C850' },
  { name: 'ice', color: '#98D8D8' },
  { name: 'fighting', color: '#C03028' },
  { name: 'poison', color: '#A040A0' },
  { name: 'ground', color: '#E0C068' },
  { name: 'flying', color: '#A890F0' },
  { name: 'psychic', color: '#F85888' },
  { name: 'bug', color: '#A8B820' },
  { name: 'rock', color: '#B8A038' },
  { name: 'ghost', color: '#705898' },
  { name: 'dragon', color: '#7038F8' },
  { name: 'dark', color: '#705848' },
  { name: 'steel', color: '#B8B8D0' },
  { name: 'fairy', color: '#EE99AC' },
];

export default function SearchSection() {
  const dispatch = useAppDispatch();
  const [localSearch, setLocalSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  // Intersection observer for animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    
    const section = sectionRef.current;
    if (section) {
      observer.observe(section);
    }
    
    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);
  
  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchTerm(localSearch));
  };
  
  // Toggle type selection
  const toggleType = (type: string) => {
    setSelectedTypes(prev => {
      const isSelected = prev.includes(type);
      const newSelection = isSelected
        ? prev.filter(t => t !== type)
        : [...prev, type];
      
      // Update global state
      dispatch(setTypeFilter(newSelection));
      
      return newSelection;
    });
  };
  
  return (
    <section 
      ref={sectionRef}
      className={`py-12 bg-gray-800 transition-opacity duration-700 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSubmit} className="flex-1">
              <div className="relative">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
                    clipRule="evenodd" 
                  />
                </svg>
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search for Pokémon..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-full py-4 pl-12 pr-4 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:w-auto w-full flex items-center justify-center gap-2 bg-gray-900 border border-gray-700 rounded-full py-4 px-6 text-gray-100 hover:bg-gray-800 transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" 
                  clipRule="evenodd" 
                />
              </svg>
              Filters {selectedTypes.length > 0 && `(${selectedTypes.length})`}
            </button>
          </div>
          
          {/* Filter panel */}
          <div 
            className={`mt-4 overflow-hidden transition-all duration-300 ${
              showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
              <h3 className="font-medium mb-4 text-gray-300">Filter by Type</h3>
              <div className="flex flex-wrap gap-2">
                {pokemonTypes.map(type => (
                  <button 
                    key={type.name}
                    onClick={() => toggleType(type.name)}
                    className={`px-3 py-1 rounded-full text-xs capitalize transition-all ${
                      selectedTypes.includes(type.name)
                        ? 'text-white shadow-lg'
                        : 'text-gray-300 bg-gray-800 hover:bg-gray-700 border border-gray-700'
                    }`}
                    style={{ 
                      backgroundColor: selectedTypes.includes(type.name) ? type.color : '',
                      boxShadow: selectedTypes.includes(type.name) ? `0 0 10px ${type.color}50` : ''
                    }}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
              
              <div className="flex justify-between mt-6">
                <button 
                  onClick={() => {
                    setSelectedTypes([]);
                    dispatch(setTypeFilter([]));
                  }}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Clear Filters
                </button>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Active filters display */}
          {selectedTypes.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-gray-400 text-sm my-auto">Active filters:</span>
              {selectedTypes.map(type => {
                const typeInfo = pokemonTypes.find(t => t.name === type);
                return (
                  <div 
                    key={type}
                    className="px-2 py-1 rounded-full text-xs capitalize flex items-center gap-1"
                    style={{ backgroundColor: typeInfo?.color }}
                  >
                    {type}
                    <button
                      onClick={() => toggleType(type)}
                      className="w-4 h-4 rounded-full bg-white bg-opacity-30 flex items-center justify-center hover:bg-opacity-50"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-3 w-3" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                    </button>
                  </div>
                );
              })}
              
              <button
                onClick={() => {
                  setSelectedTypes([]);
                  dispatch(setTypeFilter([]));
                }}
                className="text-gray-400 hover:text-white text-xs my-auto ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}