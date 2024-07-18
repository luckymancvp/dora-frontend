import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Icon, UserAvatar } from "../../../components/Component";
import SimpleBar from "simplebar-react";
import { useSelector } from 'react-redux';
import { debounce } from 'lodash';
import { Input, Button, Spinner } from "reactstrap";
import { ChatItem, ChatRoomItem, ContactItem } from "./ChatPartials";
import { findUpper } from "../../../utils/Utils";
import { chatData } from "./ChatData";

export const ChatAsideBody = ({
  shopState,
  setShopState,
  filterTabs,
  shops,
  conversations,
  fetchConversations,
  conversationFetching,
}) => {
  const conversationRef = useRef(null);
  const { conversations: { currentPage } } = useSelector(state => state);
  const [shopFilter, setShopFilter] = useState([]);
  const [shopFilterText, setShopFilterText] = useState("");
  const [conversationFilterText, setConversationFilterText] = useState("");
  const [shopData, setShopData] = useState(() => {
    const savedShopData = localStorage.getItem("shops");
    return savedShopData ? JSON.parse(savedShopData) : [];
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleLoadMoreConversations = useCallback(debounce((args = {}) => {
    const shopIds = shopData.map(shop => shop.userId).join(",");
    fetchConversations({ ...filterTabs, search: conversationFilterText, shop_ids: shopIds, ...args });
  }, 500), [currentPage, filterTabs, conversationFilterText, shopData]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSearchConversations = useCallback(debounce((text) => {
    handleLoadMoreConversations({ page: 1, search: text });
  }, 500), [filterTabs, conversationFetching]);

  useEffect(() => {
    if (!conversationFetching) {
      handleLoadMoreConversations({ page: 1 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterTabs, shopData]);

  useEffect(() => {
    const handleScrollConversations = () => {
      const { scrollTop, clientHeight, scrollHeight } = conversationRef.current;

      if (scrollTop + clientHeight > (scrollHeight - 250)) {
        if (currentPage > 0 && !conversationFetching) {
          handleLoadMoreConversations({ page: currentPage + 1 });
        }
      }
    };
    const currentConversationRef = conversationRef.current;
    currentConversationRef?.addEventListener('scroll', handleScrollConversations);
    return () => {
      currentConversationRef?.removeEventListener('scroll', handleScrollConversations);
    };
  }, [fetchConversations, conversationFetching, currentPage, handleLoadMoreConversations]);

  const addShop = (newShop) => {
    const isDuplicate = shopData.some(shop => shop.userId === newShop.userId);
    if (!isDuplicate) {
      setShopData([...shopData, newShop]);
    }
  };

  const removeShop = (userId) => {
    setShopData(shopData.filter(shop => shop.userId !== userId));
  };

  useEffect(() => {
    localStorage.setItem("shops", JSON.stringify(shopData));
  }, [shopData]);

  const filteredShopList = shops.filter(shop => !shopData.some(s => s.userId === shop.userId));

  const shopInputSearchChange = debounce((e) => {
    setShopFilterText(e.target.value);
  }, 300);

  useEffect(() => {
    if (shopFilterText !== "") {
      const filteredShopList = shops.filter(shop => !shopData.some(s => s.userId === shop.userId));
      const filteredObject = filteredShopList.filter((item) => {
        return item.shopName.toLowerCase().includes(shopFilterText.toLowerCase());
      });
      setShopFilter([...filteredObject]);
    } else {
      setShopFilter([]);
    }
  }, [shopFilterText, shops, shopData, shopState]);

  const renderConversations = useMemo(() => conversations.map((item, idx) => (
    <ChatRoomItem key={`filter-conversations-${idx}`} item={item} />
  )), [conversations])

  return (
    <SimpleBar className="nk-chat-aside-body" scrollableNodeProps={{ ref: conversationRef }}>
      <div className="nk-chat-aside-search">
        <div className="form-group">
          <div className="form-control-wrap">
            <div className="form-icon form-icon-left">
              <Icon name="search"></Icon>
            </div>
            <Input
              type="text"
              className="form-round"
              id="default-03"
              placeholder="Search conversation"
              value={conversationFilterText}
              onChange={(e) => {
                const value = e.target.value;
                setConversationFilterText(value);
                onSearchConversations(value)
              }}
            />
          </div>
        </div>
      </div>
      {/* handle add and remove shop */}
      <div className="nk-chat-aside-panel nk-chat-fav">
        <h6 className="title overline-title-alt">SHOPS</h6>
        <ul className="fav-list">
          <li>
            <Button
              color="light"
              outline
              size="lg"
              className="btn-icon btn-white btn-round"
              onClick={() => {
                setShopFilterText("");
                setShopState(!shopState)
              }}
            >
              <Icon name={shopState ? "cross" : "plus"}></Icon>
            </Button>
          </li>
          {shopData.map((shop, idx) => {
            return (
              <li key={`shop-${idx}`}>
                <span onClick={(ev) => ev.preventDefault()} title={shop.shopName}>
                  <UserAvatar image={shop.avatarUrl} theme="gray" text={findUpper(shop.shopName)} />
                </span>
                <span className="btn-rm" onClick={() => removeShop(shop.userId)}><Icon name="cross-sm"></Icon></span>
              </li>
            );
          })}
        </ul>
      </div>
      {/* handle search shop by name */}
      {shopState && (
        <SimpleBar className="nk-chat-aside-body">
          <div className="nk-chat-aside-search">
            <div className="form-group">
              <div className="form-control-wrap">
                <div className="form-icon form-icon-left">
                  <Icon name="search"></Icon>
                </div>
                <Input
                  type="text"
                  className="form-round"
                  id="default-03"
                  placeholder="Search by name"
                  onChange={(e) => shopInputSearchChange(e)}
                />
              </div>
            </div>
          </div>
          <div className="nk-chat-aside-panel nk-chat-contact">
            <ul className="contacts-list chat-members">
              {shopFilter.length === 0 ? (
                shopFilterText ? (
                  <div className="ms-3">No shop found</div>
                ) : (
                  filteredShopList.map((shop, idx) => {
                    return (
                      <li key={`filter-shop-${idx}`} onClick={() => addShop(shop)}>
                        <div className="user-card">
                          <a href="#card" onClick={(ev) => ev.preventDefault()}>
                            <UserAvatar
                              text={findUpper(shop.shopName)}
                              theme="grey"
                              image={shop.avatarUrl}
                            ></UserAvatar>
                            <div className="user-name">{shop.shopName}</div>
                          </a>
                          <div className="user-actions">
                            <a href="#add-fav" onClick={(ev) => ev.preventDefault()}>
                              Add to shop
                            </a>
                          </div>
                        </div>
                      </li>
                    );
                  })
                )
              ) : (
                shopFilter.map((shop, idx) => {
                  return (
                    <li key={`shop-all-${idx}`} onClick={() => addShop(shop)}>
                      <div className="user-card">
                        <a href="#card" onClick={(ev) => ev.preventDefault()}>
                          <UserAvatar
                            text={findUpper(shop.shopName)}
                            theme="grey"
                            image={shop.avatarUrl}
                          ></UserAvatar>
                          <div className="user-name">{shop.shopName}</div>
                        </a>
                        <div className="user-actions">
                          <a href="#start-chat" onClick={(ev) => ev.preventDefault()}>
                            Add to shop
                          </a>
                        </div>
                      </div>
                    </li>
                  )
                })
              )}
            </ul>
          </div>
        </SimpleBar>
      )}
      <div className="nk-chat-list">
        <h6 className="title overline-title-alt message-title">
          <div>Messages</div>
          {conversationFetching && <Spinner size="sm" color="primary" />}
        </h6>
        <ul className="chat-list">
          {conversations.length !== 0 && renderConversations}
          {!conversationFetching && conversations.length === 0 && (<p className="m-3">No conversation</p>)}
          {conversationFetching && conversations.length > 10 && (<div className="text-center py-3"><Spinner size="sm" color="primary" /></div>)}
        </ul>
      </div>
    </SimpleBar>
  );
};

export const ChannelAsideBody = ({
  filteredChatList,
  onInputChange,
  setSelectedId,
  setMobileView,
  selectedId,
  filterTab,
  chatItemClick,
}) => {
  const defaultChat = filteredChatList.filter((item) => item.group === true);
  return (
    <SimpleBar className="nk-chat-aside-body">
      <div className="nk-chat-aside-search">
        <div className="form-group">
          <div className="form-control-wrap">
            <div className="form-icon form-icon-left">
              <Icon name="search"></Icon>
            </div>
            <Input
              type="text"
              className="form-round"
              id="default-03"
              placeholder="Search by name"
              onChange={(e) => onInputChange(e)}
            />
          </div>
        </div>
      </div>
      <div className="nk-chat-aside-panel nk-chat-channel">
        <h6 className="title overline-title-alt">All Channels</h6>
        <ul className="channel-list">
          {chatData.map((item, idx) => {
            return (
              item.channel && (
                <li
                  key={idx}
                  onClick={() => {
                    setSelectedId(item.id);
                    if (window.innerWidth < 860) setMobileView(true);
                  }}
                >
                  <a
                    href="#name"
                    onClick={(ev) => ev.preventDefault()}
                    className={selectedId === item.id ? "active" : ""}
                  >
                    # {item.name}
                  </a>
                </li>
              )
            );
          })}
        </ul>
      </div>
      <div className="nk-chat-list">
        <h6 className="title overline-title-alt">Teams / Groups</h6>
        <ul className="chat-list">
          {defaultChat.length !== 0 ? (
            filteredChatList.map((item, idx) => {
              if (filterTab === "messages") {
                return (
                  item.convo.length > 0 &&
                  item.group &&
                  !item.archive &&
                  !item.channel && (
                    <ChatItem
                      key={idx}
                      item={item}
                      selectedId={selectedId}
                      setSelectedId={setSelectedId}
                      chatItemClick={chatItemClick}
                    ></ChatItem>
                  )
                );
              } else if (filterTab === "archive") {
                return (
                  item.convo.length > 0 &&
                  !item.channel &&
                  item.archive &&
                  item.group && (
                    <ChatItem
                      key={idx}
                      item={item}
                      selectedId={selectedId}
                      setSelectedId={setSelectedId}
                      chatItemClick={chatItemClick}
                    ></ChatItem>
                  )
                );
              } else if (filterTab === "unread") {
                return (
                  item.convo.length > 0 &&
                  !item.channel &&
                  item.unread &&
                  item.group && (
                    <ChatItem
                      key={idx}
                      item={item}
                      selectedId={selectedId}
                      setSelectedId={setSelectedId}
                      chatItemClick={chatItemClick}
                    ></ChatItem>
                  )
                );
              } else {
                return (
                  item.convo.length > 0 &&
                  !item.channel &&
                  item.group && (
                    <ChatItem
                      key={idx}
                      item={item}
                      selectedId={selectedId}
                      setSelectedId={setSelectedId}
                      chatItemClick={chatItemClick}
                    ></ChatItem>
                  )
                );
              }
            })
          ) : (
            <p className="m-3">No group found</p>
          )}
        </ul>
      </div>
    </SimpleBar>
  );
};

export const ContactAsideBody = (onInputChange, filterData, filterText, contactData, setSelectedId) => {
  return (
    <SimpleBar className="nk-chat-aside-body">
      <div className="nk-chat-aside-search">
        <div className="form-group">
          <div className="form-control-wrap">
            <div className="form-icon form-icon-left">
              <Icon name="search"></Icon>
            </div>
            <input
              type="text"
              className="form-round form-control"
              id="default-03"
              placeholder="Search by name"
              onChange={(e) => onInputChange(e)}
            />
          </div>
        </div>
      </div>
      <div className="nk-chat-aside-panel nk-chat-contact">
        {filterData.length === 0 ? (
          filterText ? (
            <div className="ms-5">No user</div>
          ) : (
            contactData.map((item, idx) => {
              return <ContactItem key={idx} item={item}></ContactItem>;
            })
          )
        ) : (
          <ul className="contacts-list">
            {filterData.map((contact, idx) => {
              return (
                <React.Fragment>
                  <li key={idx} setSelectedId={setSelectedId(contact.id)}>
                    <div className="user-card">
                      <a href="#name" onClick={(ev) => ev.preventDefault()}>
                        <UserAvatar
                          text={findUpper(contact.name)}
                          theme={contact.theme}
                          image={contact.image}
                        ></UserAvatar>
                        <div className="user-name">{contact.name}</div>
                      </a>
                      <div className="user-actions">
                        <a href="#start-chat" onClick={(ev) => ev.preventDefault()}>
                          Start Chat
                        </a>
                      </div>
                    </div>
                  </li>
                </React.Fragment>
              );
            })}
          </ul>
        )}
      </div>
    </SimpleBar>
  );
};
