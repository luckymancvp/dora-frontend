import React, { useCallback, useContext, useEffect, useState } from "react";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { Button, Icon, UserAvatar } from "../../../components/Component";
import ContentAlt from "../../../layout/content/ContentAlt";
import Head from "../../../layout/head/Head";
import { isBlank } from "../../../utils/Utils";
import ChatBody from "./ChatBody";
import { ChatContext } from "./ChatContext";
import { chatData } from "./ChatData";
import AppContact from "./contact/Contact";
// import { Link } from "react-router-dom";
import { Realtime } from "ably";
import { debounce } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { setConversations } from "../../../redux/slices/Conversations";
import { setMessgerRealTime, setSendingMessgerRealTime } from "../../../redux/slices/Messages";
import { ChannelAsideBody, ChatAsideBody } from "./ChatAsideBody";

const Chat = ({
  currentUser,
  fetchDataShops,
  shops,
  fetchConversations,
  conversationFetching,
  conversations,
  conversation,
  handleSetEmptyConversationMessage,
  fetchDataMessage,
  handleFetchSolutions,
  conversationId,
  solutionsMessages,
  handleConversationsRealTime,
}) => {
  const dispatch = useDispatch();
  const [ably] = useState(() => new Realtime({ key: process.env.REACT_APP_ABLY_API_KEY }));
  const [channel, setChannel] = useState(ably.channels.get("all"));
  const { sendingMessages } = useSelector((state) => state.messages);
  const [mainTab, setMainTab] = useState("Chats");
  const [selectedId, setSelectedId] = useState();
  const [filterTabs, setFilterTabs] = useState(() => {
    const savedTabs = localStorage.getItem("filter_tabs");
    return savedTabs ? JSON.parse(savedTabs) : {};
  });
  const [filteredChatList, setFilteredChatList] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [shopState, setShopState] = useState(false);
  const [shopFilter, setShopFilter] = useState([]);
  const [shopFilterText, setShopFilterText] = useState("");
  const [mobileView, setMobileView] = useState(false);
  const { chatState } = useContext(ChatContext);
  const [chat, setChat] = chatState;

  useEffect(() => {
    fetchDataShops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (conversationId !== undefined && conversationId !== null) {
      fetchDataMessage({ conversationId, clearMessage: true });
      if (window.innerWidth < 860) {
        setMobileView(true);
      }
    } else {
      handleSetEmptyConversationMessage([]);
    }
  }, [conversationId, fetchDataMessage, handleSetEmptyConversationMessage]);

  // Filtering users by search
  useEffect(() => {
    if (filterText !== "") {
      const filteredObject = chatData.filter((item) => {
        return item.name.toLowerCase().includes(filterText.toLowerCase());
      });
      setFilteredChatList([...filteredObject]);
    } else {
      setFilteredChatList([...chatData]);
    }
  }, [filterText, setFilteredChatList]);

  // Filtering shop users by search
  useEffect(() => {
    if (shopFilterText !== "") {
      const filteredObject = shops.filter((item) => {
        return item.shopName.toLowerCase().includes(shopFilterText.toLowerCase());
      });
      setShopFilter([...filteredObject]);
    } else {
      setShopFilter([]);
    }
  }, [shopFilterText, shops]);

  const onInputChange = (e) => {
    setFilterText(e.target.value);
  };

  const shopInputSearchChange = debounce((e) => {
    setShopFilterText(e.target.value);
  }, 300);

  const onFilterTabClick = (prop) => {
    setFilterTabs((prevState) => ({
      ...prevState,
      [prop]: prevState[prop] ? !prevState[prop] : true,
    }));
  };

  useEffect(() => {
    localStorage.setItem("filter_tabs", JSON.stringify(filterTabs));
  }, [filterTabs]);

  const chatItemClick = (id) => {
    let data = chat;
    const index = data.findIndex((item) => item.id === id);
    const dataSet = data.find((item) => item.id === id);
    if (dataSet.unread === true) {
      data[index].unread = false;
      setChat([...data]);
    }
    setSelectedId(id);
    if (window.innerWidth < 860) {
      setMobileView(true);
    }
  };

  const chatItemConversationClick = (id) => {
    let data = conversations;
    const index = data.findIndex((item) => item.id === id);
    const dataSet = data.find((item) => item.id === id);
    if (dataSet.etsy.isUnread === true) {
      const updatedEtsy = { ...data[index].etsy, isUnread: false };
      const newConversations = [...data];
      newConversations[index] = { ...newConversations[index], etsy: updatedEtsy };
      dispatch(setConversations({ newConversations }));
    }
  };

  const AblyMessageSubscriber = ({ onNewMessage }) => {
    const handleMessage = useCallback(
      (message) => {
        const uint8Array = new Uint8Array(message.data);
        const textDecoder = new TextDecoder("utf-8");
        const jsonString = textDecoder.decode(uint8Array);
        const jsonData = JSON.parse(jsonString);
        onNewMessage(jsonData);
      },
      [onNewMessage]
    );

    const subscribeToChannel = useCallback(() => {
      const newChannel = ably.channels.get("all");
      newChannel.subscribe("new-message-event", handleMessage);
      setChannel(newChannel);
    }, [handleMessage]);

    const unsubscribeFromChannel = useCallback(() => {
      if (channel) {
        channel.unsubscribe("new-message-event", handleMessage);
      }
    }, [handleMessage]);

    useEffect(() => {
      subscribeToChannel();
      return unsubscribeFromChannel;
    }, [subscribeToChannel, unsubscribeFromChannel]);

    return null;
  };

  const handleNewMessage = (message) => {
    let jsonData = message;
    if (conversationId && conversationId === jsonData?.Message?.conversation_id) {
      let index = sendingMessages.find((mess) => mess.id === jsonData?.Message?.id);
      if (sendingMessages.length === 0 || !index) {
        dispatch(setMessgerRealTime({ jsonData }));
      } else {
        dispatch(setSendingMessgerRealTime({ jsonData }));
      }
    } else {
      handleConversationsRealTime({ jsonData });
    }
  };

  return (
    <>
      <AblyMessageSubscriber onNewMessage={handleNewMessage} />
      <Head title="Chat / Messenger"></Head>
      <ContentAlt>
        <div className="nk-chat">
          <div className={`nk-chat-aside ${mobileView ? "has-aside" : ""}`}>
            <div className="nk-chat-aside-head">
              <div className="nk-chat-aside-user">
                <UncontrolledDropdown>
                  {/* <DropdownToggle tag="a" className="dropdown-toggle dropdown-indicator"> */}
                  <UserAvatar image={currentUser.picture} title={currentUser.name}></UserAvatar>
                  <div className="title">{mainTab}</div>
                  {/* </DropdownToggle> */}
                </UncontrolledDropdown>
              </div>
              <ul className="nk-chat-aside-tools g-2">
                {mainTab === "Chats" || mainTab === "Channel" ? (
                  <>
                    <li>
                      <UncontrolledDropdown>
                        <DropdownToggle tag="a" className="btn btn-round btn-icon btn-light dropdown-toggle">
                          <Icon name="setting-alt-fill"></Icon>
                        </DropdownToggle>
                        <DropdownMenu end>
                          <ul className="link-list-opt no-bdr">
                            {/* <li className="divider"></li> */}
                            <li
                              onClick={() => onFilterTabClick("only_is_order_help_request")}
                              className={filterTabs.only_is_order_help_request ? "active" : ""}
                            >
                              <DropdownItem
                                tag="a"
                                href="#dropdown"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                }}
                              >
                                <span>Help request</span>
                              </DropdownItem>
                            </li>
                            <li
                              onClick={() => onFilterTabClick("only_not_replied")}
                              className={filterTabs.only_not_replied ? "active" : ""}
                            >
                              <DropdownItem
                                tag="a"
                                href="#dropdown"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                }}
                              >
                                <span>Not Replied</span>
                              </DropdownItem>
                            </li>
                            <li
                              onClick={() => onFilterTabClick("only_has_order")}
                              className={filterTabs.only_has_order ? "active" : ""}
                            >
                              <DropdownItem
                                tag="a"
                                href="#dropdown"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                }}
                              >
                                <span>Has Order</span>
                              </DropdownItem>
                            </li>
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li>
                  </>
                ) : (
                  <li>
                    <Button color="light" className="btn-round btn-icon">
                      <Icon name="user-add-fill"></Icon>
                    </Button>
                  </li>
                )}
              </ul>
            </div>
            {mainTab === "Chats" ? (
              <ChatAsideBody
                onInputChange={onInputChange}
                filteredChatList={filteredChatList}
                shopState={shopState}
                shopFilter={shopFilter}
                setShopFilter={setShopFilter}
                setShopState={setShopState}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                shopInputSearchChange={shopInputSearchChange}
                shopFilterText={shopFilterText}
                filterTabs={filterTabs}
                shops={shops}
                conversations={conversations}
                fetchConversations={fetchConversations}
                conversationFetching={conversationFetching}
                chatItemConversationClick={chatItemConversationClick}
              />
            ) : mainTab === "Channel" ? (
              <ChannelAsideBody
                filteredChatList={filteredChatList}
                onInputChange={onInputChange}
                setSelectedId={setSelectedId}
                setMobileView={setMobileView}
                selectedId={selectedId}
                chatItemClick={chatItemClick}
              />
            ) : (
              <AppContact setTab={setMainTab} setSelectedId={setSelectedId} />
            )}
          </div>
          {conversationId && !isBlank(conversation) ? (
            <ChatBody
              mobileView={mobileView}
              conversationId={conversationId}
              conversation={conversation}
              solutions={solutionsMessages}
              handleFetchSolutions={handleFetchSolutions}
            />
          ) : (
            <div className="nk-chat-body">
              <div className="nk-chat-blank">
                <div className="nk-chat-blank-icon">
                  <Icon name="chat" className="icon-circle icon-circle-xxl bg-white"></Icon>
                </div>
                {/* <div className="nk-chat-blank-btn">
                  <Link to={`${process.env.PUBLIC_URL}/messages`}>
                    <Button color="primary" disabled={mainTab === "Contact"}>
                      Start Chat
                    </Button>
                  </Link>
                </div> */}
              </div>
            </div>
          )}
        </div>
      </ContentAlt>
    </>
  );
};

export default Chat;
