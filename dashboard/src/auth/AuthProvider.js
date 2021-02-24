import React, { useState, useEffect, useRef } from "react";
import api from "../utils/api";
import { logout } from "../utils/auth";
import { USER_INFO, ROLE_INFO } from "../utils/globals";
import AuthContext from "./AuthContext";

const AuthProvider = ({ children, ...props }) => {
  const isCancelled = useRef(false);
  const [refresh, setRefresh] = React.useState(0);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);

  const getRole = async () => {
    const { data = null } = await api("auth/get-role/");

    if (isCancelled.current) {
      return;
    }

    if (data) {
      localStorage.setItem(ROLE_INFO, JSON.stringify(data));

      return data;
    }
  };

  const loginUser = async () => {
    const { data = null } = await api("auth/get-current-user/");

    if (isCancelled.current) {
      return;
    }
    if (data) {
      const role = await getRole();
      data.role = role;
      setUser(data);
    }

    setLoading(false);
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem(USER_INFO);
    logout();
  };

  const forceRefresh = () => {
    setRefresh(refresh + 1);
  };

  useEffect(() => {
    loginUser();

    return () => {
      isCancelled.current = true;
    };
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        api,
        loginUser,
        logoutUser,
        forceRefresh,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
