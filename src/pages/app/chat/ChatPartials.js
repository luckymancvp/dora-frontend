import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { Icon, UserAvatar } from "../../../components/Component";
import { formatDateString, formatTimestamp } from "../../../utils/DateTimeFormat";
import { findUpper } from "../../../utils/Utils";
import { ChatContext } from "./ChatContext";
import ImageContainer from "./GalleryImage";

export const MeChat = ({ item, sender }) => {
  const createDate = formatTimestamp(item.etsy.createDate, true);
  return (
    <div className="chat is-me">
      <div className="chat-content">
        <div className="chat-bubbles">
          <div className="chat-bubble">
            {item.etsy.message && (
              <div className="chat-msg bg-blue" dangerouslySetInnerHTML={{ __html: item.etsy.message }}></div>
            )}
            {item.etsy?.images.length > 0 && (
              <div className="chat-img">
                {item.etsy?.images?.map((image, idx) => (
                  <ImageContainer img={image.imageData?.sources[0]?.url} key={`me-chat-img-${idx}`} role={"isMe"} />
                ))}
              </div>
            )}
          </div>
        </div>
        <ul className="chat-meta">
          <li>{createDate}</li>
        </ul>
      </div>
      <div className="chat-avatar">
        <UserAvatar image={sender.avatarUrl} theme="grey" text={findUpper(sender.displayName)} />
      </div>
    </div>
  );
};

export const YouChat = ({ item, sender }) => {
  const createDate = formatTimestamp(item.etsy.createDate, true);
  return (
    <div className="chat is-you">
      <div className="chat-avatar">
        <UserAvatar image={sender.avatarUrl} theme="grey" text={findUpper(sender.displayName)} />
      </div>
      <div className="chat-content">
        <div className="chat-bubbles">
          <div className="chat-bubble">
            {item.etsy.message && (
              <div className="chat-msg" dangerouslySetInnerHTML={{ __html: item.etsy.message }}></div>
            )}
            {item.etsy?.images.length > 0 && (
              <div className="chat-img">
                {item.etsy?.images?.map((image, idx) => (
                  <ImageContainer img={image.imageData?.sources[0]?.url} key={`you-chat-img-${idx}`} role={"isYou"} />
                ))}
              </div>
            )}
          </div>
        </div>
        <ul className="chat-meta">
          <li>{createDate}</li>
        </ul>
      </div>
    </div>
  );
};

export const SendingChat = ({ item, sender }) => {
  let status = "";
  const firstTime = item.firstTime;
  let timeDifference = 0;

  if (firstTime) {
    const existingTimestamp = new Date(item.firstTime);
    const currentTimestamp = new Date().toISOString();
    const now = new Date(currentTimestamp);
    timeDifference = now - existingTimestamp;
  }

  switch (item.status) {
    case "NEW":
      status = "Sending";
      break;
    case "SENDING":
      status = "Sending";
      break;
    case "DONE":
      status = formatDateString(item?.createdAt ?? item?.created_at); // TODO
      break;
    case "FAILED":
      status = "Error";
      break;
    default:
      break;
  }

  if (timeDifference > 5000 && item.status !== "DONE") {
    status = "Error";
  }

  return (
    <div className="chat is-me">
      <div className="chat-content">
        <div className="chat-bubbles">
          <div className="chat-bubble">
            {item.message && (
              <div className="chat-msg bg-blue" dangerouslySetInnerHTML={{ __html: item.message }}></div>
            )}
            {item.attachments?.length > 0 && (
              <div className="chat-img">
                {item.attachments.map((image, idx) => (
                  <ImageContainer img={image} key={`chat-img-${idx}`} role={"isMe"} />
                ))}
              </div>
            )}
          </div>
        </div>
        <ul className="chat-meta">
          <li>{status}</li>
        </ul>
      </div>
      <div className="chat-avatar">
        <UserAvatar image={sender.avatarUrl} theme="grey" text={findUpper(sender.displayName)} />
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
                name={`${
                  item.delivered === true ? "check-circle-fill" : item.delivered === "sent" ? "check-circle" : ""
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

export const ChatRoomItem = ({ item, chatItemConversationClick }) => {
  const totalOrders =
    item.etsy?.buyerInfo?.pastOrderHistory?.totalOrders || item.etsy?.buyerInfo?.past_order_history?.total_orders || 0;
  const otherUser = item.etsy.otherUser || item.etsy?.detail?.otherUser || item.etsy?.detail?.other_user;
  const userData = item.userData || item.etsy.userData || item.etsy.user_data;
  const messages = item.etsy?.detail?.messages;
  const sanitizeHTML = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };
  let message = "";
  let createDate = null;

  if (typeof messages === "object" && messages !== null) {
    message = messages.message ? sanitizeHTML(messages.message) : "Send attachment";
    createDate = formatTimestamp(messages.createDate ?? messages.create_date);
  } else if (messages && messages.length > 0) {
    const lastMessage = messages[messages.length - 1];
    message = lastMessage?.message ? sanitizeHTML(lastMessage.message) : "Send attachment";
    createDate = formatTimestamp(lastMessage.createDate ?? lastMessage.create_date);
  } else {
    message = item.etsy?.excerpt;
    createDate = item.etsy?.timestamp;
  }

  return (
    // {`chat-item ${item.etsy.isUnread ? "is-unread" : ""}`}
    <li
      className={`chat-item ${item.etsy.isUnread ? "is-unread" : ""}`}
      key={item.id}
      onClick={(ev) => {
        ev.preventDefault();
        chatItemConversationClick(item.id);
      }}
    >
      <Link to={`/messages/${item.etsy.conversationId ?? item.etsy.conversation_id}`} className="chat-link">
        <div className="chat-media user-avatar user-avatar-multiple">
          <UserAvatar
            theme="grey"
            text={findUpper(userData?.shopName ?? userData?.shop_name)}
            image={userData?.avatarUrl ?? userData?.avatar_url}
            className="chat-media"
          />
          <UserAvatar
            theme="grey"
            text={findUpper(otherUser?.displayName ?? otherUser?.display_name)}
            image={otherUser?.avatarUrl ?? otherUser?.avatar_url}
            size="md"
            className="chat-media"
          />
        </div>
        <div className="chat-info">
          <div className={`chat-from ${item.etsy.isUnread ? "is-unread" : ""}`}>
            <div className="name">{`${otherUser?.displayName ?? otherUser?.display_name} - ${
              userData?.shopName ?? userData?.shop_name
            }`}</div>
            <span className="time">{createDate}</span>
          </div>
          <div className="chat-context">
            <div className="text">
              <p dangerouslySetInnerHTML={{ __html: message }}></p>
            </div>
            <div className="status delivered">
              <Icon name={`${item.etsy?.hasReplied ?? item.etsy?.has_replied === true ? "check-circle-fill" : ""}`} />
              <Icon
                name={`${
                  item.etsy?.isOrderHelpRequest ?? item.etsy?.is_order_help_request === true
                    ? "help-request ni-alert-circle"
                    : ""
                }`}
                style={{ color: "#f20" }}
              ></Icon>
              <Icon name={`${totalOrders > 0 ? "cart-fill" : ""}`} />
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};

export const RecommnendChats = ({ solutionMessages, handleClick }) => {
  return solutionMessages?.map((msg, index) => (
    <li key={`solution-${index}`} className="py-1">
      <div className="custom-control custom-radio custom-control-pro no-control checked box-shadow-solution">
        <label className="custom-control-label" onClick={() => handleClick(msg)}>
          {msg}
        </label>
      </div>
    </li>
  ));
};
