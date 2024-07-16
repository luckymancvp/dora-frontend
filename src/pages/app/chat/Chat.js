import React, { useEffect, useState, useContext } from "react";
import Head from "../../../layout/head/Head";
import ContentAlt from "../../../layout/content/ContentAlt";
import AppContact from "./contact/Contact";
import ChatBody from "./ChatBody";
import User from "../../../images/avatar/b-sm.jpg";
import { Button, Icon, UserAvatar } from "../../../components/Component";
import { DropdownMenu, DropdownToggle, UncontrolledDropdown, DropdownItem } from "reactstrap";
import { isBlank } from "../../../utils/Utils";
import { chatData } from "./ChatData";
import { ChatContext } from "./ChatContext";
import { Link } from "react-router-dom";
import { ChannelAsideBody, ChatAsideBody } from "./ChatAsideBody";
import { debounce } from 'lodash';

const Chat = ({
  fetchDataShops,
  shops,
  fetchConversations,
  conversationFetching,
  conversations,
  messageFetching,
  conversation,
  messages,
  handleSetEmptyConversationMessage,
  fetchDataMessage,
  sendingMessages,
  scrollBottom,
  conversationId
}) => {
  const [mainTab, setMainTab] = useState("Chats");
  const [selectedId, setSelectedId] = useState();
  const [filterTab, setFilterTab] = useState("messages");
  const [filterTabs, setFilterTabs] = useState(() => {
    const savedTabs = localStorage.getItem("filtertabs");
    return savedTabs ? JSON.parse(savedTabs) : { "messages": true };
  });
  const [filteredChatList, setFilteredChatList] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [shopState, setShopState] = useState(false);
  const [shopFilter, setShopFilter] = useState([]);
  const [shopFilterText, setShopFilterText] = useState("");
  const [mobileView, setMobileView] = useState(false);
  const { chatState, fav } = useContext(ChatContext);
  const [chat, setChat] = chatState;
  const [favData] = fav;

  useEffect(() => {
    fetchDataShops();
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
    if (prop === "messages" && filterTabs.messages === false) {
      setFilterTabs({ messages: true });
    } else {
      setFilterTabs(prevState => ({
        ...prevState,
        messages: false,
        [prop]: prevState[prop] ? !prevState[prop] : true
      }));
    }
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

  return (
    <>
      <Head title="Chat / Messenger"></Head>
      <ContentAlt>
        <div className="nk-chat">
          <div className={`nk-chat-aside ${mobileView ? "has-aside" : ""}`}>
            <div className="nk-chat-aside-head">
              <div className="nk-chat-aside-user">
                <UncontrolledDropdown>
                  <DropdownToggle tag="a" className="dropdown-toggle dropdown-indicator" style={{marginRight:'43px'}}>
                    <UserAvatar image={User}></UserAvatar>
                    <div className="title">{mainTab}</div>
                  </DropdownToggle>
                  {/* <DropdownMenu>
                    <ul className="link-list-opt no-bdr">
                      <li>
                        <DropdownItem
                          tag="a"
                          href="#contact"
                          onClick={(ev) => {
                            ev.preventDefault();
                            setMainTab(mainTab === "Chats" ? "Contact" : "Chats");
                          }}
                        >
                          <span>{mainTab === "Chats" ? "Contact" : "Chats"}</span>
                        </DropdownItem>
                      </li>
                      <li>
                        <DropdownItem
                          tag="a"
                          href="#contact"
                          onClick={(ev) => {
                            ev.preventDefault();
                            setMainTab(mainTab === "Chats" ? "Channel" : mainTab === "Channel" ? "Contact" : "Channel");
                          }}
                        >
                          <span>{mainTab === "Chats" ? "Channel" : mainTab === "Channel" ? "Contact" : "Channel"}</span>
                        </DropdownItem>
                      </li>
                    </ul>
                  </DropdownMenu> */}
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
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdown"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                }}
                              >
                                <span>Settings</span>
                              </DropdownItem>
                            </li>
                            <li className="divider"></li>
                            <li
                              onClick={() => onFilterTabClick("messages")}
                              className={filterTabs.messages ? "active" : ""}
                            >
                              <DropdownItem
                                tag="a"
                                href="#dropdown"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                }}
                              >
                                <span>Messages</span>
                              </DropdownItem>
                            </li>
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
                    {/* <li>
                      <Button color="light" className="btn-round btn-icon">
                        <Icon name="edit-alt-fill"></Icon>
                      </Button>
                    </li> */}
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
              />
            ) : mainTab === "Channel" ? (
              <ChannelAsideBody
                filteredChatList={filteredChatList}
                onInputChange={onInputChange}
                setSelectedId={setSelectedId}
                setMobileView={setMobileView}
                selectedId={selectedId}
                chatItemClick={chatItemClick}
                filterTab={filterTab}
              />
            ) : (
              <AppContact setTab={setMainTab} setSelectedId={setSelectedId} />
            )}
          </div>
          {conversationId && !isBlank(conversation) ? (
            <ChatBody
              id={selectedId}
              setSelectedId={setSelectedId}
              mobileView={mobileView}
              conversationId={conversationId}
              conversation={conversation}
              fetchDataMessage={fetchDataMessage}
              messages={messages}
              sendingMessages={sendingMessages}
              messageFetching={messageFetching}
              scrollBottom={scrollBottom}
            />
          ) : (
            <div className="nk-chat-body">
              <div className="nk-chat-blank">
                <div className="nk-chat-blank-icon">
                  <Icon name="chat" className="icon-circle icon-circle-xxl bg-white"></Icon>
                </div>
                <div className="nk-chat-blank-btn">
                  <Link to={`${process.env.PUBLIC_URL}/messages`}>
                    <Button color="primary" disabled={mainTab === "Contact"} onClick={() => setMainTab("Contact")}>
                      Start Chat
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </ContentAlt>
    </>
  );
};

export default Chat;
