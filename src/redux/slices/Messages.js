import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isBlank } from "../../utils/Utils";
import {
  createMessageRequest,
  fetchMessagesRequest,
  fetchSolutionsRequest,
  fetchStatusMessagesRequest,
} from "../services/MessagesService";

export const fetchMessages = createAsyncThunk("messages/FETCH_MESSAGES", async ({ conversationId }) => {
  const result = await fetchMessagesRequest(conversationId);
  return result?.data;
});

export const createMessage = createAsyncThunk("messages/CREATE_MESSAGE", async ({ formData, conversationId }) => {
  const result = await createMessageRequest(conversationId, formData);
  return result?.data;
});

export const fetchStatusMessage = createAsyncThunk("messages/FETCH_STATUS_MESSAGE", async ({ id }) => {
  const result = await fetchStatusMessagesRequest(id);
  return result?.data;
});

export const fetchSolutions = createAsyncThunk(
  "messages/FETCH_SOLUTIONS_MESSAGE",
  async ({ conversationId, params }) => {
    const result = await fetchSolutionsRequest(conversationId, params);
    return result?.data;
  }
);

const initialState = {
  conversation: {},
  messages: [],
  solutionsMessages: {},
  sendingMessages: [],
  isSendingMessage: false,
  isFetchingSolution: false,
  fetching: false,
  scrollBottom: true,
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
    setScrollBottom: (state, action) => {
      state.scrollBottom = action.payload;
    },
    setMessgerRealTime: (state, action) => {
      let newData = {
        ...action.payload.jsonData.Message,
      };
      if (state.messages.length) {
        state.messages = [...state.messages, newData];
      }
    },
    setSendingMessgerRealTime: (state, action) => {
      if (state.sendingMessages.length) {
        const index = state.sendingMessages.findIndex((msg) => msg.id === action.payload.jsonData.Message.id);
        if (index !== -1) {
          let dataSending = { ...state.sendingMessages[index], status: "DONE" };

          state.sendingMessages = [
            ...state.sendingMessages.slice(0, index),
            dataSending,
            ...state.sendingMessages.slice(index + 1),
          ];
        }
      }
    },
  },
  extraReducers: {
    [fetchMessages.pending]: (state) => {
      state.fetching = true;
    },
    [fetchMessages.fulfilled]: (state, action) => {
      state.conversation = action.payload?.conversation || {};
      state.messages = action.payload?.messages || [];
      state.fetching = false;
    },
    [fetchMessages.rejected]: (state) => {
      state.conversation = {};
      state.messages = [];
      state.fetching = false;
    },
    [fetchSolutions.pending]: (state) => {
      state.isFetchingSolution = true;
      state.solutionsMessages = {};
    },
    [fetchSolutions.fulfilled]: (state, { payload }) => {
      state.isFetchingSolution = false;
      state.solutionsMessages = payload || {};
    },
    [fetchSolutions.rejected]: (state) => {
      state.isFetchingSolution = false;
      state.solutionsMessages = {};
    },
    [createMessage.rejected]: (state) => {
      state.isSendingMessage = false;
    },
    [createMessage.pending]: (state) => {
      state.isSendingMessage = true;
    },
    [createMessage.fulfilled]: (state, action) => {
      state.isSendingMessage = false;
      const data = action.payload?.message;

      if (!isBlank(data) && data?.conversationId) {
        const findMessage = state.messages.find((msg) => msg.id === data.id);
        if (!findMessage) {
          const currentTimestamp = new Date().toISOString();
          const newData = { ...data, firstTime: currentTimestamp };
          state.sendingMessages = state.sendingMessages.concat(newData);
        }
      }
    },
    [fetchStatusMessage.fulfilled]: (state, action) => {
      const data = action.payload;
      if (!isBlank(data) && data.conversationId) {
        const findMessage = state.messages.find((msg) => msg.id === data.id);
        if (!findMessage) {
          const index = state.sendingMessages.findIndex((message) => message.id === data.id);
          if (index !== -1) {
            state.sendingMessages[index] = { ...state.sendingMessages[index], ...data };
          } else {
            const currentTimestamp = new Date().toISOString();
            const newData = { ...data, firstTime: currentTimestamp };
            state.sendingMessages = state.sendingMessages.concat(newData);
          }
        }
      }
    },
  },
});

const { reducer } = messagesSlice;
export default reducer;
export const {
  setEmptyMessages,
  setEmptyConversationMessage,
  setScrollBottom,
  setMessgerRealTime,
  setSendingMessgerRealTime,
} = messagesSlice.actions;
