import { createAsyncThunk } from "@reduxjs/toolkit";

import { apiConnector } from "@/lib/api-connector";

// store/slices/pokemon-slice.ts

export const getAllPokemon = createAsyncThunk(
  "pokemon/getAll",
  async (
    { limit = 20, offset = 0 }: { limit: number; offset: number },
    { rejectWithValue }
  ) => {
    try {
      // Include the parameters in the query string
      const response = await apiConnector(
        "get",
        `/pokemon/?limit=${limit}&offset=${offset}`,
        null,
        {},
        null
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const getPokemonById = createAsyncThunk(
  "/pokemon/:id",

  async (data: any, { rejectWithValue, getState }) => {
    try {
      const response = await apiConnector(
        "get",
        `/pokemon/${data}`,
        null,
        {},
        null
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);


export const getPokemonByName = createAsyncThunk(
  "/pokemon/:name",

  async (data: any, { rejectWithValue, getState }) => {
    try {
      const response = await apiConnector(
        "get",
        `/pokemon/${data}`,
        null,
        {},
        null
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

