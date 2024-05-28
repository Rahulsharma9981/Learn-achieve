import React from "react";
import Sidebar from "../Components/sideNav/sideBar"; // Import Sidebar component
import Navbar from "../Components/navbar/navbar"; // Import Navbar component

const MainLayout = ({ children }) => {
  return (
    <>
      <div className="d-flex">
        <Sidebar /> {/* Include Sidebar component */}
        <div className="mainLayout-content">
          <Navbar /> {/* Include Navbar component */}
          <div className="main_content contentSection scroll_bar">
            {children} {/* Render children components */}
          </div>{" "}
        </div>
      </div>
    </>
  );
};

export default MainLayout;
