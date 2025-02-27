// store/slices/ui-slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  searchTerm: string;
  typeFilters: string[];
  isGridView: boolean;
  darkMode: boolean;
}

const initialState: UiState = {
  searchTerm: '',
  typeFilters: [],
  isGridView: true,
  darkMode: true 
};

const UiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setTypeFilter: (state, action: PayloadAction<string[]>) => {
      state.typeFilters = action.payload;
    },
    toggleViewMode: (state) => {
      state.isGridView = !state.isGridView;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    }
  }
});

export const { setSearchTerm, setTypeFilter, toggleViewMode, toggleDarkMode } = UiSlice.actions;
export default UiSlice.reducer;