import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import "./index.css";
import Main from "./Main";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* Wrap with AuthProvider */}
        <Main />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);