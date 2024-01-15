import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, requiredRole }) => {
  const userDataString = localStorage.getItem("authenticatedUser");
  if (!userDataString) {
    return <Navigate to="/login" replace />;
  }

  const userData = JSON.parse(userDataString);
  const userRoles = Array.isArray(userData.roles) ? userData.roles : [];
  console.log(userRoles);

  if (requiredRole && !userRoles.includes(requiredRole)) {
    return <Navigate to="/error" replace />;
  }

  return children;
};

export default PrivateRoute;
