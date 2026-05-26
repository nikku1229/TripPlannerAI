import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Icons from "../utils/icons/index";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/Logo/Logo.png";
import "../styles/components/Sidebar.css";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleDarkMode = () => {
    console.log("Dark mode will be implemented later");
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const menuItems = [
    { path: "/dashboard", icon: Icons.FiHome, label: "Dashboard" },
    { path: "/create-trip", icon: Icons.FiCompass, label: "Create Trip" },
    { path: "/chat", icon: Icons.FiMessageSquare, label: "AI Assistant" },
    { path: "/profile", icon: Icons.FiUser, label: "Profile" },
  ];

  if (isMobile) {
    return (
      <>
        <button onClick={toggleSidebar} className="mobile-menu-btn">
          <Icons.FiMenu size={24} />
        </button>

        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeMobileMenu}
                className="mobile-overlay"
              />
              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "tween", duration: 0.3 }}
                className="mobile-sidebar"
              >
                <div className="mobile-sidebar-header">
                  <div className="sidebar-logo">
                    <Link to="/">TripAI</Link>
                  </div>
                  <button onClick={closeMobileMenu} className="close-btn">
                    <Icons.FiX size={24} />
                  </button>
                </div>
                <nav className="mobile-sidebar-nav">
                  {menuItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={({ isActive }) =>
                        `sidebar-link ${isActive ? "active" : ""}`
                      }
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                  <button onClick={logout} className="sidebar-link logout">
                    <Icons.FiLogOut size={20} />
                    <span>Logout</span>
                  </button>
                </nav>
                <div className="mobile-sidebar-footer">
                  <button onClick={toggleDarkMode} className="theme-toggle">
                    <Icons.FiMoon size={20} />
                    <span>Dark Mode</span>
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 260 : 80 }}
      className="sidebar"
    >
      <div className="sidebar-content">
        <div className="sidebar-header">
          {isOpen ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="sidebar-logo"
            >
              <Link to="/">TripAI</Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="sidebar-logo-icon"
            >
              <Link to="/">
                <img src={Logo} alt="TripAI" />
              </Link>
            </motion.div>
          )}
          <button onClick={toggleSidebar} className="sidebar-toggle">
            {isOpen ? (
              <Icons.FiChevronLeft className="icon" />
            ) : (
              <Icons.FiChevronRight className="icon" />
            )}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <item.icon size={20} />
              <motion.span
                animate={{
                  opacity: isOpen ? 1 : 0,
                  display: isOpen ? "inline" : "none",
                }}
              >
                {item.label}
              </motion.span>
            </NavLink>
          ))}
          <button onClick={logout} className="sidebar-link logout">
            <Icons.FiLogOut size={20} />
            <motion.span
              animate={{
                opacity: isOpen ? 1 : 0,
                display: isOpen ? "inline" : "none",
              }}
            >
              Logout
            </motion.span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={toggleDarkMode} className="theme-toggle">
            <Icons.FiMoon size={20} />
            <motion.span
              animate={{
                opacity: isOpen ? 1 : 0,
                display: isOpen ? "inline" : "none",
              }}
            >
              Dark Mode
            </motion.span>
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
