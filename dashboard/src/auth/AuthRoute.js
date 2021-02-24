import React from "react";
import useAuth from "./useAuth";
import { Route, Redirect, useLocation } from "react-router-dom";

export const DashboardRoute = ({ component: Component, admin, ...rest }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (admin && user.role.role !== "admin") {
    return null;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        renderComponentOrLogin(Component, props, user, location)
      }
    />
  );
};

const renderComponentOrLogin = (Component, props, user, location = null) => {
  if (user === null) {
    if (location) {
      return (
        <Redirect
          to={`/auth/login?n=${encodeURIComponent(
            location.pathname.concat(location.search)
          )}`}
        />
      );
    }
    return <Redirect to="/auth/login" />;
  }

  return <Component {...props} currentUser={user} />;
};
