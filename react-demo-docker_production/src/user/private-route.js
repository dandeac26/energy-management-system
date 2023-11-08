import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const authenticatedUser = localStorage.getItem("authenticatedUser");
      const isAdmin = authenticatedUser && authenticatedUser.role === "admin";

      if (authenticatedUser && (isAdmin || rest.path === "/profile")) {
        return <Component {...props} />;
      } else {
        return <Redirect to="/login" />;
      }
    }}
  />
);

export default PrivateRoute;
