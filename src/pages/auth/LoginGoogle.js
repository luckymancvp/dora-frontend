import React, { useState } from "react";
import Logo from "../../images/logo.png";
import LogoDark from "../../images/logo-dark.png";
import Head from "../../layout/head/Head";
import { Block, PreviewCard, } from "../../components/Component";
import { Link } from "react-router-dom";
import GoogleSvg from "../../images/google.svg";

const LoginGoogle = () => {
  return <>
    <Head title="Login" />
      <Block className="nk-block-middle nk-auth-body wide-xs d-flex flex-column">
        <div className="brand-logo pb-4 text-center">
          <Link to={process.env.PUBLIC_URL + "/"} className="logo-link">
            <img className="logo-light logo-img logo-img-lg" src={Logo} alt="logo" />
            <img className="logo-dark logo-img logo-img-lg" src={LogoDark} alt="logo-dark" />
          </Link>
        </div>
        <Link class="gsi-material-button mx-auto" to={process.env.REACT_APP_AUTH_GOOGLE}>
          <div class="gsi-material-button-content-wrapper">
            <div class="gsi-material-button-icon">
              <img src={GoogleSvg} alt="Google" />
            </div>
            <span class="gsi-material-button-contents">Sign in with Google</span>
          </div>
        </Link>
      </Block>
  </>;
};
export default LoginGoogle;
