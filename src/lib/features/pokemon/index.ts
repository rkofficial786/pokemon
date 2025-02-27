import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getAllPokemon, getPokemonById } from "./actions";

// Define the type for a Pokemon item
interface PokemonItem {
  id: number;
  name: string;
  url: string;
  imageUrl?: string;
  types?: string[];
}

// Define the state structure
interface PokemonState {
  list: PokemonItem[];
  selectedPokemon: any | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
}

// Initialize the state
const initialState: PokemonState = {
  list: [],
  selectedPokemon: null,
  isLoading: false,
  error: null,
  totalCount: 0,
};

export const PokemonSlice = createSlice({
  name: "pokemon",
  initialState,
  reducers: {
    clearPokemonList: (state) => {
      state.list = [];
    },
    clearSelectedPokemon: (state) => {
      state.selectedPokemon = null;
    },
  },

  extraReducers: (builder) => {
    // Handle getAllPokemon actions
    builder
      .addCase(getAllPokemon.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllPokemon.fulfilled, (state, { payload, meta }) => {
        state.isLoading = false;

        const offset = meta.arg.offset || 0;

        const enhancedResults = payload.results.map((pokemon: any) => {
          const id = parseInt(pokemon.url.split("/").filter(Boolean).pop());
          return {
            ...pokemon,
            id,
            imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
          };
        });

        // If offset is 0, replace the list; otherwise append to it
        if (offset === 0) {
          state.list = enhancedResults;
        } else {
          // Avoid duplicates by checking if the Pokemon is already in the list
          const newPokemon = enhancedResults.filter(
            (newItem: PokemonItem) =>
              !state.list.some((existing) => existing.id === newItem.id)
          );
          state.list = [...state.list, ...newPokemon];
        }

        // Update total count
        state.totalCount = payload.count;
      })
      .addCase(getAllPokemon.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = (payload as string) || "Failed to fetch Pokémon";
      })

      // Handle getProductsById actions (for individual Pokemon details)
      .addCase(getPokemonById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPokemonById.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.selectedPokemon = payload;

        // Optionally update the types in the list item
        const index = state.list.findIndex(
          (pokemon) => pokemon.id === payload.id
        );
        if (index !== -1) {
          state.list[index].types = payload.types.map(
            (type: any) => type.type.name
          );
        }
      })
      .addCase(getPokemonById.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = (payload as string) || "Failed to fetch Pokémon details";
      });
  },
});

export const { clearPokemonList, clearSelectedPokemon } = PokemonSlice.actions;
export { getAllPokemon, getPokemonById };
export default PokemonSlice.reducer;
