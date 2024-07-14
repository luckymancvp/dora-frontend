import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import MessagesService from "../services/MessagesService";
import { isBlank } from "../../utils/Utils";

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

export const fetchStatusMessage = createAsyncThunk(
  "messages/FETCH_STATUS_MESSAGE",
  async ({ id }) => {
    const result = await MessagesService.fetchStatusMessages(id);
    return result?.data;
  },
);

const initialState = {
  conversation: {},
  messages: [],
  sendingMessages: [],
  fetching: false,
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setEmptyConversationMessage: (state, _action) => {
      state.messages = [];
      state.conversation = {};
    },
    setEmptyMessages: (state, _action) => {
      state.messages = [];
    },
  },
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
    [createMessage.fulfilled]: (state, action) => {
      const data = action.payload?.message;

      if (!isBlank(data) && data?.conversationId) {
        const findMessage = state.messages.find(msg => msg.id === data.id);
        if (!findMessage) {
          state.messages = state.messages.concat(data);
        }
      }
    },
    [fetchStatusMessage.fulfilled]: (state, action) => {
      const data = action.payload;

      if (!isBlank(data) && data.conversationId) {
        const findMessage = state.messages.find(msg => msg.id === data.id);
        if (!findMessage) {
          state.messages = state.messages.concat(data);
        }
      }
    },
  },
});

const { reducer } = messagesSlice;
export default reducer;
export const { setEmptyMessages, setEmptyConversationMessage } = messagesSlice.actions;
