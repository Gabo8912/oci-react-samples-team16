import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./NavBar";
import MyToDos from "./App";
import Dashboard from "./Dashboard";

const Main = () => {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/todos" component={MyToDos} />
      </Switch>
    </Router>
  );
};

export default Main;
