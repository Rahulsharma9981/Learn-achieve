import React, { createContext, useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import SessionManager from "../Utils/Session";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(typeof SessionManager.shared.getSessionToken !== "undefined" && SessionManager.shared.getSessionToken && SessionManager.shared.getSessionToken !== "");

  // Effect to synchronize AuthContext with SessionManager on mount
  useEffect(() => {
    const sessionToken = SessionManager.shared.getSessionToken();
    const userData = SessionManager.shared.retrieveUserData();

    if (typeof sessionToken !== "undefined" && sessionToken && sessionToken != "") {
      setIsAuthenticated(true);
      SessionManager.shared.getData();
    } else {
      setIsAuthenticated(false);
    }

    if (sessionToken && userData) {
      setUser(userData);
    } else {
      setUser({
        name: "Admin"
      })
    }
  }, []); // Only run on component mount

  // Listen for changes in SessionManager and update AuthContext accordingly
  useEffect(() => {
    const handleTokenChange = () => {
      const sessionToken = SessionManager.shared.getSessionToken();

      if (typeof sessionToken !== "undefined" && sessionToken && sessionToken != "") {
        setIsAuthenticated(true);
        SessionManager.shared.getData();
      } else {
        setIsAuthenticated(false);
      }
    };

    const handleDataChange = () => {
      const sessionToken = SessionManager.shared.getSessionToken();
      const userData = SessionManager.shared.retrieveUserData();

      if (sessionToken && userData) {
        setUser(userData);
      } else {
        setUser({
          name: "Admin"
        })
      }
    };

    // Subscribe to SessionManager changes
    SessionManager.shared.subscribeData(handleDataChange);
    SessionManager.shared.subscribeToken(handleTokenChange);

    // Clean up subscription on unmount
    return () => {
      SessionManager.shared.unsubscribeData(handleDataChange);
      SessionManager.shared.unsubscribeToken(handleTokenChange);
    };
  }, []); // Only run on component mount and unmount

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser
      }}>
      {children}
    </AuthContext.Provider>
  );
};
