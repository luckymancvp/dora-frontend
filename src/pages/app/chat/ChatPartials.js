import React, { useContext } from "react";
import { DropdownToggle, DropdownMenu, UncontrolledDropdown, DropdownItem } from "reactstrap";
import { Link } from "react-router-dom";
import { Icon, UserAvatar } from "../../../components/Component";
import { findUpper } from "../../../utils/Utils";
import { ChatContext } from "./ChatContext";
import { formatTimestamp } from '../../../utils/DateTimeFormat';
import ImageContainer from "./GalleryImage";

export const MeChat = ({ item, sender }) => {
  return (
    <div className="chat is-me">
      <div className="chat-content">
        <div className="chat-bubbles">
          <div className="chat-bubble">
            {item.etsy.message && (<div className="chat-msg bg-blue" dangerouslySetInnerHTML={{ __html: item.etsy.message }}></div>)}
            {item.etsy?.images.length > 0 && (
              <div className="chat-img">
                {item.etsy?.images?.map((image, idx) => (
                  <ImageContainer img={image.imageData?.sources[0]?.url} key={`chat-img-${idx}`} role={"isMe"}/>
                ))}
              </div>
            )}
          </div>
        </div>
        <ul className="chat-meta">
          <li>{item.etsy.messageDateHmShort}</li>
        </ul>
      </div>
      <div className="chat-avatar">
        <UserAvatar image={sender.avatarUrl} theme="blue" text={findUpper(sender.displayName)} />
      </div>
    </div>
  );
};

export const YouChat = ({ item, sender }) => {
  return (
    <div className="chat is-you">
      <div className="chat-avatar">
        <UserAvatar image={sender.avatarUrl} theme="blue" text={findUpper(sender.displayName)} />
      </div>
      <div className="chat-content">
        <div className="chat-bubbles">
          <div className="chat-bubble">
          {item.etsy.message && (<div className="chat-msg" dangerouslySetInnerHTML={{ __html: item.etsy.message }}></div>)}
            {item.etsy?.images.length > 0 && (
              <div className="chat-img">
                {item.etsy?.images?.map((image, idx) => (
                  <ImageContainer img={image.imageData?.sources[0]?.url} key={`chat-img-${idx}`} role={"isYou"}/>
                ))}
              </div>
            )}
          </div>
        </div>
        <ul className="chat-meta">
          <li title={item.etsy?.messageDateFriendly}>{item.etsy.messageDateHmShort}</li>
        </ul>
      </div>
    </div>
  );
};

export const MetaChat = ({ item }) => {
  return (
    <div className="chat-sap">
      <div className="chat-sap-meta">
        <span>{item}</span>
      </div>
    </div>
  );
};

