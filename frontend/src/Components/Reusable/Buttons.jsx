import React from "react";

function SubmitButton({ title, ...props }) {
  return (
    <button
      type="submit"
      style={{textTransform: "none"}}
      className="btn login_btn fs-15 fw-700 w-100 m-0 singleLine"
      {...props}
    >{title}</button>
  );
}

export default SubmitButton;
