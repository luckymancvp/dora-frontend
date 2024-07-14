import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LogoLight2x from "../../images/logo2x.png";
import Head from "../../layout/head/Head";
import { Block, BlockHead, BlockContent, BlockTitle, PreviewCard } from "../../components/Component";
import { Link } from "react-router-dom";
import GoogleSvg from "../../images/google.svg";
import { saveTokenData } from "../../redux/slices/Authentications";

const LoginGoogle = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector(state => state.auth);
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get('token');

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/messages', { replace: true });
    } else if (token) {
      dispatch(saveTokenData(token));
      navigate('/messages', { replace: true });
    }
  }, [isLoggedIn, token, dispatch, navigate]);

  return <>
    <Head title="Login" />
    <Block className="nk-block-middle nk-auth-body wide-xs d-flex flex-column">
      <div className="brand-logo pb-4 text-center">
        <Link to={process.env.PUBLIC_URL + "/"} className="logo-link">
          <img className="logo-light logo-img logo-img-xl" src={LogoLight2x} alt="logo" />
          <img className="logo-dark logo-img logo-img-xl" src={LogoLight2x} alt="logo-dark" />
        </Link>
      </div>

      <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
        <BlockHead>
          <BlockContent>
            <BlockTitle tag="h4">Sign-In</BlockTitle>
          </BlockContent>
        </BlockHead>
        <Link className="btn btn-outline-secondary btn-lg btn-block" to={process.env.REACT_APP_AUTH_GOOGLE}>
          <img style={{ width: "20px", height: "20px" }} className="me-3" src={GoogleSvg} alt="Google" />
          <span className="">Sign in with Google</span>
        </Link>
      </PreviewCard>
    </Block>
  </>;
};
export default LoginGoogle;
