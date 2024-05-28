import React, { useEffect, useState } from "react";
import Image from "./Image";
import Select from "react-select";

function CustomDropDown({
  name,
  register,
  labelTitle,
  placeholder,
  icon,
  setValue,
  showError,
  errorMessage,
  options,
  showMandatory = false,
  defaultOption,
  parentProps,
  resetValue,
  isMulti = false,
  setResetValue,
  setSearchQuery,
  ...props
}) {
  const [selectedOption, setSelectedOption] = useState(defaultOption);
  useEffect(() => {
    if (name === "subCorrectOption") {
      setSelectedOption(defaultOption);
    }
  }, [defaultOption]);
 
  useEffect(() => {
    if (resetValue) {
      setResetValue(false);
      setSelectedOption(null);
    }
  }, [resetValue]);

  return (
    <div className="form-group mb-3 d-flex flex-column" {...parentProps}>
      <h3 className="login_heading">
        {labelTitle}
        {showMandatory ? <span className="danger">*</span> : null}
      </h3>
      <div className="position-relative">
        <Image src={icon} className="input_icons"></Image>
        {
          <Select
            defaultValue={selectedOption}
            maxMenuHeight={200}
            isMulti={isMulti}
            onChange={(e) => {
             
              setSearchQuery
                ? (setSearchQuery(e.label), setSelectedOption(e))
                : (setValue(
                    name,
                    isMulti ? e.map((option) => option.value) : e.value,
                    { shouldValidate: true }
                  ),
                  setSelectedOption(e));
            }}
            value={selectedOption}
            // {...(register ? register(name) : {})}
            {...props}
            placeholder={placeholder}
            noOptionsMessage={() => "No Data Available!"}
            styles={{
              container: (baseStyles, state) => ({
                ...baseStyles,
                borderColor: "#e2e2e2",
              }),
              valueContainer: (baseStyles, state) => ({
                ...baseStyles,
                padding: "6px 16px",
                fontSize: "14px",
                fontWeight: "400",
              }),
              menu: (baseStyles, state) => ({
                ...baseStyles,
                zIndex: 999,
              }),
            }}
            theme={(theme) => ({
              ...theme,
              borderRadius: 8,
              colors: {
                ...theme.colors,
                primary25: "#e2e2e2",
                primary: "#14489F",
                neutral90: "#FFFFFF",
              },
            })}
            options={options}
          />
        }
      </div>

      {showError ? (
        <span className="danger fs-14 fw-400 mt-1">{errorMessage}</span>
      ) : null}
    </div>
  );
}

export default CustomDropDown;
