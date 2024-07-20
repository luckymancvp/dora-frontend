import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAIMessageRequest, fetchAIMessageRespone } from "../services/AIMessageService";

export const fetchAIMessage = createAsyncThunk(
  "aiMessage/FETCH_AI_MESSAGE",
  async ({ conversationId }) => {
    const result = await fetchAIMessageRequest(conversationId);
    return result.data;
  }
);

export const fetchAIMessageWithInput = createAsyncThunk(
  "aiMessage/FETCH_AI_MESSAGE_WITH_INPUT",
  async ({ conversationId, input }) => {
    const result = await fetchAIMessageRespone(conversationId, input);
    return result.data;
  }
);

const initialState = {
  aiMessage: null,
  fetching: false,
};

const AIMessageSlice = createSlice({
  name: "aiMessage",
  initialState,
  extraReducers: {
    [fetchAIMessage.pending]: (state) => {
      state.fetching = true;
    },
    [fetchAIMessage.fulfilled]: (state, action) => {
      state.aiMessage = action.payload;
      state.fetching = false;
    },
    [fetchAIMessage.rejected]: (state) => {
      state.aiMessage = null;
      state.fetching = false;
    },
    [fetchAIMessageWithInput.pending]: (state) => {
      state.fetching = true;
    },
    [fetchAIMessageWithInput.fulfilled]: (state, action) => {
      state.aiMessage = action.payload;
      state.fetching = false;
    },
    [fetchAIMessageWithInput.rejected]: (state) => {
      state.aiMessage = null;
      state.fetching = false;
    },
  },
});

export default AIMessageSlice.reducer;
