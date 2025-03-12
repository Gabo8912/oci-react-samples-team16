import React from "react";
import { Link } from "react-router-dom";
import oracleLogo from "./oracleLogo.png";

const NavBar = () => {
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
        <button style={styles.logoutButton} onClick={() => alert("Logout")}>
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
    width: "100%", // Asegura que la barra ocupe todo el ancho
    position: "fixed", // Mantiene la navbar fija en la parte superior
    top: "0", // Asegura que esté en la parte superior
    left: "0", // Evita desplazamiento horizontal
    height: "60px", // Ajusta la altura de la navbar
    zIndex: "1000", // Se mantiene por encima de otros elementos
  },
  logo: {
    width: "125px", // Ajusta el tamaño según lo necesites
    height: "125px",
    objectFit: "contain", // Mantiene la proporción de la imagen
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
