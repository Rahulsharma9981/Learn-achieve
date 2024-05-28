import React, { useEffect, useState } from "react";
import PersonalDetails from "./PersonalDetails";
import ChangePassword from "./ChangePassword";
import { Link } from "react-router-dom";
import RoutesPath from "../../Utils/RoutesPath";
import { useLocation } from 'react-router-dom';

const ProfilePage = () => {
  const [showPersonalDetails, setShowPersonalDetails] = useState(true);

  const location = useLocation();

  useEffect(() => {
    setShowPersonalDetails(location.pathname != RoutesPath.changePasswordProfile);
  }, [location.pathname]);

  return (
    <div
      className="main_content contentSection scroll_bar"
      style={{ padding: 0 }}
    >
      {/* Profile section */}
      <div className="content">
        <div className="mb-3 d-flex justify-content-between">
          <h1 className="black fs-18 fw-600 mb-0">PROFILE</h1>
          <div className="d-flex">
            <h4 className="fs-12 fw-500 black mb-0 me-1">Dashboard &gt;</h4>
            <h4 className="fs-12 fw-500 primary mb-0">Profile</h4>
          </div>
        </div>

        <div className="table_container" style={{ display: "block" }} >
          <div className="table_title p-0 mb-3">
            <div className="table_headings">
              <h1 className="black fs-18 fw-600 mb-0">Profile Details</h1>
            </div>
          </div>

          <div className="nav-pills d-flex align-items-center m-0">
            <Link to={RoutesPath.viewProfile}>
              <h1 className={`black fs-16 fw-600 mb-0 tabs_btn ${showPersonalDetails ? "active" : ""}`}>Personal Details</h1>
            </Link>

            <Link to={RoutesPath.changePasswordProfile}>
              <h1 className={`black fs-16 fw-600 mb-0 tabs_btn ${!showPersonalDetails ? "active" : ""}`}>Change Password</h1>
            </Link>
          </div>

          <div className="tab-content" id="pills-tabContent">
            {showPersonalDetails ? (<PersonalDetails show={showPersonalDetails} />) : (<ChangePassword show={showPersonalDetails} />)}
          </div>
        </div>
      </div>
    </div>
  )
};

export default ProfilePage;
