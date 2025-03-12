import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Navbar from "./NavBar";
import MyToDos from "./App";
import Dashboard from "./Dashboard";
import Login from "./Login";

const Main = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      {isAuthenticated && <Navbar onLogout={handleLogout} />}
      <Switch>
        <Route exact path="/">
          {isAuthenticated ? (
            <Redirect to="/dashboard" />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route path="/login">
          {isAuthenticated ? (
            <Redirect to="/dashboard" />
          ) : (
            <Login onLoginSuccess={handleLoginSuccess} />
          )}
        </Route>
        <Route path="/dashboard">
          {isAuthenticated ? (
            <Dashboard onLogout={handleLogout} />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route path="/todos">
          {isAuthenticated ? <MyToDos /> : <Redirect to="/login" />}
        </Route>
        <Route path="*">
          <Redirect to={isAuthenticated ? "/dashboard" : "/login"} />
        </Route>
      </Switch>
    </Router>
  );
};

export default Main;
