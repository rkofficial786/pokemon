"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  getAllPokemon,
  getPokemonById,
  getPokemonByName,
} from "@/lib/features/pokemon";
import { Pokemon } from "@/types/pokemon";
import SearchBar from "./search-bar";
import SearchNotification from "./search-notification";
import LoadingSkeleton from "@/components/ui/loading-skeleton";
import ErrorMessage from "./error";
import NoResults from "./not-found";
import Grid from "./grid";
import LoadMoreButton from "./load-more";

const detailsCache: Record<number, Pokemon> = {};

const PokemonExplorer = () => {
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

  const processRawPokemonData = (data: any): Pokemon => {
    return {
      id: data.id,
      name: data.name,
      types: data.types.map((type: any) => type.type.name),
      sprites: data.sprites,
      stats: data.stats,
      height: data.height,
      weight: data.weight,
      abilities: data.abilities,
    };
  };

  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      clearSearch();
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setActiveSearch(term);

    try {
      const { payload } = await dispatch(getPokemonByName(term.toLowerCase()));

      if (payload.id) {
        const detailedData = processRawPokemonData(payload);
        detailsCache[detailedData.id] = detailedData;
        setSearchResults([detailedData]);
      } else {
        setSearchResults([]);
        setSearchError(`No Pokémon found matching "${term}"`);
      }
    } catch (error) {
      console.error("Error searching Pokemon:", error);
      setSearchResults([]);
      setSearchError("Failed to search Pokémon. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setActiveSearch("");
    setSearchResults([]);
    setSearchError(null);
  };

  useEffect(() => {
    async function fetchPokemonDetails() {
      if (activeSearch || isFetchingDetailsRef.current) return;

      if (list.length === 0 || detailedPokemon.length >= list.length) return;

      isFetchingDetailsRef.current = true;
      setIsLoadingDetails(true);

      try {
        const pokemonToFetch = list.slice(detailedPokemon.length);
        const uncachedIds = pokemonToFetch
          .map((pokemon) =>
            parseInt(pokemon.url.split("/").filter(Boolean).pop() || "0")
          )
          .filter((id) => !detailsCache[id]);

        await Promise.all(
          uncachedIds.map(async (id) => {
            const { payload }: any = await dispatch(getPokemonById(id));
            detailsCache[id] = processRawPokemonData(payload);
          })
        );

        const newDetails = pokemonToFetch
          .map((pokemon) => {
            const id = parseInt(
              pokemon.url.split("/").filter(Boolean).pop() || "0"
            );
            return detailsCache[id];
          })
          .filter(Boolean);

        setDetailedPokemon((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const uniqueNewDetails = newDetails.filter(
            (p) => !existingIds.has(p.id)
          );
          return [...prev, ...uniqueNewDetails];
        });
      } catch (error) {
        console.error("Error fetching Pokemon details:", error);
      } finally {
        setIsLoadingDetails(false);
        isFetchingDetailsRef.current = false;
      }
    }

    fetchPokemonDetails();
  }, [list, detailedPokemon.length, activeSearch, dispatch]);

  const loadMore = useCallback(() => {
    if (
      activeSearch ||
      isLoading ||
      isLoadingDetails ||
      list.length >= totalCount
    )
      return;

    dispatch(getAllPokemon({ limit: 20, offset: page * 20 }));
    setPage((prev) => prev + 1);
  }, [
    dispatch,
    isLoading,
    isLoadingDetails,
    list.length,
    page,
    totalCount,
    activeSearch,
  ]);

  const infiniteScrollTriggerRef = useInfiniteScroll(
    activeSearch ? () => {} : loadMore
  );

  const dataSource = activeSearch ? searchResults : detailedPokemon;

  const isFullyLoading = isLoading && list.length === 0 && !activeSearch;
  const isPartiallyLoading = (isLoading || isLoadingDetails) && !activeSearch;
  const isAnyLoading = isFullyLoading || isPartiallyLoading || isSearching;

  const handleReload = () => {
    dispatch(getAllPokemon({ limit: 20, offset: 0 }));
    setDetailedPokemon([]);
  };

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-gray-100 text-center md:text-left">
            Pokémon Collection
          </h2>

          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={handleSearch}
            isSearching={isSearching}
          />
        </div>

        {activeSearch && (
          <SearchNotification searchTerm={activeSearch} onClear={clearSearch} />
        )}

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
          <ErrorMessage
            message={error}
            buttonText="Try Again"
            onButtonClick={handleReload}
          />
        ) : searchError ? (
          <ErrorMessage
            message={searchError}
            buttonText="Clear Search"
            onButtonClick={clearSearch}
          />
        ) : dataSource.length === 0 ? (
          <NoResults
            searchActive={!!activeSearch}
            onClearSearch={clearSearch}
          />
        ) : (
          <Grid
            pokemon={dataSource}
            isLoading={isPartiallyLoading}
            skeletonCount={Math.min(5, list.length - detailedPokemon.length)}
            skeletonStartIndex={detailedPokemon.length}
          />
        )}

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

        {!activeSearch && detailedPokemon.length < totalCount && (
          <LoadMoreButton onClick={loadMore} isLoading={isAnyLoading} />
        )}
      </div>
    </section>
  );
};
export default PokemonExplorer;
