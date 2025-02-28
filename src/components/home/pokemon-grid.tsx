// components/home/pokemon-grid.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  getAllPokemon,
  getPokemonById,
  getPokemonByName,
} from "@/lib/features/pokemon";
import PokemonCard from "../pokemon/pokemon-card";
import LoadingSkeleton from "../ui/loading-skeleton";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Pokemon } from "@/types/pokemon";

// Simple in-memory cache
const detailsCache: Record<number, Pokemon> = {};

export default function PokemonGrid() {
  const dispatch = useAppDispatch();
  const { list, isLoading, error, totalCount } = useAppSelector(
    (state) => state.pokemon
  );
  const [page, setPage] = useState(1);
  const [detailedPokemon, setDetailedPokemon] = useState<Pokemon[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Pokemon[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  const isFetchingDetailsRef = useRef(false);

  useEffect(() => {
    if (list.length === 0 && !activeSearch) {
      dispatch(getAllPokemon({ limit: 20, offset: 0 }));
    }
  }, [dispatch, list.length, activeSearch]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!searchTerm.trim()) {
      clearSearch();
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setActiveSearch(searchTerm);

    try {
      const { payload } = await dispatch(
        getPokemonByName(searchTerm.toLowerCase())
      );

      if (payload.id) {
        const data = payload;

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

        detailsCache[data.id] = detailedData;

        setSearchResults([detailedData]);
      } else {
        console.log("Exact match not found, fetching more data to filter...");

        setSearchResults([]);
        setSearchError(`No Pokémon found matching "${searchTerm}"`);
        setIsSearching(false);
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
    setSearchTerm("");
    setActiveSearch("");
    setSearchResults([]);
    setSearchError(null);
  };

  // Fetch detailed data for each Pokemon in the list, with optimizations
  useEffect(() => {
    async function fetchPokemonDetails() {
      // Skip if searching
      if (activeSearch) return;

      // Prevent concurrent fetches and unnecessary re-renders
      if (
        isFetchingDetailsRef.current ||
        list.length === 0 ||
        detailedPokemon.length >= list.length
      ) {
        return;
      }

      isFetchingDetailsRef.current = true;
      setIsLoadingDetails(true);

      try {
        // Get Pokemon IDs that we don't have detailed data for yet
        const pokemonToFetch = list.slice(detailedPokemon.length);

        // Identify which Pokemon need to be fetched (not in cache)
        const uncachedPokemon = pokemonToFetch.filter((pokemon) => {
          const id = parseInt(
            pokemon.url.split("/").filter(Boolean).pop() || "0"
          );
          return !detailsCache[id];
        });

        // Only fetch what we don't have cached
        if (uncachedPokemon.length > 0) {
          const detailsPromises = uncachedPokemon.map(async (pokemon) => {
            // Extract ID from the URL
            const id = parseInt(
              pokemon.url.split("/").filter(Boolean).pop() || "0"
            );

            // Fetch detailed data for this Pokemon
            const { payload }: any = await dispatch(getPokemonById(id));
            const data = payload;

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
        const allDetailedPokemon = pokemonToFetch
          .map((pokemon) => {
            const id = parseInt(
              pokemon.url.split("/").filter(Boolean).pop() || "0"
            );
            return detailsCache[id];
          })
          .filter(Boolean);

        setDetailedPokemon((prev) => {
          // Ensure we don't have duplicates
          const existingIds = new Set(prev.map((p) => p.id));
          const newItems = allDetailedPokemon.filter(
            (p) => !existingIds.has(p.id)
          );
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
  }, [
    dispatch,
    isLoading,
    isLoadingDetails,
    list.length,
    page,
    totalCount,
    activeSearch,
  ]);

  // Set up infinite scroll with a more conservative approach
  const infiniteScrollTriggerRef = useInfiniteScroll(
    // Only enable infinite scroll when not searching
    activeSearch ? () => {} : loadMore
  );

  // Data source based on search state
  const dataSource = activeSearch ? searchResults : detailedPokemon;

  // Determine overall loading state
  const isFullyLoading = isLoading && list.length === 0 && !activeSearch;
  const isPartiallyLoading = (isLoading || isLoadingDetails) && !activeSearch;
  const isAnyLoading = isFullyLoading || isPartiallyLoading || isSearching;

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-gray-100">
            Pokémon Collection
          </h2>

          {/* Search Section */}
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
                      onClick={() => setSearchTerm("")}
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
                    "Search"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Active search notification */}
        {activeSearch && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6 flex justify-between items-center">
            <p className="text-gray-300">
              Showing results for "
              <span className="text-white font-semibold">{activeSearch}</span>"
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
            Showing {dataSource.length} {activeSearch ? "result" : "Pokémon"}
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
            {dataSource.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-2xl text-gray-400 mb-4">No Pokémon found</p>
                <p className="text-gray-500">Try adjusting your search</p>
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
                {dataSource.map((pokemon) => (
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
            {!activeSearch &&
              !isAnyLoading &&
              detailedPokemon.length < totalCount && (
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
