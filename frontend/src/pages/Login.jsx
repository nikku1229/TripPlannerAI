import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import labels from "../labels/common";
import Icons from "../utils/icons/index";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="login-container">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="login-card"
      >
        <div className="login-header">
          <h2 className="gradient-text">{labels.loginTitleHead}</h2>
          <p>{labels.loginTextHead}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>
              <Icons.FiMail size={16} />{" "}
              {labels.formFieldLoginRegister.emailLabel}
            </label>
            <div className="input-wrapper">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={labels.formFieldLoginRegister.emailPlaceholder}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <Icons.FiLock size={16} />{" "}
              {labels.formFieldLoginRegister.passwordLabel}
            </label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={labels.formFieldLoginRegister.passwordPlaceholder}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? (
                  <Icons.FiEyeOff size={18} />
                ) : (
                  <Icons.FiEye size={18} />
                )}
              </button>
            </div>
          </div>

          <div className="forgot-password">
            <Link to="/forgot-password">
              {labels.formFieldLoginRegister.forgetPasswordText}
            </Link>
          </div>

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? labels.loadingLogin.loading : labels.loadingLogin.static}
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="secondary-btn"
          >
            {labels.backToHomeBtnText}
          </button>
        </form>

        <p className="signup-link">
          {labels.loginPageSignUpText}{" "}
          <Link to="/register">{labels.loadingRegister.static}</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
