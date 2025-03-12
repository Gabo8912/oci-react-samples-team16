import React from "react";
import { Link, useHistory } from "react-router-dom";
import oracleLogo from "./oracleLogo.png";

const NavBar = ({ onLogout }) => {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Eliminar token
    localStorage.removeItem("role"); // Eliminar rol
    onLogout(); // Notificar a la app que el usuario cerró sesión
    history.push("/login"); // Redirigir a login
  };

  return (
    <nav style={styles.navbar}>
      <img src={oracleLogo} alt="Logo" style={styles.logo} />
      <div style={styles.links}>
        <Link to="/dashboard" style={styles.link}>
          Dashboard
        </Link>
        <Link to="/todos" style={styles.link}>
          MyToDos
        </Link>
        <button style={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#333",
    color: "white",
    width: "100%",
    position: "fixed",
    top: "0",
    left: "0",
    height: "60px",
    zIndex: "1000",
  },
  logo: {
    width: "125px",
    height: "125px",
    objectFit: "contain",
    userSelect: "none",
  },
  links: {
    alignItems: "center",
    display: "flex",
    gap: "25px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
    userSelect: "none",
  },
  logoutButton: {
    backgroundColor: "#FE141C",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "8px 12px",
    cursor: "pointer",
  },
};

export default NavBar;
