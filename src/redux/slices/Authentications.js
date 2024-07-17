import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isBlank } from "../../utils/Utils";
import getProfileRequest from "../services/AuthService";

export const getProfile = createAsyncThunk(
  'auth/PROFILE',
  async () => {
    const result = await getProfileRequest();
    return result.data;
  },
);

const initialState = {
  currentUser: null,
  isLoggedIn: !isBlank(localStorage.getItem("token")),
  isFetching: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    saveTokenData: (state, action) => {
      const token = action.payload;
      if (token !== "") {
        localStorage.setItem("token", token);
        state.isLoggedIn = true;
      } else {
        localStorage.removeItem("token");
        state.isLoggedIn = false;
      }
    },
  },
  extraReducers: {
    [getProfile.pending]: state => {
      state.isFetching = true;
      state.currentUser = null;
    },
    [getProfile.fulfilled]: (state, _action) => {
      state.isFetching = false;
      state.currentUser = _action.payload;
    },
    [getProfile.rejected]: state => {
      state.isFetching = false;
      state.currentUser = null;
    },
  },
});

export default authSlice.reducer;
export const { saveTokenData } = authSlice.actions;
