import React, { useEffect, useRef, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import oracleLogo from "./oracleLogo.png";
import "./NavBar.css";

const NavBar = ({ onLogout }) => {
  const history = useHistory();
  const location = useLocation();

  const linksRef = useRef({});
  const lineRef = useRef(null);
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    const activeLink = linksRef.current[activePath];
    const line = lineRef.current;

    if (activeLink && line) {
      const rect = activeLink.getBoundingClientRect();
      const parentRect = activeLink.parentElement.getBoundingClientRect();
      line.style.left = `${rect.left - parentRect.left}px`;
      line.style.width = `${rect.width}px`;
    }
  }, [activePath, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    onLogout();
    history.push("/login");
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/todos", label: "MyToDos" },
  ];

  return (
    <nav className="navbar">
      <img src={oracleLogo} alt="Logo" className="logo" />
      <div className="links-container">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="nav-link"
            ref={(el) => (linksRef.current[link.to] = el)}
            onClick={() => setActivePath(link.to)}
          >
            {link.label}
          </Link>
        ))}
        <span className="active-line" ref={lineRef}></span>
        <button className="logout-button" onClick={handleLogout}>
          <LogoutIcon className="logout-icon" />
          <span className="logout-text">LogOut</span>
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
