import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fetchConversationsRequest from "../services/ConversationsService";

export const fetchConversations = createAsyncThunk("conversations/FETCH_CONVERSATIONS", async (data = {}) => {
  const result = await fetchConversationsRequest(data);
  return result?.data;
});

const initialState = {
  conversations: [],
  fetching: false,
  currentPage: 1,
  defaultItemsPerPage: 20,
};

const ConversationSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setConversationsRealTime: (state, action) => {
      if (state.conversations.length) {
        const existingConversationIndex = state.conversations.findIndex(
          (conv) => conv.etsy.conversationId === action.payload.jsonData?.Message?.conversation_id
        );

        if (existingConversationIndex !== -1) {
          const updatedConversation = {
            ...state.conversations[existingConversationIndex],
            etsy: {
              ...state.conversations[existingConversationIndex].etsy,
              isUnread: true,
              detail: {
                ...state.conversations[existingConversationIndex].etsy.detail,
                messages: {
                  ...action.payload.jsonData.Message.etsy,
                },
              },
            },
          };
          state.conversations = [
            ...state.conversations.slice(0, existingConversationIndex),
            updatedConversation,
            ...state.conversations.slice(existingConversationIndex + 1),
          ];
        } else {
          const updatedConversation = {
            ...action.payload.jsonData.Conversation,
            etsy: {
              ...action.payload.jsonData.Conversation.etsy,
              isUnread: true,
              detail: {
                ...action.payload.jsonData.Conversation.etsy.detail,
                messages: {
                  ...action.payload.jsonData.Message.etsy,
                },
              },
            },
          };

          const existingConversations = state.conversations.filter(
            (conversation) => conversation.etsy.conversation_id !== updatedConversation.etsy.conversation_id
          );
          state.conversations = [updatedConversation, ...existingConversations];
        }
      }
    },
    setConversations: (state, action) => {
      state.conversations = [...action.payload.newConversations];
    },
  },
  extraReducers: {
    [fetchConversations.pending]: (state) => {
      state.fetching = true;
    },
    [fetchConversations.fulfilled]: (state, action) => {
      const data = action.payload;

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
    [fetchConversations.rejected]: (state) => {
      state.conversations = [];
      state.fetching = false;
    },
  },
});

const { reducer } = ConversationSlice;
export default reducer;
export const { setCurrentPage, setConversationsRealTime, setConversations } = ConversationSlice.actions;