export const ChatItem = ({ item, chatItemClick, setSelectedId, selectedId }) => {
  const { deleteConvo, propAction } = useContext(ChatContext);

  const checkBeforeDelete = (id) => {
    deleteConvo(id);
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  return (
    <li className={`chat-item ${item.unread ? "is-unread" : ""}`}>
      <a
        className="chat-link"
        href="#chat-link"
        onClick={(ev) => {
          ev.preventDefault();
          chatItemClick(item.id);
        }}
      >
        {item.group === true ? (
          <div className="chat-media user-avatar user-avatar-multiple">
            {item.user.slice(0, 2).map((user, idx) => {
              return (
                <UserAvatar
                  key={idx}
                  theme={user.theme}
                  text={findUpper(user.name)}
                  image={user.image}
                  className="chat-media"
                ></UserAvatar>
              );
            })}
            <span className={"status dot dot-lg dot-success"}></span>
          </div>
        ) : (
          <UserAvatar theme={item.theme} text={findUpper(item.name)} image={item.image} className="chat-media">
            <span className={`status dot dot-lg dot-${item.active === true ? "success" : "gray"}`}></span>
          </UserAvatar>
        )}
        <div className="chat-info">
          <div className="chat-from">
            <div className="name">{item.nickname ? item.nickname : item.name}</div>
            <span className="time">{item.date}</span>
          </div>
          <div className="chat-context">
            <div className="text">
              <p>{item.convo.length !== 0 && item.convo[item.convo.length - 1].chat.at(-1)}</p>
            </div>
            <div className="status delivered">
              <Icon
                name={`${item.delivered === true ? "check-circle-fill" : item.delivered === "sent" ? "check-circle" : ""
                  }`}
              ></Icon>
            </div>
          </div>
        </div>
      </a>
      <div className="chat-actions">
        <UncontrolledDropdown>
          <DropdownToggle tag="a" className="btn btn-icon btn-sm btn-trigger dropdown-toggle">
            <Icon name="more-h"></Icon>
          </DropdownToggle>
          <DropdownMenu end>
            <ul className="link-list-opt no-bdr">
              <li onClick={() => checkBeforeDelete(item.id)}>
                <DropdownItem
                  tag="a"
                  href="#delete"
                  onClick={(ev) => {
                    ev.preventDefault();
                  }}
                >
                  Delete
                </DropdownItem>
              </li>
              <li onClick={() => propAction(item.id, "unread")}>
                <DropdownItem
                  tag="a"
                  href="#unread"
                  className={item.unread ? "disabled" : ""}
                  onClick={(ev) => {
                    ev.preventDefault();
                  }}
                >
                  Mark as Unread
                </DropdownItem>
              </li>
              <li onClick={() => propAction(item.id, "archive")}>
                <DropdownItem
                  tag="a"
                  href="#archive"
                  className={item.archive ? "disabled" : ""}
                  onClick={(ev) => {
                    ev.preventDefault();
                  }}
                >
                  Archive Message
                </DropdownItem>
              </li>
            </ul>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    </li>
  );
};

export const ContactItem = ({ item, setTab, setSelectedId }) => {
  return (
    <ul className="contacts-list">
      <li>
        <h6 className="title overline-title-alt">{item.contacts.length > 0 && item.title}</h6>
      </li>
      {item.contacts.map((contact, idx) => {
        return (
          <li
            key={idx}
            onClick={() => {
              setTab("Chats");
              setSelectedId(contact.id);
            }}
          >
            <div className="user-card">
              <a href="#card" onClick={(ev) => ev.preventDefault()}>
                <UserAvatar text={findUpper(contact.name)} theme={contact.theme} image={contact.image}></UserAvatar>
                <div className="user-name">{contact.name}</div>
              </a>
              <div className="user-actions">
                <Link to={`${process.env.PUBLIC_URL}/messages`}>Start Chat</Link>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export const ChatRoomItem = ({ item, chatRoomItemClick }) => {
  const totalOrders = item.etsy?.buyerInfo?.pastOrderHistory?.totalOrders || 0;
  const otherUser = item.etsy.otherUser || item.etsy?.detail?.otherUser;
  const userData = item.userData || item.etsy.userData;
  const messages = item.etsy?.detail?.messages;
  const sanitizeHTML = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };
  let message = "";
  let createDate = null;

  if (messages && messages.length > 0) {
    const lastMessage = messages[messages.length - 1];
    message = lastMessage?.message ? sanitizeHTML(lastMessage.message) : "Send attachment";
    createDate = formatTimestamp(lastMessage.createDate);
  }

  return (
    <li className={`chat-item ${item.etsy.isUnread ? "is-unread" : ""}`}>
      <a
        className="chat-link"
        href="#chat-link"
        onClick={(ev) => {
          ev.preventDefault();
          chatRoomItemClick(item.etsy.conversationId);
        }}
      >
        <div className="chat-media user-avatar user-avatar-multiple">
          <UserAvatar
            theme="blue"
            text={findUpper(userData?.shopName)}
            image={userData?.avatarUrl}
            className="chat-media"
          />
          <UserAvatar
            theme="purple"
            text={findUpper(otherUser?.displayName)}
            image={otherUser?.avatarUrl}
            size="md"
            className="chat-media"
          />
        </div>
        <div className="chat-info">
          <div className="chat-from">
            <div className="name">{`${otherUser?.displayName} - ${userData?.shopName}`}</div>
            <span className="time">{createDate}</span>
          </div>
          <div className="chat-context">
            <div className="text">
              <p dangerouslySetInnerHTML={{ __html: message }}></p>
            </div>
            <div className="status delivered">
              <Icon name={`${item.etsy?.hasReplied === true ? "check-circle-fill" : "check-circle"}`} />
              <Icon
                name={`${item.etsy?.isOrderHelpRequest === true ? "help-request ni-alert-circle" : ""}`}
                style={{ color: "#f20" }}
              ></Icon>
              <Icon name={`${totalOrders > 0 ? "cart-fill" : ""}`} />
            </div>
          </div>
        </div>
      </a>
    </li>
  );
};
