import React from "react";

export function TitleLabel({ text, ...props }) {
  return <h3 className="black fs-26 fw-600" {...props}>{text}</h3>;
}

export function HeadingLabel({ text, ...props }) {
  return <h1 className="black fs-18 fw-600" {...props}>{text}</h1>;
}

export function SubTitleLabel({ text, ...props }) {
  return <h4 className="fs-16 fw-500 black mb-0" {...props}>{text}</h4>
}

