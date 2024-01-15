// import React from "react";
// import { Route, Routes, Navigate } from "react-router-dom";

// const PrivateRoute = ({ component: Component, ...rest }) => {
//   const isAuthenticated = localStorage.getItem("authenticatedUser");

//   return (
//     <Routes>
//       <Route
//         {...rest}
//         element={
//           isAuthenticated ? <Component /> : <Navigate to="/login" replace />
//         }
//       />
//     </Routes>
//   );
// };

// export default PrivateRoute;
// import React from "react";
// import { Navigate } from "react-router-dom";

// const PrivateRoute = ({ children, requiredRole }) => {
//   const userData = JSON.parse(localStorage.getItem("authenticatedUser"));
//   const userRole = userData.roles;
//   console.log(userRole); // this returns ['ADMIN'] in console

//   if (!userData) {
//     return <Navigate to="/login" replace />;
//   }

//   if (requiredRole && userRole !== requiredRole) {
//     return <Navigate to="/error" replace />;
//   }

//   return children;
// };

// export default PrivateRoute;

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
