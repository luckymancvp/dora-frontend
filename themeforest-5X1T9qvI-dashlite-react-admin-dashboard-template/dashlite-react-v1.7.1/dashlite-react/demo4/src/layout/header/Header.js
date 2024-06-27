import React, { useState } from "react";
import classNames from "classnames";
import Logo from "../logo/Logo";
import User from "./dropdown/user/User";
import Notification from "./dropdown/notification/Notification";
import Toggle from "../sidebar/Toggle";
import { Link } from "react-router-dom";

import { useTheme, useThemeUpdate } from '../provider/Theme';

const Header = ({ fixed, className, ...props }) => {
  const theme = useTheme();
  const themeUpdate = useThemeUpdate();
  const [onHover, setOnHover] = useState(false);
  const headerClass = classNames({
    "nk-header": true,
    "nk-header-fixed": fixed,
    [`is-light`]: theme.header === "white",
    [`is-${theme.header}`]: theme.header !== "white" && theme.header !== "light",
    [`${className}`]: className,
  });

  let currentUrl;

  if (window.location.pathname !== undefined) {
    currentUrl = window.location.pathname;
  } else {
    currentUrl = null;
  }

  const onMouseEnter = () => {
    setOnHover(true);
  };
  const onMouseLeave = () => {
    setOnHover(false);
  };

  return (
    <div className={headerClass}>
      <div className="container-lg wide-xl">
        <div className="nk-header-wrap">
          <div className="nk-header-brand">
            <Logo />
          </div>
          <div className="nk-header-menu">
            <ul className="nk-menu nk-menu-main">
              <li
                className={`nk-menu-item ${currentUrl === process.env.PUBLIC_URL + "/" ? "active current-page" : ""}`}
              >
                <Link to={`${process.env.PUBLIC_URL}/`} className="nk-menu-link">
                  <span className="nk-menu-text">Overview</span>
                </Link>
              </li>
              <li
                className={`nk-menu-item has-sub ${
                  currentUrl.includes(process.env.PUBLIC_URL + "/app-") ? "active" : ""
                }`}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
              >
                <a href="#toggle" onClick={(ev) => ev.preventDefault()} className="nk-menu-link nk-menu-toggle">
                  <span className="nk-menu-text">Apps</span>
                </a>
                {onHover && (
                  <ul className="nk-menu-sub">
                    <li className="nk-menu-item">
                      <Link
                        to={`${process.env.PUBLIC_URL}/app-messages`}
                        onClick={() => setOnHover(false)}
                        className="nk-menu-link"
                      >
                        <span className="nk-menu-text">Messages</span>
                      </Link>
                    </li>
                    <li className="nk-menu-item">
                      <Link
                        to={`${process.env.PUBLIC_URL}/app-chat`}
                        onClick={() => setOnHover(false)}
                        className="nk-menu-link"
                      >
                        <span className="nk-menu-text">Chats / Messenger</span>
                      </Link>
                    </li>
                    <li className="nk-menu-item">
                      <Link
                        to={`${process.env.PUBLIC_URL}/app-inbox`}
                        onClick={() => setOnHover(false)}
                        className="nk-menu-link"
                      >
                        <span className="nk-menu-text">
                          Mailbox
                        </span>
                      </Link>
                    </li>
                    <li className="nk-menu-item">
                      <Link
                        to={`${process.env.PUBLIC_URL}/app-calender`}
                        onClick={() => setOnHover(false)}
                        className="nk-menu-link"
                      >
                        <span className="nk-menu-text">Calendar</span>
                      </Link>
                    </li>
                    <li className="nk-menu-item">
                      <Link
                        to={`${process.env.PUBLIC_URL}/app-kanban`}
                        onClick={() => setOnHover(false)}
                        className="nk-menu-link"
                      >
                        <span className="nk-menu-text">
                          Kanban
                        </span>
                      </Link>
                    </li>
                    <li className="nk-menu-item">
                      <Link
                        to={`${process.env.PUBLIC_URL}/app-file-manager`}
                        onClick={() => setOnHover(false)}
                        className="nk-menu-link"
                      >
                        <span className="nk-menu-text">
                        File Manager <span className="nk-menu-badge">new</span>
                        </span>
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li
                className={`nk-menu-item ${
                  currentUrl === process.env.PUBLIC_URL + "/components" ? "active current-page" : ""
                }`}
              >
                <Link to={`${process.env.PUBLIC_URL}/components`} className="nk-menu-link">
                  <span className="nk-menu-text">Components</span>
                </Link>
              </li>
            </ul>
          </div>
          <div className="nk-header-tools">
            <ul className="nk-quick-nav">
              <li className="notification-dropdown">
                <Notification />
              </li>
              <li className="user-dropdown">
                <User />
              </li>
              <li className="d-lg-none">
                <Toggle icon="menu" className="toggle nk-quick-nav-icon me-n1" click={themeUpdate.sidebarVisibility} />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
