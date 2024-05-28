import React from "react";
// 
const AuthLayout = ({ children }) => {
  return (
    <div>
      <div className="login container">
        <div className="row h-100">
          {/* LEFT LOGIN IMAGE */}
          <div className="col-md-6 m-auto position-relative p-0">
            <div className="loginbackground">
              <div className="login_details">
                <h2 className="fs-20 fw-600 text-white text-center">
                  Unlock your potential with Learn and Achieve.
                </h2>
                <h3 className="fs-18 fw-300 text-white text-center px-5">
                  Dive deep into every subject, every chapter and unit to make your way easier to success.
                </h3>
              </div>
            </div>
          </div>
          {/* RIGHT SIDE */}
          <div className="col-md-6 m-auto p-0">
            {/* Auth BOX */}
            <div className="login_img" id="btn1">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
