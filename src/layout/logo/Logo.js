import React from "react";
import LogoLight2x from "../../images/logo2x.png";
// import LogoDark2x from "../../images/logo-dark2x.png";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to={`${process.env.PUBLIC_URL}/`} className="logo-link">
      <img
        className="logo-light logo-img-lg"
        src={LogoLight2x}
        alt="logo"
        style={{ maxHeight: "30px", width: "auto" }}
      />
      <img
        className="logo-dark logo-img-lg"
        src={LogoLight2x}
        alt="logo"
        style={{ maxHeight: "30px", width: "auto" }}
      />
    </Link>
  );
};

export default Logo;
