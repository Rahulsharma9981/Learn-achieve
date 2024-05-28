import React, { useContext, useEffect, useState } from 'react';
import { SvgImages } from "../../Utils/LocalImages"
import Image from '../Reusable/Image';
import { ConfirmationModalTheme, ImageFilters } from '../../Utils/Enums';
import SessionManager from '../../Utils/Session';
import ConfirmationModal from '../modal/ConfirmationModal';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Context/authContext';
import RoutesPath from '../../Utils/RoutesPath';
import ApiConstants from '../../Utils/ApiConstant';

const Navbar = () => {
  const [showProfileDropDown, setShowProfileDropDown] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Add event listener to listen for clicks on the document
    document.addEventListener('click', handleClickOutside);

    // Cleanup function to remove event listener when component unmounts
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Function to handle click outside of the modal
  const handleClickOutside = (event) => {
    const dropdownMenu = document.getElementById('dropdownMenuLink');
    if (dropdownMenu && !dropdownMenu.contains(event.target)) {
      setShowProfileDropDown(false);
    }
  };

  return (
    <nav className="topnavbar d-flex align-items-center justify-content-between">
      <h4 className="black mb-0 fs-20 fw-600">{`Welcome, ${user?.name?.trim()}!`}</h4>
      <div className="right-admin-profile d-flex align-items-center">
        <div className="d-flex align-items-center gap_34">
          <a href="notification.html" className=""><img src={SvgImages.notification} alt="Notification" /></a>
          <div className="dropdown position-relative">
            <a className="fs-16 fw-500 black dropdown-toggle d-flex align-items-center" onClick={() => setShowProfileDropDown(true)} role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="true">
              <Image className="profile_img" style={{ objectFit: "cover" }} src={user?.profile_pic && user.profile_pic?.trim() !== "" ? ApiConstants.BASE_URL + user.profile_pic : SvgImages.user_profile} onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = SvgImages.user_profile;
              }} />
            </a>
            <ul className={`dropdown-menu profiles_dropdown selectSection ${showProfileDropDown ? "show" : ""}`} aria-labelledby="dropdownMenuLink" data-popper-placement="bottom-end">
              <Link to={RoutesPath.viewProfile}>
                <div className="mb-2">
                  <li className="profile_dropdown fs-16 fw-500 black border_bottom">
                    <Image className="profile_img" style={{ objectFit: "cover" }} src={user?.profile_pic && user.profile_pic?.trim() !== "" ? ApiConstants.BASE_URL + user.profile_pic : SvgImages.user_profile} onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = SvgImages.user_profile;
                    }} />
                    <div className="profile_details">
                      <h2>{user?.name?.trim()}</h2>
                      <h3>Admin</h3>
                    </div>
                  </li>
                </div>
              </Link>
              <button className="view_profile border-bottom" data-number="8">
                <Link to={RoutesPath.viewProfile}>
                  <li className="profile_card">
                    <Image src={SvgImages.profile} alt="Profile" />
                    View Profile
                  </li>
                </Link>

                <Link to={RoutesPath.changePasswordProfile}>
                  <li className="profile_card">
                    <Image src={SvgImages.lock} style={ImageFilters.black} alt="Profile" />
                    Change Password
                  </li>
                </Link>
              </button>
              <li className="profile_card primary mt-2 mb-0" data-bs-target="#logoutmodal" data-bs-toggle="modal" onClick={() => setShowConfirmationModal(true)}>
                <img src={SvgImages.profile_logout} alt="Logout" />Logout
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Change Class Status Modal */}
      <ConfirmationModal
        showModal={showConfirmationModal}
        setShowModal={setShowConfirmationModal}
        text={"Are you sure want to logout?"}
        icon={SvgImages.power} // Specify the path to your delete icon
        rightClickAction={() => { SessionManager.shared.logout() }}
        theme={ConfirmationModalTheme.theme}
      />
    </nav>
  );
};

export default Navbar;
