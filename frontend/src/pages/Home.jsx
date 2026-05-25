import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Icons from "../utils/icons/index";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import labels from "../labels/common";

const Home = () => {
  const { user } = useAuth();

  const usps = [
    {
      icon: Icons.FiCpu,
      title: "AI-Powered Planning",
    },
    {
      icon: Icons.FiMap,
      title: "Interactive Maps",
    },
    {
      icon: Icons.FiCloud,
      title: "Real-time Weather",
    },
    {
      icon: Icons.FiTrendingUp,
      title: "Budget Tracking",
    },
  ];

  return (
    <>
      <div className="home-container">
        <div className="container">
          <Header />

          <div className="hero-container">
            <div className="hero-txt">
              <h2>{labels.heroBannerTitle}</h2>
              <p>{labels.heroBannerDesc}</p>
            </div>
            <div className="hero-btn">
              <Link to="/dashboard" className="secondary-btn">
                Dashboard
              </Link>
              <Link to="/register" className="primary-btn">
                Get Started
              </Link>
            </div>
          </div>

          <div className="home-usp">
            {usps.map((usp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="usp"
              >
                <usp.icon className="icon" />
                <h3>{usp.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
