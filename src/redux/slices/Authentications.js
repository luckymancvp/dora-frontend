import { createSlice } from "@reduxjs/toolkit";
import { isBlank } from "../../utils/Utils";

const initialState = {
  isLoggedIn: !isBlank(localStorage.getItem("token")),
  submitting: false,
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
  extraReducers: {},
});

export default authSlice.reducer;
export const { saveTokenData } = authSlice.actions;
