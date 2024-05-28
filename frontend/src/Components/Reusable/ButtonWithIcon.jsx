import React from "react";
import Image from "./Image";

function ButtonWithIcon({ text, icon, ...props }) {
    return <button className="select-btn m-0" {...props}>
        <h2 className="primary_btn mb-0 singleLine">{text}</h2>
        <Image src={icon} className="add_btn" alt="Add Button" />
    </button>;
}

export default ButtonWithIcon;