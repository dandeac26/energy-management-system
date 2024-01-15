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
            <Route exact path="/login" element={<LoginWrapper />} />
            <Route exact path="/error" element={<ErrorPage />} />

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
