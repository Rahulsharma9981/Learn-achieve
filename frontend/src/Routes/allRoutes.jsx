import React, { useContext, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Login from "../Pages/Auth/login";
import ForgotPassword from "../Pages/Auth/forgotPassword";
import OTPVerify from "../Pages/Auth/otpVerify";
import ResetPassword from "../Pages/Auth/resetPassword";
import { AuthContext } from "../Context/authContext";
import Dashboard from "../Pages/Dashboard/Dashboard";
import RoutesPath from "../Utils/RoutesPath";

const AllRoutes = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div>
      {
        isAuthenticated ? (
          <Dashboard />
        ) : (
          <Routes>
            <Route path={RoutesPath.login} element={<Login />} />
            <Route path={RoutesPath.forgotPassword} element={<ForgotPassword />} />
            <Route path={RoutesPath.otpVerify} element={<OTPVerify />} />
            <Route path={RoutesPath.resetPassword} element={<ResetPassword />} />
            <Route path="*" element={<Navigate to={RoutesPath.login} />} />
          </Routes>
        )}
    </div>
  );
};

export default AllRoutes;
