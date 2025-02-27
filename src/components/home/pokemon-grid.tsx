// components/home/pokemon-grid.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getAllPokemon } from "@/lib/features/pokemon";
import PokemonCard from "../pokemon/pokemon-card";
import LoadingSkeleton from "../ui/loading-skeleton";
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  ChevronDownIcon
} from '@heroicons/react/24/solid';

// Define types for detailed Pokemon data
interface DetailedPokemon {
  id: number;
  name: string;
  types: string[];
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      }
    }
  };
  stats: {
    base_stat: number;
    stat: {
      name: string;
    }
  }[];
  height: number;
  weight: number;
  abilities: {
    ability: {
      name: string;
    };
    is_hidden: boolean;
  }[];
}

// Available Pokemon types for filtering
const pokemonTypes = [
  "normal", "fire", "water", "electric", "grass", "ice", 
  "fighting", "poison", "ground", "flying", "psychic", 
  "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"
];

// Simple in-memory cache
const detailsCache: Record<number, DetailedPokemon> = {};

export default function PokemonGrid() {
  const dispatch = useAppDispatch();
  const { list, isLoading, error, totalCount } = useAppSelector(
    (state) => state.pokemon
  );
  const [page, setPage] = useState(1);
  const [detailedPokemon, setDetailedPokemon] = useState<DetailedPokemon[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');         // What the user is typing
  const [activeSearch, setActiveSearch] = useState('');     // The actual search that was executed
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("id_asc");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<DetailedPokemon[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  // Use a ref to track if we're already fetching details to prevent duplicate fetches
  const isFetchingDetailsRef = useRef(false);

  // Load initial basic Pokemon list
  useEffect(() => {
    if (list.length === 0 && !activeSearch) {
      dispatch(getAllPokemon({ limit: 20, offset: 0 }));
    }
  }, [dispatch, list.length, activeSearch]);

  // Handle API search - only triggered when search button is clicked
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Clear search if empty
    if (!searchTerm.trim()) {
      clearSearch();
      return;
    }
    
    setIsSearching(true);
    setSearchError(null);
    setActiveSearch(searchTerm); // Set active search term
    
    try {
      // Search by exact name
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`);
      
      if (response.ok) {
        const data = await response.json();
        
        const detailedData = {
          id: data.id,
          name: data.name,
          types: data.types.map((type: any) => type.type.name),
          sprites: data.sprites,
          stats: data.stats,
          height: data.height,
          weight: data.weight,
          abilities: data.abilities,
        };
        
        // Store in cache
        detailsCache[data.id] = detailedData;
        
        setSearchResults([detailedData]);
      } else {
        // Fallback for partial matches (could be enhanced with a proper backend endpoint)
        console.log("Exact match not found, fetching more data to filter...");
        
        // For demo purposes, fetch the first 151 Pokemon and filter
        const listResponse = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=151`);
        const listData = await listResponse.json();
        
        const filteredNames = listData.results.filter((pokemon: any) => 
          pokemon.name.includes(searchTerm.toLowerCase())
        );
        
        // If no matches found
        if (filteredNames.length === 0) {
          setSearchResults([]);
          setSearchError(`No Pokémon found matching "${searchTerm}"`);
          setIsSearching(false);
          return;
        }
        
        // Fetch details for each match
        const matchPromises = filteredNames.map(async (pokemon: any) => {
          const id = parseInt(pokemon.url.split('/').filter(Boolean).pop() || '0');
          
          // Check cache first
          if (detailsCache[id]) {
            return detailsCache[id];
          }
          
          // Fetch if not in cache
          const detailResponse = await fetch(pokemon.url);
          const detailData = await detailResponse.json();
          
          const detailedData = {
            id: detailData.id,
            name: detailData.name,
            types: detailData.types.map((type: any) => type.type.name),
            sprites: detailData.sprites,
            stats: detailData.stats,
            height: detailData.height,
            weight: detailData.weight,
            abilities: detailData.abilities,
          };
          
          // Store in cache
          detailsCache[detailData.id] = detailedData;
          
          return detailedData;
        });
        
        const matches = await Promise.all(matchPromises);
        setSearchResults(matches);
      }
    } catch (error) {
      console.error("Error searching Pokemon:", error);
      setSearchResults([]);
      setSearchError("Failed to search Pokémon. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  // Clear the search
  const clearSearch = () => {
    setSearchTerm('');
    setActiveSearch('');
    setSearchResults([]);
    setSearchError(null);
  };

  // Fetch detailed data for each Pokemon in the list, with optimizations
  useEffect(() => {
    async function fetchPokemonDetails() {
      // Skip if searching
      if (activeSearch) return;
      
      // Prevent concurrent fetches and unnecessary re-renders
      if (isFetchingDetailsRef.current || list.length === 0 || 
          detailedPokemon.length >= list.length) {
        return;
      }
      
      isFetchingDetailsRef.current = true;
      setIsLoadingDetails(true);
      
      try {
        // Get Pokemon IDs that we don't have detailed data for yet
        const pokemonToFetch = list.slice(detailedPokemon.length);
        
        // Identify which Pokemon need to be fetched (not in cache)
        const uncachedPokemon = pokemonToFetch.filter(pokemon => {
          const id = parseInt(pokemon.url.split('/').filter(Boolean).pop() || '0');
          return !detailsCache[id];
        });
        
        // Only fetch what we don't have cached
        if (uncachedPokemon.length > 0) {
          const detailsPromises = uncachedPokemon.map(async (pokemon) => {
            // Extract ID from the URL
            const id = parseInt(pokemon.url.split('/').filter(Boolean).pop() || '0');
            
            // Fetch detailed data for this Pokemon
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const data = await response.json();
            
            const detailedData = {
              id: data.id,
              name: data.name,
              types: data.types.map((type: any) => type.type.name),
              sprites: data.sprites,
              stats: data.stats,
              height: data.height,
              weight: data.weight,
              abilities: data.abilities,
            };
            
            // Store in cache
            detailsCache[id] = detailedData;
            
            return detailedData;
          });
          
          // We need to wait for all new fetches to complete
          await Promise.all(detailsPromises);
        }
        
        // Gather all detailed Pokemon from cache in the order of the list
        const allDetailedPokemon = pokemonToFetch.map(pokemon => {
          const id = parseInt(pokemon.url.split('/').filter(Boolean).pop() || '0');
          return detailsCache[id];
        }).filter(Boolean);
        
        setDetailedPokemon(prev => {
          // Ensure we don't have duplicates
          const existingIds = new Set(prev.map(p => p.id));
          const newItems = allDetailedPokemon.filter(p => !existingIds.has(p.id));
          return [...prev, ...newItems];
        });
      } catch (error) {
        console.error("Error fetching Pokemon details:", error);
      } finally {
        setIsLoadingDetails(false);
        isFetchingDetailsRef.current = false;
      }
    }
    
    fetchPokemonDetails();
  }, [list, detailedPokemon.length, activeSearch]);

  // Handle loading more Pokemon with debounce
  const loadMore = useCallback(() => {
    // Don't load more when searching
    if (activeSearch) return;
    
    if (!isLoading && !isLoadingDetails && list.length < totalCount) {
      dispatch(getAllPokemon({ limit: 20, offset: page * 20 }));
      setPage((prev) => prev + 1);
    }
  }, [dispatch, isLoading, isLoadingDetails, list.length, page, totalCount, activeSearch]);

  // Set up infinite scroll with a more conservative approach
  const infiniteScrollTriggerRef = useInfiniteScroll(
    // Only enable infinite scroll when not searching
    activeSearch ? () => {} : loadMore
  );

  // Toggle type selection
  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedTypes([]);
    setSortBy("id_asc");
    if (activeSearch) {
      clearSearch();
    }
  };

  // Get data source based on search state
  const dataSource = activeSearch ? searchResults : detailedPokemon;
  
  // Apply type filtering and sorting
  const filteredPokemon = dataSource
    .filter(pokemon => {
      // Filter by selected types
      return selectedTypes.length === 0 || 
        pokemon.types.some(type => selectedTypes.includes(type));
    })
    .sort((a, b) => {
      // Sort based on selected sort option
      switch(sortBy) {
        case "id_asc":
          return a.id - b.id;
        case "id_desc":
          return b.id - a.id;
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        default:
          return a.id - b.id;
      }
    });

  // Determine overall loading state
  const isFullyLoading = (isLoading && list.length === 0) && !activeSearch;
  const isPartiallyLoading = (isLoading || isLoadingDetails) && !activeSearch;
  const isAnyLoading = isFullyLoading || isPartiallyLoading || isSearching;

  // Get the Type to Color mapping for badges
  const typeToColor: Record<string, string> = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    fairy: "#EE99AC",
  };

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-gray-100">
            Pokémon Collection
          </h2>
          
          {/* Search & Filter Section */}
          <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <form onSubmit={handleSearch} className="flex">
                <div className="relative flex-grow">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Pokémon..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-l-lg py-2 pl-10 pr-3 text-gray-200 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button 
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded-r-lg hover:bg-red-700 transition-colors disabled:bg-red-800 disabled:opacity-70"
                  disabled={isSearching || !searchTerm.trim()}
                >
                  {isSearching ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Search'
                  )}
                </button>
              </form>
            </div>
            
            <div className="flex-shrink-0">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 flex items-center gap-2 hover:bg-gray-700 transition-colors"
              >
                <FunnelIcon className="w-5 h-5" />
                Filters
                {selectedTypes.length > 0 && (
                  <span className="inline-flex items-center justify-center bg-red-600 text-white text-xs rounded-full w-5 h-5">
                    {selectedTypes.length}
                  </span>
                )}
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Filter Panel */}
        <div className={`mb-8 transition-all duration-300 overflow-hidden ${showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Type Filter */}
              <div className="md:w-2/3">
                <h3 className="font-medium text-gray-300 mb-3 flex items-center gap-2">
                  <AdjustmentsHorizontalIcon className="w-5 h-5" />
                  Filter by Type
                </h3>
                <div className="flex flex-wrap gap-2">
                  {pokemonTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => toggleType(type)}
                      className={`px-3 py-1.5 rounded-full text-sm capitalize transition-colors flex items-center gap-1 ${
                        selectedTypes.includes(type)
                          ? 'text-white'
                          : 'text-gray-300 bg-gray-700 hover:bg-gray-600'
                      }`}
                      style={{
                        backgroundColor: selectedTypes.includes(type) ? typeToColor[type] : ''
                      }}
                    >
                      {type}
                      {selectedTypes.includes(type) && (
                        <XMarkIcon className="w-3 h-3" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Sort Options */}
              <div className="md:w-1/3">
                <h3 className="font-medium text-gray-300 mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-gray-200 focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <option value="id_asc">ID (Low to High)</option>
                  <option value="id_desc">ID (High to Low)</option>
                  <option value="name_asc">Name (A-Z)</option>
                  <option value="name_desc">Name (Z-A)</option>
                </select>
              </div>
            </div>
            
            {/* Filter Actions */}
            <div className="flex justify-between mt-6 pt-4 border-t border-gray-700">
              <button
                onClick={clearFilters}
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                disabled={selectedTypes.length === 0 && sortBy === "id_asc" && !activeSearch}
              >
                <XMarkIcon className="w-4 h-4" />
                Clear All
              </button>
              
              <button
                onClick={() => setShowFilters(false)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
        
        {/* Active search notification */}
        {activeSearch && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6 flex justify-between items-center">
            <p className="text-gray-300">
              Showing results for "<span className="text-white font-semibold">{activeSearch}</span>"
            </p>
            <button 
              onClick={clearSearch}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        )}
        
        {/* Count display */}
        <div className="mb-6 text-gray-400 flex items-center justify-end">
          <p>
            Showing {filteredPokemon.length} {activeSearch ? 'result' : 'Pokémon'}
            {!activeSearch && ` of ${totalCount}`}
          </p>
        </div>

        {isFullyLoading || isSearching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <LoadingSkeleton count={20} />
          </div>
        ) : error && !activeSearch ? (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 text-center">
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => {
                dispatch(getAllPokemon({ limit: 20, offset: 0 }));
                setDetailedPokemon([]);
              }}
              className="mt-4 px-4 py-2 bg-red-600 rounded-lg text-white"
            >
              Try Again
            </button>
          </div>
        ) : searchError ? (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 text-center">
            <p className="text-red-400">{searchError}</p>
            <button
              onClick={clearSearch}
              className="mt-4 px-4 py-2 bg-red-600 rounded-lg text-white"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <>
            {filteredPokemon.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-2xl text-gray-400 mb-4">No Pokémon found</p>
                <p className="text-gray-500">
                  Try adjusting your search or filters
                </p>
                {activeSearch && (
                  <button
                    onClick={clearSearch}
                    className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredPokemon.map((pokemon) => (
                  <PokemonCard key={pokemon.id} pokemon={pokemon} />
                ))}
                
                {/* Add loading skeletons for Pokemon being fetched */}
                {isPartiallyLoading && (
                  <LoadingSkeleton 
                    count={Math.min(5, list.length - detailedPokemon.length)} 
                    startIndex={detailedPokemon.length}
                  />
                )}
              </div>
            )}

            {/* Infinite scroll trigger - only show when not in search mode */}
            {!activeSearch && !isAnyLoading && detailedPokemon.length < totalCount && (
              <div
                ref={infiniteScrollTriggerRef}
                className="h-20 flex items-center justify-center my-8"
              >
                <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {/* Manual load more button - only show when not in search mode */}
            {!activeSearch && detailedPokemon.length < totalCount && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  className="px-8 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 flex items-center gap-2 mx-auto"
                  disabled={isAnyLoading}
                >
                  {isAnyLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </>
                  ) : (
                    "Load More Pokémon"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}