import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ConversationsService from "../services/ConversationsService";

export const fetchConversations = createAsyncThunk(
  "conversations/FETCH_CONVERSATIONS",
  async (data = {}) => {
    const result = await ConversationsService.fetchConversations(data);
    return result?.data;
  },
);

const initialState = {
  conversations: [],
  fetching: false,
  currentPage: 1,
};

const ConversationSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: {
    [fetchConversations.pending]: state => {
      state.fetching = true;
    },
    [fetchConversations.fulfilled]: (state, _action) => {
      const data = _action.payload;

      if (state.currentPage == 1) {
        state.conversations = [];
      }

      if (data && data.length > 0) {
        state.conversations = state.conversations.concat(data);
      } else {
        state.currentPage = -1;
      }
      state.fetching = false;
    },
    [fetchConversations.rejected]: state => {
      state.conversations = [];
      state.fetching = false;
    },
  },
});

const { reducer } = ConversationSlice;
export default reducer;
export const { setCurrentPage } = ConversationSlice.actions;