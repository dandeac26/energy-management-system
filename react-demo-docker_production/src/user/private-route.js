// import React from "react";
// import { Route, Redirect } from "react-router-dom";

// const PrivateRoute = ({ component: Component, ...rest }) => (
//   <Route
//     {...rest}
//     render={(props) =>
//       localStorage.getItem("authenticatedUser") ? (
//         <Component {...props} />
//       ) : (
//         <Redirect to="/login" />
//       )
//     }
//   />
// );

// export default PrivateRoute;
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = localStorage.getItem("authenticatedUser");

  return (
    <Routes>
      <Route
        {...rest}
        element={
          isAuthenticated ? <Component /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
};

export default PrivateRoute;
