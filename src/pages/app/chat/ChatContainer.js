import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import Chat from "./Chat";
import { ChatContextProvider } from "./ChatContext";
import { fetchShops } from "../../../redux/slices/Shops";
import { fetchConversations, setCurrentPage } from "../../../redux/slices/Conversations";
import { fetchMessages, setEmptyMessages, setEmptyConversationMessage } from "../../../redux/slices/Messages";

const ChatContainer = () => {
  const dispatch = useDispatch();
  const { conversationId } = useParams();
  const {
    shops: { shops, fetching: shopFetching }, 
    conversations: { conversations, fetching: conversationFetching },
    messages: { messages, conversation, fetching: messageFetching}
  } = useSelector(state => state);

  const fetchDataShops = useCallback((args = {}) => {
    dispatch(fetchShops());
  }, [dispatch]);

  const fetchDataConversations = useCallback((args = {}) => {
    dispatch(setCurrentPage(args.page || 1));
    dispatch(fetchConversations({
      params: {
        page: 1,
        items_per_page: 20,
        ...args,
      },
    }));
  }, [dispatch]);

  const fetchDataMessage = useCallback((conversationId, clearMessage = false) => {
    if (clearMessage) {
      dispatch(setEmptyMessages());
    }
    dispatch(fetchMessages({ conversationId }));
  }, [dispatch]);

  const handleSetEmptyConversationMessage = useCallback(data => {
    dispatch(setEmptyConversationMessage(data));
  }, [dispatch]);

  return (
    <ChatContextProvider>
      <Chat 
        fetchDataShops={fetchDataShops}
        shopFetching={shopFetching}
        shops={shops}
        fetchConversations={fetchDataConversations}
        conversationFetching={conversationFetching}
        conversations={conversations}
        fetchDataMessage={fetchDataMessage}
        conversation={conversation}
        messageFetching={messageFetching}
        messages={messages}
        handleSetEmptyConversationMessage={handleSetEmptyConversationMessage}
        conversationId={conversationId}
      />
    </ChatContextProvider>
  );
};
export default ChatContainer;
