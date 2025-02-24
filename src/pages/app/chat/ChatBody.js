import { Realtime } from "ably";
import classNames from "classnames";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Spinner } from "reactstrap";
import SimpleBar from "simplebar-react";
import { Button, Icon, UserAvatar } from "../../../components/Component";
import { TextareaForm } from "../../../components/forms/TextareaForm";
import { createMessage, fetchMessages, fetchStatusMessage } from "../../../redux/slices/Messages";
import { findUpper } from "../../../utils/Utils";
import ChatFiles from "./ChatFiles";
import ChatSideBar from "./ChatSideBar";
import { MeChat, RecommnendChats, SendingChat, YouChat } from "./ChatPartials";

const ChatBody = ({ mobileView, conversationId, conversation, solutions, handleFetchSolutions }) => {
  const dispatch = useDispatch();
  const { messages, sendingMessages, isSendingMessage, isFetchingSolution, scrollBottom } = useSelector(
    (state) => state.messages
  );
  const [sidebar, setsidebar] = useState(false);
  const [chatOptions, setChatOptions] = useState(false);
  const [files, setFiles] = useState([]);
  const [ably] = useState(() => new Realtime({ key: process.env.REACT_APP_ABLY_API_KEY }));
  const [channel] = useState(ably.channels.get("all"));
  const [recommnendState, setRecommnendState] = useState(() => {
    return window.innerWidth < 860 ? true : false;
  });

  const toggleRecommendState = (isOpen) => {
    setRecommnendState(isOpen);
    localStorage.setItem("recommnend_state", isOpen);
  };

  // Conversation selected
  const userData = conversation?.userData || conversation.etsy?.userData;
  const otherUser = conversation.etsy?.otherUser || conversation.etsy?.detail?.otherUser;
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const uploadImgRef = useRef(null);

  const methods = useForm({
    defaultValues: { message: "", attachments: [] },
  });

  const { handleSubmit, setValue, watch, clearErrors, reset } = methods;

  const attachments = watch("attachments");
  const messageValue = watch("message");

  useEffect(() => {
    setTimeout(() => {
      resizeTextarea();
    }, 100);
  }, [messageValue, isFetchingSolution]);

  useEffect(() => {
    setValue("message", solutions.message);
  }, [solutions.message, setValue]);

  useEffect(() => {
    clearFileInput();
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  const clearFileInput = useCallback(() => {
    if (uploadImgRef.current) {
      uploadImgRef.current.value = null;
    }
    reset();
    setFiles([]);
  }, [uploadImgRef, reset]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const scrollHeight = messagesEndRef.current.scrollHeight;
      const height = messagesEndRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      messagesEndRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  };

  useEffect(() => {
    setChatOptions(false);
  }, [conversationId]);

  useEffect(() => {
    if (scrollBottom) {
      setTimeout(() => {
        scrollToBottom();
        focusTextarea();
      }, 300);
    }
  }, [conversationId, scrollBottom, messages, sendingMessages]);

  const resizeFunc = () => {
    if (window.innerWidth > 1550) {
      setsidebar(true);
    } else {
      setsidebar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", resizeFunc);
    resizeFunc();
    return () => {
      window.removeEventListener("resize", resizeFunc);
    };
  }, []);

  const toggleMenu = () => {
    setsidebar(!sidebar);
  };

  const handleSendMessage = useCallback(
    (formValues, conversationId) => {
      const formData = new FormData();
      formData.append("message", formValues.message);
      if (formValues.attachments && formValues.attachments.length > 0) {
        formValues.attachments.forEach((file) => {
          formData.append("attachments", file);
        });
      }

      // Reset input & files
      clearFileInput();
      scrollToBottom();

      dispatch(createMessage({ conversationId, formData })).then((response) => {
        const data = response.payload?.message;
        channel.publish("new-message-event", { message: response.payload?.message });
        dispatch(fetchMessages({ conversationId }));
        if (data?.conversationId) {
          scrollToBottom();
          setTimeout(() => {
            scrollToBottom();
          }, 500);

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
            console.log("Error: Message status remained NEW after 5 seconds.");
          };

          // Call status check every second for 5 seconds
          const intervalId = setInterval(checkStatus, 1000);
          setTimeout(() => {
            clearInterval(intervalId);
            updateStatusToError(); // Update status to Error
          }, 5000);
        }
      });
    },
    [clearFileInput, dispatch, channel]
  );

  const saveMessage = useCallback(
    (formValues) => {
      if (formValues.message.trim() || attachments.length > 0) {
        handleSendMessage(formValues, conversation.etsy?.conversationId);
      }
    },
    [conversation, handleSendMessage, attachments]
  );

  const chatBodyClass = classNames({
    "nk-chat-body": true,
    "show-chat": mobileView,
    "profile-shown": sidebar && window.innerWidth > 1550,
  });

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      reset();
      resizeTextarea();
      resetTextareaSize();
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(saveMessage)();
      reset();
      resizeTextarea();
      resetTextareaSize();
    } else if (e.key === "Enter" && e.shiftKey) {
      resizeTextarea();
    }
  };

  const resizeTextarea = () => {
    const el = textareaRef.current;

    if (!el) return;

    const padding =
      parseFloat(window.getComputedStyle(el).paddingTop) + parseFloat(window.getComputedStyle(el).paddingBottom);

    el.style.height = "36px";

    const newHeight = el.scrollHeight - padding * 2;

    el.style.height = (newHeight + 16) + "px";
  };

  const resetTextareaSize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

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

  const onFileChangeForm = useCallback(
    (selectedFiles) => {
      focusTextarea();
      setChatOptions(false);
      clearErrors("attachments");
      setValue("attachments", selectedFiles);
    },
    [clearErrors, setValue]
  );

  const handleOnclickAI = useCallback(() => {
    if (messageValue) {
      handleFetchSolutions(conversationId, { input: messageValue });
    } else {
      handleFetchSolutions(conversationId);
    }
    toggleRecommendState();
  }, [messageValue, handleFetchSolutions, conversationId]);

  const onPasteImage = (pasteEvent) => {
    const items = pasteEvent.clipboardData?.items;

    if (items) {
      Array.from(items).forEach((item) => {
        if (item.type.includes("image")) {
          const blob = item.getAsFile();
          onFileChangeForm([blob]);
        }
      });
    }
  };

  const renderMessages = useMemo(
    () =>
      messages.map((item, idx) => {
        if (item?.etsy?.senderId === userData?.userId) {
          return <MeChat key={`message-${item.id}-${idx}`} item={item} sender={userData}></MeChat>;
        } else if (item?.etsy?.senderId === otherUser?.userId) {
          return <YouChat key={`message-${item.id}-${idx}`} item={item} sender={otherUser}></YouChat>;
        } else {
          return <SendingChat key={`message-${item.id}-${idx}`} item={item} sender={userData} />;
        }
      }),
    [messages, userData, otherUser]
  );

  const renderSendingMessages = useMemo(
    () =>
      sendingMessages.map((item, idx) => {
        if (String(item.conversationId) === String(conversationId)) {
          return <SendingChat key={`sending-message-${item.id}-${idx}`} item={item} sender={userData} />;
        }
        return <></>;
      }),
    [sendingMessages, userData, conversationId]
  );

  const renderSolutions = useMemo(
    () =>
      solutions?.solutions?.length > 0 && (
        <div className="nk-chat-options">
          <a
            href="#options"
            className="p-0 btn btn-round btn-icon btn-light"
            onClick={(ev) => {
              ev.preventDefault();
              toggleRecommendState(!recommnendState);
            }}
            style={{ width: "30px", height: "30px" }}
          >
            <span className="indicator-icon">
              <Icon name={`chevron-${recommnendState ? "up" : "down"}`}></Icon>
            </span>
          </a>
          <ul className={`collapse ${recommnendState ? "" : "show"}`}>
            <RecommnendChats
              solutionMessages={solutions.solutions}
              handleClick={(message) => handleFetchSolutions(conversationId, { input: message })}
            />
          </ul>
        </div>
      ),
    [conversationId, handleFetchSolutions, recommnendState, solutions.solutions]
  );
  return (
    <React.Fragment>
      <div className={chatBodyClass} key={`conversation-${conversationId}`}>
        <div className="nk-chat-head">
          <ul className="nk-chat-head-info">
            <li className="nk-chat-body-close">
              <Link to="/messages" className="btn btn-icon btn-trigger nk-chat-hide ms-n1">
                <Icon name="arrow-left"></Icon>
              </Link>
            </li>
            <li className="nk-chat-head-user">
              <div className="user-card">
                <div className="chat-media user-avatar user-avatar-multiple">
                  <UserAvatar
                    theme="grey"
                    text={findUpper(userData.shopName)}
                    image={userData.avatarUrl}
                    className="chat-media"
                  />
                  <UserAvatar
                    theme="grey"
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
            {/* <li className="d-none d-sm-block">
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
            </li> */}
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
        <div className="nk-chat-box">
          <SimpleBar className="nk-chat-panel" scrollableNodeProps={{ ref: messagesEndRef }}>
            {renderMessages}
            {renderSendingMessages}
            {isSendingMessage && (
              <div className="text-end py-3 px-2">
                <Spinner size="sm" color="primary" />
              </div>
            )}
            {/* {messageFetching && (<div className="text-center py-3"><Spinner size="sm" color="primary" /></div>)} */}
          </SimpleBar>
          {isFetchingSolution ? (
            <div className="nk-chat-options">
              <Spinner size="sm" color="primary" />
            </div>
          ) : (
            renderSolutions
          )}
        </div>
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
                onClick={() => setChatOptions(!chatOptions)}
              >
                <Icon name="plus-circle-fill"></Icon>
              </Button>
              <div className={`chat-upload-option ${chatOptions ? "expanded" : ""}`}>
                <ul className="">
                  <li>
                    <a href="#img" onClick={handleClickImage}>
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
              <li>
                <Button color="primary" onClick={handleOnclickAI} className="btn-round btn-icon">
                  <Icon name="target"></Icon>
                </Button>
              </li>
            </ul>
          </div>
        </FormProvider>

        <ChatSideBar sidebar={sidebar} conversation={conversation} otherUser={otherUser} />

        {window.innerWidth < 1550 && sidebar && (
          <div onClick={() => toggleMenu()} className="nk-chat-profile-overlay"></div>
        )}
      </div>
    </React.Fragment>
  );
};

export default ChatBody;
