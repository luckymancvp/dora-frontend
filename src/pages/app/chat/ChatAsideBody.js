import React, { useState , useMemo } from "react";
import { Icon, UserAvatar } from "../../../components/Component";
import SimpleBar from "simplebar-react";
import { Input, Button } from "reactstrap";
import { ChatItem, ChatRoomItem, ContactItem } from "./ChatPartials";
import { findUpper } from "../../../utils/Utils";
import { chatData } from "./ChatData";
import { ChatContext } from "./ChatContext";

export const ChatAsideBody = ({
  onInputChange,
  shopState,
  shopFilter,
  setShopState,
  setSelectedId,
  selectedId,
  shopInputSearchChange,
  shopFilterText,
  filterTab,
  chatItemClick,
  filteredChatList,
  shops,
  conversations,
  chatRoomItemClick,
}) => {
  const [shopData, setShopData] = useState([]);
  const defaultChat = filteredChatList.filter((item) => item.group !== true);

  const filterConversations = useMemo(() => conversations.filter(item => {
    const totalOrders = item.etsy?.buyerInfo?.pastOrderHistory?.totalOrders || 0;

    if (filterTab === "messages"
      || (filterTab === "help_requests" && item.etsy.isOrderHelpRequest)
      || (filterTab === "not_replied" && !item.etsy.hasReplied)
      || (filterTab === "has_order" && totalOrders > 0)
    ) {
      return true;
    }

    return false;
  }), [conversations, filterTab]);

  const mappingName = {
    messages: "Messages",
    help_requests: "Help requests",
    not_replied: "Not replied",
    has_order: "Has order",
  }

  const addShop = (newShop) => {
    const isDuplicate = shopData.some(shop => shop.userId === newShop.userId);
    if (!isDuplicate) {
      setShopData([...shopData, newShop]);
    }
  };

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
      <div className="nk-chat-aside-panel nk-chat-fav">
        <h6 className="title overline-title-alt">Favorites</h6>
        <ul className="fav-list">
          <li>
            <Button
              color="light"
              outline
              size="lg"
              className="btn-icon btn-white btn-round"
              onClick={() => setShopState(!shopState)}
            >
              <Icon name={shopState ? "cross" : "plus"}></Icon>
            </Button>
          </li>
          {shopData.map((shop, idx) => {
            return (
              <li key={idx} onClick={() => setSelectedId(shop.userId)}>
                <a href="#" onClick={(ev) => ev.preventDefault()}>
                  <UserAvatar image={shop.avatarUrl} theme="blue" text={findUpper(shop.shopName)}/>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
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
            <ul className="contacts-list">
              {shopFilter.length === 0 ? (
                shopFilterText ? (
                  <div className="ms-3">No shop found</div>
                ) : (
                  shops.slice(0, 3).map((shop, idx) => {
                    return (
                      <li key={idx} onClick={() => addShop(shop)}>
                        <div className="user-card">
                          <a href="#card" onClick={(ev) => ev.preventDefault()}>
                            <UserAvatar
                              text={findUpper(shop.shopName)}
                              theme="blue"
                              image={shop.avatarUrl}
                            ></UserAvatar>
                            <div className="user-name">{shop.shopName}</div>
                          </a>
                          <div className="user-actions">
                            <a href="#add-fav" onClick={(ev) => ev.preventDefault()}>
                              Add to favourite
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
                    <li key={idx} onClick={() => addShop(shop)}>
                      <div className="user-card">
                        <a href="#card" onClick={(ev) => ev.preventDefault()}>
                          <UserAvatar
                            text={findUpper(shop.shopName)}
                            theme="blue"
                            image={shop.avatarUrl}
                          ></UserAvatar>
                          <div className="user-name">{shop.shopName}</div>
                        </a>
                        <div className="user-actions">
                          <a href="#start-chat" onClick={(ev) => ev.preventDefault()}>
                            Start Chat
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
        <h6 className="title overline-title-alt">{mappingName[filterTab]}</h6>
        <ul className="chat-list">
          {filterConversations.length !== 0 ? (
            filterConversations.map((item, idx) => {
              return (
                <ChatRoomItem
                  key={idx}
                  item={item}
                  selectedId={selectedId}
                  setSelectedId={setSelectedId}
                  chatRoomItemClick={chatRoomItemClick}
                ></ChatRoomItem>
              );
            })
          ) : (
            <p className="m-3">No conversation</p>
          )}
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
