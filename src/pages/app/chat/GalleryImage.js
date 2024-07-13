import React, { useState } from "react";
import { Modal } from "reactstrap";

const ImageContainer = ({ img = "", width = 150, height = "auto", className = "item-image", role = "default" }) => {
  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen(!open);
  };

  const checkRoleRenderClass = (role) => {
    switch (role) {
      case 'isMe':
        return "is-me bg-blue"
      case 'isYou':
        return "is-you bg-white"
      case 'default':
        return ""
      default:
        return ""
    }
  }
  return (
    <a
      className={`gallery-image popup-image ${checkRoleRenderClass(role)}`}
      onClick={(ev) => {
        ev.preventDefault();
        toggle();
      }}
      href="#gallery"
      style={{ minWidth: width, height: height, width: width }}
    >
      <img className={className} src={img} alt="" width={width} height={height} />
      <Modal isOpen={open} toggle={toggle} size="large" zIndex={3000} onClick={toggle}>
        <button type="button" className="mfp-close" onClick={toggle}>×</button>
        <img className="w-100 rounded-top" style={{ height: "100%" }} src={img} alt={img} />
      </Modal>
    </a>
  );
};

export default ImageContainer;
