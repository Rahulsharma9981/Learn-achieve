import React, { useState } from "react";
import { InputType } from "../../Utils/Utils";
import { SvgImages } from "../../Utils/LocalImages";
import Image from "./Image";

function CustomTextField({
  name,
  register,
  labelTitle,
  placeholder,
  inputType,
  additionalClasses,
  icon,
  showError,
  errorMessage,
  showMandatory = false,
  ...props
}) {

  const [useType, setUseType] = useState(inputType);

  return (
    <div className="form-group mb-3 d-flex flex-column">
      <label htmlFor="exampleInputEmail1 " className="login_heading">
        {labelTitle}{showMandatory ? <span className="danger">*</span> : null}
      </label>
      <div className="position-relative">
        <Image src={icon} className="input_icons"></Image>
        <input
          type={useType}
          className={`form-control ${additionalClasses} ${inputType == InputType.password ? "pe-5" : ""}`}
          placeholder={placeholder}
          {...props}
          {...(register ? register(name) : {})} // Register only if provided
        />
        {inputType == InputType.password ? (
          <Image className="eye_icon2 cursor-pointer" src={useType != InputType.password ? SvgImages.password_show : SvgImages.password_hide} onClick={() => {
            setUseType(useType == InputType.password ? InputType.text : InputType.password)
          }} />
        ) : null}
      </div>

      {showError ? <span className="danger fs-14 fw-400 mt-1">{errorMessage}</span> : null}
    </div>
  );
}

export default CustomTextField;
