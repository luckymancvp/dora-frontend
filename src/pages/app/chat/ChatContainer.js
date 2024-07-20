import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import { debounce } from 'lodash';
import Chat from "./Chat";
import { ChatContextProvider } from "./ChatContext";
import { fetchShops } from "../../../redux/slices/Shops";
import { fetchConversations, setCurrentPage } from "../../../redux/slices/Conversations";
import { fetchMessages, setEmptyMessages, setEmptyConversationMessage, setScrollBottom } from "../../../redux/slices/Messages";
import { fetchAIMessage } from "../../../redux/slices/AIMessages"; 

const ChatContainer = ({ currentUser }) => {
  const dispatch = useDispatch();
  const { conversationId } = useParams();
  const [aiSolutions, setAiSolutions] = useState([]);
  const [aiMessageDefaut, setAiMessageDefault] = useState([]);
  const {
    shops: { shops, fetching: shopFetching },
    conversations: { conversations, fetching: conversationFetching, defaultItemsPerPage },
    messages: { conversation }
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchDataMessage = useCallback(debounce(({ conversationId, clearMessage = false, toScrollBottom = false }) => {
    if (clearMessage) {
      dispatch(setEmptyMessages());
    }
    dispatch(fetchMessages({ conversationId })).then(() => {
      handleChangeScroll(toScrollBottom);
    });
  }, 400), []);

  const fetchDataMessage = useCallback((params) => {
    debouncedFetchDataMessage(params);
  }, [debouncedFetchDataMessage]);

  const handleSetEmptyConversationMessage = useCallback(data => {
    dispatch(setEmptyConversationMessage(data));
  }, [dispatch]);

  const [loadingAI, setLoadingAI] = useState(false);

useEffect(() => {
  if (conversationId) {
    setLoadingAI(true);
    dispatch(fetchAIMessage({ conversationId: String(conversationId) })).unwrap().then((aiMessage) => {
      console.log('AI Message:', aiMessage);
      setAiSolutions(aiMessage.solutions);
      setAiMessageDefault(aiMessage.message);
      setLoadingAI(false);
    }).catch((error) => {
      console.error('Failed to fetch AI message:', error);
      setLoadingAI(false);
    });
    console.log('conversationId:', conversationId);
  }
}, [conversationId, fetchDataMessage, dispatch]);

  useEffect(() => {
    if (conversationId) {
      const intervalId = setInterval(() => {
        fetchDataMessage({ conversationId, toScrollBottom: false });
      }, 5000);

      // Cleanup interval on unmount
      return () => clearInterval(intervalId);
    }
  }, [conversationId, fetchDataMessage]);
  
  return (
    <ChatContextProvider>
      <Chat
        currentUser={currentUser}
        fetchDataShops={fetchDataShops}
        shopFetching={shopFetching}
        shops={shops}
        fetchConversations={fetchDataConversations}
        conversationFetching={conversationFetching}
        conversations={conversations}
        fetchDataMessage={fetchDataMessage}
        conversation={conversation}
        handleSetEmptyConversationMessage={handleSetEmptyConversationMessage}
        conversationId={conversationId}
        aiSolutions={aiSolutions}
        aiMessageDefaut={aiMessageDefaut}
        loadingAI={loadingAI}
      />
    </ChatContextProvider>
  );
};

export default ChatContainer;
