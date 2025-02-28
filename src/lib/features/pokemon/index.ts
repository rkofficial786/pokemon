import { createSlice } from "@reduxjs/toolkit";
import { getAllPokemon, getPokemonById, getPokemonByName } from "./actions";

interface PokemonListItem {
  name: string;
  url: string;
}

interface PokemonState {
  list: PokemonListItem[];
  selectedPokemon: any | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
}

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
    builder
      .addCase(getAllPokemon.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllPokemon.fulfilled, (state, { payload, meta }) => {
        state.isLoading = false;

        const offset = meta.arg.offset || 0;

        if (offset === 0) {
          state.list = payload.results;
        } else {
          state.list = [...state.list, ...payload.results];
        }

        state.totalCount = payload.count;
      })
      .addCase(getAllPokemon.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = (payload as string) || "Failed to fetch Pokémon";
      })

      .addCase(getPokemonById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPokemonById.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.selectedPokemon = payload;
      })
      .addCase(getPokemonById.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = (payload as string) || "Failed to fetch Pokémon details";
      })

      .addCase(getPokemonByName.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPokemonByName.fulfilled, (state, { payload }) => {
        state.isLoading = false;
      })
      .addCase(getPokemonByName.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error =
          (payload as string) || "Failed to find Pokémon with that name";
      });
  },
});

export const { clearPokemonList, clearSelectedPokemon } = PokemonSlice.actions;
export { getAllPokemon, getPokemonById, getPokemonByName };
export default PokemonSlice.reducer;
