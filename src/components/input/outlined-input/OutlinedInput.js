import React, { useState } from "react";
import { Icon } from "../../Component";

const OutlinedInput = ({ label, size, id, icon, onChange, value, error }) => {
  const [focus, setFocus] = useState(false);
  return (
    <div className={`form-control-wrap ${focus ? "focused" : ""}`}>
      {icon && (
        <div className={`form-icon form-icon-right ${size}`}>
          <Icon name={icon}></Icon>
        </div>
      )}
      <input
        type="text"
        className={`form-control-outlined form-control ${size ? `form-control-${size}` : ""}`}
        id={id}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={onChange}
        value={value}
        error={error}
      />
      <label className="form-label-outlined" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

export default OutlinedInput;
