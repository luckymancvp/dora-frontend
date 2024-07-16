import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import { debounce } from 'lodash';
import Chat from "./Chat";
import { ChatContextProvider } from "./ChatContext";
import { fetchShops } from "../../../redux/slices/Shops";
import { fetchConversations, setCurrentPage } from "../../../redux/slices/Conversations";
import { fetchMessages, setEmptyMessages, setEmptyConversationMessage, setScrollBottom } from "../../../redux/slices/Messages";

const ChatContainer = () => {
  const dispatch = useDispatch();
  const { conversationId } = useParams();
  const {
    shops: { shops, fetching: shopFetching },
    conversations: { conversations, fetching: conversationFetching, defaultItemsPerPage },
    messages: { messages, sendingMessages, conversation, fetching: messageFetching, scrollBottom }
  } = useSelector(state => state);

  const fetchDataShops = useCallback(() => {
    dispatch(fetchShops());
  }, [dispatch]);

  const fetchDataConversations = useCallback((args = {}) => {
    dispatch(setCurrentPage(args.page || 1));
    dispatch(fetchConversations({
      params: {
        page: 1,
        items_per_page: defaultItemsPerPage,
        ...args,
      },
    }));
  }, [dispatch, defaultItemsPerPage]);

  const handleChangeScroll = useCallback(value => {
    dispatch(setScrollBottom(value));
  }, [dispatch]);

  const fetchDataMessage = useCallback(debounce(({ conversationId, clearMessage = false, toScrollBottom = false }) => {
    if (clearMessage) {
      dispatch(setEmptyMessages());
    }

    dispatch(fetchMessages({ conversationId })).then(() => {
      handleChangeScroll(toScrollBottom);
    });
  }, 400), [dispatch]);

  const handleSetEmptyConversationMessage = useCallback(data => {
    dispatch(setEmptyConversationMessage(data));
  }, [dispatch]);

  useEffect(() => {
    if (conversationId) {
      fetchDataMessage({ conversationId, clearMessage: true, toScrollBottom: true });
    }
  }, [conversationId, fetchDataMessage]);

  useEffect(() => {
    if (conversationId) {
      const intervalId = setInterval(() => {
        fetchDataMessage({ conversationId, toScrollBottom: true });
      }, 5000);

      // Cleanup interval on unmount
      return () => clearInterval(intervalId);
    }
  }, [conversationId, fetchDataMessage]);

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
        scrollBottom={scrollBottom}
        sendingMessages={sendingMessages}
      />
    </ChatContextProvider>
  );
};

export default ChatContainer;
