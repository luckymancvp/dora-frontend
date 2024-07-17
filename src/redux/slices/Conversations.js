import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fetchConversationsRequest from "../services/ConversationsService";

export const fetchConversations = createAsyncThunk(
  "conversations/FETCH_CONVERSATIONS",
  async (data = {}) => {
    const result = await fetchConversationsRequest(data);
    return result?.data;
  },
);

const initialState = {
  conversations: [],
  fetching: false,
  currentPage: 1,
  defaultItemsPerPage: 20
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

      if (state.currentPage === 1) {
        state.conversations = [];
      }

      if (data && data != null) {
        const dataLength = data.length;
        if (dataLength > 0) {
          state.conversations = state.conversations.concat(data);
        }

        if (dataLength < state.defaultItemsPerPage) {
          state.currentPage = -1;
        }
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