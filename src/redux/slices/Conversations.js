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
  fetching: false
};

const ConversationSlice = createSlice({
  name: "conversations",
  initialState,
  extraReducers: {
    [fetchConversations.pending]: state => {
      state.fetching = true;
    },
    [fetchConversations.fulfilled]: (state, _action) => {
      state.conversations = _action.payload || [];
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
