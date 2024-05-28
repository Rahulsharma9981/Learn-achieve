import React, { useState } from "react";

function CustomFileInput({
  name,
  register,
  labelTitle,
  labelTitleText,
  additionalClasses,
  showError,
  errorMessage,
  showMandatory = false,
  onChange,
  defaultValue,
  ...props
}) {
  const [filename, setFilename] = useState(defaultValue ? defaultValue : "");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFilename(file ? file.name : "");
    onChange(e);
  };
  const openFileDialog = () => {
    document.getElementById(name).click();
  };
  return (
    <div className="form-group mb-3 d-flex flex-column">
      <label htmlFor={name} className="login_heading">
        {labelTitle}
        {showMandatory && <span className="danger">*</span>}
        {labelTitleText && (
          <span className="danger filelebeltext">{labelTitleText}</span>
        )}
      </label>
      <div className="select_file">
        <span>{filename || "No File Chosen"}</span>
        <input
          type="file"
          className="visually-hidden"
          name={name}
          id={name}
          {...(register ? register(name) : {})}
          onChange={handleFileChange}
          {...props}
        />
        <button
          className="btn btn-secondary"
          type="button"
          onClick={openFileDialog}
        >
          {filename ? "Change File" : "Choose File"}
        </button>
      </div>
      {showError && (
        <span className="danger fs-14 fw-400 mt-1">{errorMessage}</span>
      )}
    </div>
  );
}

export default CustomFileInput;
