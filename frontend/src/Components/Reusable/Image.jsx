import React from "react";
import PropTypes from "prop-types";

const Image = ({ src, ...rest }) => {
  // Import the image using require at the top of the file
  return <img src={src} {...rest} />;
};

Image.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
  // Add more optional props here
};

Image.defaultProps = {
  className: "",
  alt: "",
  style: {},
  onClick: () => {},
  // Add default values for other optional props here
};

export default Image;
