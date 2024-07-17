import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fetchShopsRequest from "../services/ShopsService";

export const fetchShops = createAsyncThunk(
  "shops/FETCH_SHOPS",
  async (data = {}) => {
    const result = await fetchShopsRequest(data);
    return result?.data;
  },
);

const initialState = {
  shops: [],
  fetching: false
};

const ShopSlice = createSlice({
  name: "shops",
  initialState,
  extraReducers: {
    [fetchShops.pending]: state => {
      state.fetching = true;
    },
    [fetchShops.fulfilled]: (state, _action) => {
      state.shops = _action.payload || [];
      state.fetching = false;
    },
    [fetchShops.rejected]: state => {
      state.shops = [];
      state.fetching = false;
    },
  },
});

const { reducer } = ShopSlice;
export default reducer;
