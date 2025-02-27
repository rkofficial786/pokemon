import { configureStore } from "@reduxjs/toolkit";
import PokemonSlice from "./features/pokemon";
import UiSlice from "./features/ui";

export const makeStore = () => {
  return configureStore({
    reducer: {
      pokemon: PokemonSlice,
      ui: UiSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
