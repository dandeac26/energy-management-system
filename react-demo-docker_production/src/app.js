// import React from "react";
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// import NavigationBar from "./navigation-bar";
// import Home from "./home/home";
// import UserContainer from "./user/user-container";
// import WebSocketComponent from "./user/components/WebSocketComponent.js";
// import DeviceContainer from "./device/device-container";
// import ErrorPage from "./commons/errorhandling/error-page";
// import styles from "./commons/styles/project-style.css";
// import Login from "./login/login.js";
// import PrivateRoute from "./user/private-route.js";
// import Profile from "./profile/profile.js";
// import DeviceChart from "./device/device-chart.js"; // Import the DeviceChart component

// /*
//     Namings: https://reactjs.org/docs/jsx-in-depth.html#html-tags-vs.-react-components
//     Should I use hooks?: https://reactjs.org/docs/hooks-faq.html#should-i-use-hooks-classes-or-a-mix-of-both
// */
// function App() {
//   return (
//     <div className={styles.back}>
//       <Router>
//         <div>
//           <WebSocketComponent />
//           <NavigationBar />
//           <Switch>
//             <Route exact path="/" render={() => <Home />} />

//             <Route exact path="/user" render={() => <UserContainer />} />

//             <Route exact path="/device" render={() => <DeviceContainer />} />
//             <Route path="/device-chart/:deviceId" element={<DeviceChart />} />
//             <PrivateRoute path="/profile" component={Profile} />
//             <Route exact path="/login" component={Login} />

//             {/*Error*/}
//             <Route exact path="/error" render={() => <ErrorPage />} />

//             <Route render={() => <ErrorPage />} />
//           </Switch>
//         </div>
//       </Router>
//     </div>
//   );
// }

// export default App;
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavigationBar from "./navigation-bar";
import Home from "./home/home";
import UserContainer from "./user/user-container";
import WebSocketComponent from "./user/components/WebSocketComponent.js";
import DeviceContainer from "./device/device-container";
import ErrorPage from "./commons/errorhandling/error-page";
import styles from "./commons/styles/project-style.css";
import Login from "./login/login.js";
import PrivateRoute from "./user/private-route.js";
import Profile from "./profile/profile.js";
import DeviceChart from "./device/device-chart.js"; // Import the DeviceChart component
import LoginWrapper from "./login/login-wrapper.js";

function App() {
  return (
    <div className={styles.back}>
      <Router>
        <div>
          <WebSocketComponent />
          <NavigationBar />
          <Routes>
            <Route exact path="/" element={<Home />} />
            {/* <Route exact path="/user" element={<UserContainer />} /> */}
            <Route
              path="/user"
              element={
                <PrivateRoute requiredRole="ADMIN">
                  <UserContainer />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path="/device"
              element={
                <PrivateRoute>
                  <DeviceContainer />
                </PrivateRoute>
              }
            />
            <Route path="/device-chart/:deviceId" element={<DeviceChart />} />
            {/* <Route exact path="/login" element={<Login />} /> */}
            <Route exact path="/login" element={<LoginWrapper />} />
            <Route exact path="/error" element={<ErrorPage />} />

            {/* PrivateRoute needs to be adjusted for v6 */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

            {/* Fallback Route for 404 */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
