import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { ACCESS, REFRESH, USER_INFO } from "../../utils/globals";

const Logout = () => {
  useEffect(() => {
    localStorage.removeItem(ACCESS);
    localStorage.removeItem(REFRESH);
    localStorage.removeItem(USER_INFO);
  });

  return <Redirect to="/auth/login" />;
};

export default Logout;
