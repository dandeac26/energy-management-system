import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import NavigationBar from "./navigation-bar";
import Home from "./home/home";
import UserContainer from "./user/user-container";
import DeviceContainer from "./device/device-container";
import ErrorPage from "./commons/errorhandling/error-page";
import styles from "./commons/styles/project-style.css";
import Login from "./login/login.js";
import PrivateRoute from "./user/private-route.js";
import Profile from "./profile/profile.js";
/*
    Namings: https://reactjs.org/docs/jsx-in-depth.html#html-tags-vs.-react-components
    Should I use hooks?: https://reactjs.org/docs/hooks-faq.html#should-i-use-hooks-classes-or-a-mix-of-both
*/
function App() {
  return (
    <div className={styles.back}>
      <Router>
        <div>
          <NavigationBar />
          <Switch>
            <Route exact path="/" render={() => <Home />} />

            <PrivateRoute path="/user" render={() => <UserContainer />} />

            <PrivateRoute path="/device" render={() => <DeviceContainer />} />
            <PrivateRoute path="/profile" component={Profile} />
            <Route exact path="/login" component={Login} />

            {/*Error*/}
            <Route exact path="/error" render={() => <ErrorPage />} />

            <Route render={() => <ErrorPage />} />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
