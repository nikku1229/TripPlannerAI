import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/Logo/Logo.png";
import labels from "../labels/common";

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <Link to="/">
            <img src={Logo} alt={labels.appName} className="logo-image" />
            <span className="logo-text">{labels.appName}</span>
          </Link>
        </div>
        <nav className="header-nav">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link secondary-btn hid-btn">
                {labels.headerDashboardBtnText}
              </Link>
              <Link to="/profile" className="nav-link primary-btn">
                {labels.headerProfileBtnText}
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link secondary-btn">
                {labels.headerLoginBtn}
              </Link>
              <Link
                to="/register"
                className="primary-btn small nav-link hid-btn"
              >
                {labels.headerRegisterBtn}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
