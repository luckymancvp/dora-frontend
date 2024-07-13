import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Chat from "./Chat";
import { ChatContextProvider } from "./ChatContext";
import { fetchShops } from "../../../redux/slices/Shops";
import { fetchConversations, setCurrentPage } from "../../../redux/slices/Conversations";
import { fetchMessages, createMessage } from "../../../redux/slices/Messages";

const ChatContainer = () => {
  const dispatch = useDispatch();
  const {
    shops: { shops, fetching: shopFetching }, 
    conversations: { conversations, fetching: conversationFetching },
    messages: { messages, conversation, fetching: messageFetching}
  } = useSelector(state => state);

  const fetchDataShops = useCallback((args = {}) => {
    dispatch(fetchShops()).unwrap();
  }, [dispatch]);

  const fetchDataConversations = useCallback((args = {}) => {
    dispatch(setCurrentPage(args.page || 1));
    dispatch(fetchConversations({
      params: {
        page: 1,
        items_per_page: 10,
        ...args,
      },
    })).unwrap();
  }, [dispatch]);

  const fetchDataMessage = useCallback((conversationId) => {
    dispatch(fetchMessages({ conversationId })).unwrap();
  }, [dispatch]);

  const handleSendMessage = useCallback((formValues, conversationId) => {
    const formData = new FormData();

    formData.append("message", formValues.message);
    if (formValues.files) {
      [...formValues.files].forEach(file => {
        formData.append("attachments[]", file);
      });
    }

    dispatch(createMessage({ conversationId, formData })).unwrap().then(() => {
      fetchDataMessage(conversationId);
    });
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
        fetchMessages={fetchDataMessage}
        conversation={conversation}
        messageFetching={messageFetching}
        messages={messages}
        handleSendMessage={handleSendMessage}
      />
    </ChatContextProvider>
  );
};
export default ChatContainer;
