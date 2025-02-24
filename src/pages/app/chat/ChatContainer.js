import { debounce } from "lodash";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchConversations, setConversationsRealTime, setCurrentPage } from "../../../redux/slices/Conversations";
import {
  fetchMessages,
  fetchSolutions,
  setEmptyConversationMessage,
  setEmptyMessages,
  setScrollBottom,
} from "../../../redux/slices/Messages";
import { fetchShops } from "../../../redux/slices/Shops";
import Chat from "./Chat";
import { ChatContextProvider } from "./ChatContext";

const ChatContainer = ({ currentUser }) => {
  const dispatch = useDispatch();
  const { conversationId } = useParams();
  const {
    shops: { shops, fetching: shopFetching },
    conversations: { conversations, fetching: conversationFetching, defaultItemsPerPage },
    messages: { conversation, solutionsMessages },
  } = useSelector((state) => state);

  const fetchDataShops = useCallback(() => {
    dispatch(fetchShops());
  }, [dispatch]);

  const fetchDataConversations = useCallback(
    (args = {}) => {
      dispatch(setCurrentPage(args.page || 1));
      dispatch(
        fetchConversations({
          params: {
            page: 1,
            items_per_page: defaultItemsPerPage,
            ...args,
          },
        })
      );
    },
    [dispatch, defaultItemsPerPage]
  );

  const handleConversationsRealTime = useCallback(
    (args = {}) => {
      dispatch(
        setConversationsRealTime({
          ...args,
        })
      );
    },
    [dispatch]
  );

  const handleChangeScroll = useCallback(
    (value) => {
      dispatch(setScrollBottom(value));
    },
    [dispatch]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchDataMessage = useCallback(
    debounce(({ conversationId, clearMessage = false, toScrollBottom = false }) => {
      if (clearMessage) {
        dispatch(setEmptyMessages());
      }

      dispatch(fetchMessages({ conversationId })).then(() => {
        handleChangeScroll(toScrollBottom);
      });
    }, 400),
    []
  );

  const fetchDataMessage = useCallback(
    (params) => {
      debouncedFetchDataMessage(params);
    },
    [debouncedFetchDataMessage]
  );

  const handleSetEmptyConversationMessage = useCallback(
    (data) => {
      dispatch(setEmptyConversationMessage(data));
    },
    [dispatch]
  );

  const handleFetchSolutions = useCallback(
    (conversationId, params = {}) => {
      dispatch(fetchSolutions({ conversationId, params }));
    },
    [dispatch]
  );

  useEffect(() => {
    if (conversationId) {
      handleFetchSolutions(conversationId);
      fetchDataMessage({ conversationId, clearMessage: true, toScrollBottom: true });
    }
  }, [conversationId, fetchDataMessage, handleFetchSolutions]);

  useEffect(() => {
    if (conversationId) {
      fetchDataMessage({ conversationId, toScrollBottom: false });
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
        handleFetchSolutions={handleFetchSolutions}
        solutionsMessages={solutionsMessages}
        handleConversationsRealTime={handleConversationsRealTime}
      />
    </ChatContextProvider>
  );
};

export default ChatContainer;
