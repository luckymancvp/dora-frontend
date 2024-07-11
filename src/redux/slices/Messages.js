import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import MessagesService from "../services/MessagesService";

export const fetchMessages = createAsyncThunk(
  "messages/FETCH_MESSAGES",
  async ({ conversationId }) => {
    const result = await MessagesService.fetchMessages(conversationId);
    return result?.data;
  },
);

export const createMessage = createAsyncThunk(
  "messages/CREATE_MESSAGE",
  async ({ formData, conversationId }) => {
    const result = await MessagesService.createMessage(conversationId, formData);
    return result?.data;
  },
);

const initialState = {
  conversation: {},
  messages: [],
  fetching: false,
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  extraReducers: {
    [fetchMessages.pending]: state => {
      state.fetching = true;
    },
    [fetchMessages.fulfilled]: (state, action) => {
      state.conversation = action.payload?.conversation || {};
      state.messages = action.payload?.messages || [];
      state.fetching = false;
    },
    [fetchMessages.rejected]: state => {
      state.conversation = {};
      state.messages = [];
      state.fetching = false;
    },
  },
});

const { reducer } = messagesSlice;
export default reducer;
