import { configureStore } from "@reduxjs/toolkit";
import ShopsReducer from "./slices/Shops";
import ConversationReducer from "./slices/Conversations";
import messagesReducer from "./slices/Messages";
import authSlice from "./slices/Authentications";

const store = configureStore({
  reducer: {
    conversations: ConversationReducer,
    messages: messagesReducer,
    shops: ShopsReducer,
    auth: authSlice,
  },
});

export default store;
