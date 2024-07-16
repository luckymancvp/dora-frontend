import React, { useEffect, useCallback, useState, useContext, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import classNames from "classnames";
import ChatSideBar from "./ChatSideBar";
import ChatFiles from "./ChatFiles";
import SimpleBar from "simplebar-react";
import { createMessage, fetchStatusMessage } from "../../../redux/slices/Messages";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown, Spinner } from "reactstrap";
import { UserAvatar, Icon, Button } from "../../../components/Component";
import { TextareaForm } from "../../../components/forms/TextareaForm";
import { currentTime, findUpper, truncate } from "../../../utils/Utils";
import { ChatContext } from "./ChatContext";

import { MeChat, YouChat, SendingChat } from "./ChatPartials";

const ChatBody = ({
  id, mobileView, setSelectedId, conversationId, sendingMessages,
  conversation, messages, messageFetching, scrollBottom
}) => {
  const dispatch = useDispatch();
  const { deleteConvo, propAction, chatState } = useContext(ChatContext);
  const [chat, setChat] = chatState;
  const [Uchat, setUchat] = useState({});
  const [sidebar, setsidebar] = useState(false);
  const [chatOptions, setChatOptions] = useState(false);
  const [files, setFiles] = useState([]);

  // Conversation selected
  const userData = conversation?.userData || conversation.etsy?.userData;
  const otherUser = conversation.etsy?.otherUser || conversation.etsy?.detail?.otherUser;
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const uploadImgRef = useRef(null);

  const methods = useForm({
    defaultValues: { message: "", attachments: [] },
  });

  const {
    handleSubmit, setValue, watch, clearErrors, reset, formState: { isSubmitting },
  } = methods;

  const attachments = watch("attachments");

  useEffect(() => {
    reset();
    clearFileInput();
  }, [conversationId, reset]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const scrollHeight = messagesEndRef.current.scrollHeight;
      const height = messagesEndRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      messagesEndRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  };

  useEffect(() => {
    if (scrollBottom) {
      setTimeout(() => {
        scrollToBottom();
        focusTextarea();
        setChatOptions(false);
      }, 300);
    }
  }, [Uchat, conversationId, scrollBottom, messages, sendingMessages]);

  const resizeFunc = () => {
    if (window.innerWidth > 1550) {
      setsidebar(true);
    } else {
      setsidebar(false);
    }
  };

  useEffect(() => {
    chat.forEach((item) => {
      if (item.id === id) {
        setUchat(item);
      }
    });
  }, [id, chat]);

  useEffect(() => {
    window.addEventListener("resize", resizeFunc);
    resizeFunc();
    return () => {
      window.removeEventListener("resize", resizeFunc);
    };
  }, []);

  const onChatOptions = () => {
    setChatOptions(!chatOptions);
  };

  const toggleMenu = () => {
    setsidebar(!sidebar);
  };

  const handleSendMessage = useCallback((formValues, conversationId) => {
    const formData = new FormData();
    formData.append("message", formValues.message);
    if (formValues.attachments && formValues.attachments.length > 0) {
      formValues.attachments.forEach(file => {
        formData.append("attachments", file);
      });
    }

    dispatch(createMessage({ conversationId, formData })).then(response => {
      const data = response.payload?.message;
      if (data?.conversationId) {
        scrollToBottom(); // TODO
        const checkStatus = () => {
          dispatch(fetchStatusMessage({ id: data.id })).then(({ payload }) => {
            if (payload.status === "NEW") {
              console.log("Status is still NEW");
            } else {
              clearInterval(intervalId);
              if (payload.status !== "NEW") {
                console.log("Message status updated:", payload.status);
              }
            }
          });
        };

        const updateStatusToError = () => {
          // dispatch(updateMessageStatus({ id: data.id, status: "Error" })); // TODO:
          console.error("Error: Message status remained NEW after 5 seconds.");
        };

        // Call status check every second for 5 seconds
        const intervalId = setInterval(checkStatus, 1000);
        setTimeout(() => {
          clearInterval(intervalId);
          updateStatusToError(); // Update status to Error
        }, 5000);
      }
    });
  }, [dispatch]);

  const clearFileInput = useCallback(() => {
    if(uploadImgRef.current) {
      uploadImgRef.current.value = null;
    }
  }, [uploadImgRef])

  const saveMessage = useCallback((formValues) => {
    if (formValues.message.trim() || attachments.length > 0) {
      handleSendMessage(formValues, conversation.etsy?.conversationId);
      reset();
      clearFileInput()
      setFiles([]);
    }
  }, [conversation, handleSendMessage, reset, attachments, clearFileInput]);

  // const onRemoveMessage = (idx, id) => {
  //   let allChat = chat;
  //   let cindex = allChat.find((item) => item.id === id);
  //   let defaultChat = Uchat;
  //   let newConvo = defaultChat.convo;
  //   let index = newConvo.findIndex((item) => item.id === id);
  //   newConvo[index].chat[idx] = "deleted";
  //   allChat[cindex] = defaultChat;
  //   setChat([...allChat]);
  // };

  const chatBodyClass = classNames({
    "nk-chat-body": true,
    "show-chat": mobileView,
    "profile-shown": sidebar && window.innerWidth > 1550,
  });

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      reset();
      resizeTextarea();
      resetTextareaSize();
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(saveMessage)();
      reset();
      resizeTextarea();
      resetTextareaSize();
    } else if (e.key === 'Enter' && e.shiftKey) {
      resizeTextarea();
    }
  };

  const handleTextareaChange = (e) => {
    resizeTextarea();
  };

  const resizeTextarea = () => {
    const el = textareaRef.current;

    if (!el) return;

    const padding = parseFloat(window.getComputedStyle(el).paddingTop) + parseFloat(window.getComputedStyle(el).paddingBottom);

    el.style.height = "auto";
    el.style.height = el.scrollHeight - padding * 2 + 'px';
  }

  const resetTextareaSize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  const focusTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleClickImage = (ev) => {
    ev.preventDefault();
    if (uploadImgRef.current) {
      uploadImgRef.current.click();
    }
  };

  const onFileChangeForm = useCallback(selectedFiles => {
    focusTextarea();
    setChatOptions(false);
    clearErrors('attachments');
    setValue('attachments', selectedFiles);
  }, [clearErrors, setValue]);


  const onPasteImage = (pasteEvent) => {
    const items = pasteEvent.clipboardData?.items;

    if (items) {
      Array.from(items).forEach(item => {
        if (item.type.includes('image')) {
          const blob = item.getAsFile();
          onFileChangeForm([blob]);
        }
      });
    }
  };

  return (
    <React.Fragment>
      <div className={chatBodyClass} key={conversationId}>
        <div className="nk-chat-head">
          <ul className="nk-chat-head-info">
            <li className="nk-chat-body-close">
              <Link
                to="/messages"
                className="btn btn-icon btn-trigger nk-chat-hide ms-n1"
              >
                <Icon name="arrow-left"></Icon>
              </Link>
            </li>
            <li className="nk-chat-head-user">
              <div className="user-card">
                <div className="chat-media user-avatar user-avatar-multiple">
                  <UserAvatar
                    theme="blue"
                    text={findUpper(userData.shopName)}
                    image={userData.avatarUrl}
                    className="chat-media"
                  />
                  <UserAvatar
                    theme="purple"
                    text={findUpper(otherUser.displayName)}
                    image={otherUser.avatarUrl}
                    size="md"
                    className="chat-media"
                  />
                </div>
                <div className="user-info">
                  <div className="lead-text">{`${otherUser.displayName} - ${userData.shopName}`}</div>
                </div>
              </div>
            </li>
          </ul>
          <ul className="nk-chat-head-tools">
            {/* <li>
              <a
                href="#call"
                onClick={(ev) => {
                  ev.preventDefault();
                }}
                className="btn btn-icon btn-trigger text-primary"
              >
                <Icon name="call-fill"></Icon>
              </a>
            </li>
            <li>
              <a
                href="#video"
                onClick={(ev) => {
                  ev.preventDefault();
                }}
                className="btn btn-icon btn-trigger text-primary"
              >
                <Icon name="video-fill"></Icon>
              </a>
            </li> */}
            <li className="d-none d-sm-block">
              <UncontrolledDropdown>
                <DropdownToggle tag="a" className="dropdown-toggle btn btn-icon btn-trigger text-primary">
                  <Icon name="setting-fill"></Icon>
                </DropdownToggle>
                <DropdownMenu end className="dropdown-menu">
                  <ul className="link-list-opt no-bdr">
                    <li>
                      <DropdownItem
                        tag="a"
                        className="dropdown-item"
                        disabled={Uchat.archive}
                        href="#dropdown"
                        onClick={(ev) => {
                          ev.preventDefault();
                          propAction(id, "archive");
                        }}
                      >
                        <Icon name="archive"></Icon>
                        <span>Make as Archive</span>
                      </DropdownItem>
                    </li>
                    <li>
                      <DropdownItem
                        tag="a"
                        className="dropdown-item"
                        href="#dropdown"
                        onClick={(ev) => {
                          ev.preventDefault();
                          deleteConvo(id);
                          setSelectedId(null);
                        }}
                      >
                        <Icon name="cross-c"></Icon>
                        <span>Remove Conversion</span>
                      </DropdownItem>
                    </li>
                  </ul>
                </DropdownMenu>
              </UncontrolledDropdown>
            </li>
            <li className="me-n1 me-md-n2">
              <a
                href="#alert"
                onClick={(e) => {
                  e.preventDefault();
                  toggleMenu();
                }}
                className="btn btn-icon btn-trigger text-primary chat-profile-toggle"
              >
                <Icon name="alert-circle-fill"></Icon>
              </a>
            </li>
          </ul>
        </div>
        <SimpleBar className="nk-chat-panel" scrollableNodeProps={{ ref: messagesEndRef }}>
          {messages.map((item, idx) => {
            if (item?.etsy?.senderId === userData?.userId) {
              return <MeChat key={`message-${item.id}`} item={item} sender={userData} ></MeChat>;
            } else if (item?.etsy?.senderId === otherUser?.userId) {
              return <YouChat key={`message-${item.id}`} item={item} sender={otherUser}></YouChat>;
            } else {
              return <SendingChat key={`message-${item.id}`} item={item} sender={userData} />
            }
          })}

          {sendingMessages.map((item, idx) => {
            if (String(item.conversationId) === String(conversationId)) {
              if (item?.etsy?.senderId === userData?.userId) {
                return <MeChat key={`message-${item.id}`} item={item} sender={userData} ></MeChat>;
              } else if (item?.etsy?.senderId === otherUser?.userId) {
                return <YouChat key={`message-${item.id}`} item={item} sender={otherUser}></YouChat>;
              } else {
                return <SendingChat key={`message-${item.id}`} item={item} sender={userData} />
              }
            } else {
              return false;
            }
          })}
          {/* {messageFetching && (<div className="text-center py-3"><Spinner size="sm" color="primary" /></div>)} */}
        </SimpleBar>
        <FormProvider {...methods}>
          <ChatFiles
            name="attachments"
            files={files}
            setFiles={setFiles}
            attachments={attachments}
            uploadImgRef={uploadImgRef}
            onFileChangeForm={onFileChangeForm}
          />
          <div className="nk-chat-editor">
            <div className="nk-chat-editor-upload ms-n1">
              <Button
                size="sm"
                className={`btn-icon btn-trigger text-primary toggle-opt ${chatOptions ? "active" : ""}`}
                onClick={() => onChatOptions()}
              >
                <Icon name="plus-circle-fill"></Icon>
              </Button>
              <div className={`chat-upload-option ${chatOptions ? "expanded" : ""}`}>
                <ul className="">
                  <li>
                    <a
                      href="#img"
                      onClick={handleClickImage}
                    >
                      <Icon name="img-fill"></Icon>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="nk-chat-editor-form">
              <div className="form-control-wrap">
                <TextareaForm
                  name="message"
                  rows="1"
                  id="default-textarea"
                  ref={textareaRef}
                  className="form-control form-control-simple no-resize"
                  placeholder="Type your message..."
                  onPaste={onPasteImage}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
            <ul className="nk-chat-editor-tools g-2">
              {/* <li>
                <Button size="sm" className="btn-icon btn-trigger text-primary">
                  <Icon name="happyf-fill"></Icon>
                </Button>
              </li> */}
              <li>
                <Button color="primary" onClick={handleSubmit(saveMessage)} className="btn-round btn-icon">
                  <Icon name="send-alt"></Icon>
                </Button>
              </li>
            </ul>
          </div>
        </FormProvider>

        <ChatSideBar sidebar={sidebar} chat={Uchat} conversation={conversation} otherUser={otherUser} />

        {window.innerWidth < 1550 && sidebar && (
          <div onClick={() => toggleMenu()} className="nk-chat-profile-overlay"></div>
        )}
      </div>
    </React.Fragment>
  );
};

export default ChatBody;
