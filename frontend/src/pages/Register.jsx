import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import labels from "../labels/common";
import Icons from "../utils/icons/index";
import "../styles/pages/Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "confirmPassword" || name === "password") {
      if (name === "confirmPassword") {
        setPasswordMatch(value === formData.password);
      } else if (name === "password") {
        setPasswordMatch(value === formData.confirmPassword);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false);
      return;
    }

    setLoading(true);
    const success = await register(
      formData.name,
      formData.email,
      formData.password,
    );
    setLoading(false);

    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="register-container">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="register-card"
      >
        <div className="register-header">
          <h2 className="gradient-text">{labels.registerTitleHead}</h2>
          <p>{labels.registerTextHead}</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label>
              <Icons.FiUser size={16} /> {labels.formFieldLoginRegister.fullNameLabel}
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={labels.formFieldLoginRegister.fullNamePlaceholder}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <Icons.FiMail size={16} /> {labels.formFieldLoginRegister.emailLabel}
            </label>
            <div className="input-wrapper">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={labels.formFieldLoginRegister.emailPlaceholder}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <Icons.FiLock size={16} /> {labels.formFieldLoginRegister.passwordLabel}
            </label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={labels.formFieldLoginRegister.createPasswordPlaceholder}
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

          <div className="form-group">
            <label>
              <Icons.FiLock size={16} /> {labels.formFieldLoginRegister.confirmPasswordLabel}
            </label>
            <div className="input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder={labels.formFieldLoginRegister.confirmPasswordPlaceholder}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-toggle"
              >
                {showConfirmPassword ? (
                  <Icons.FiEyeOff size={18} />
                ) : (
                  <Icons.FiEye size={18} />
                )}
              </button>
            </div>
            {!passwordMatch && (
              <p className="error-message">{labels.passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !passwordMatch}
            className="register-btn"
          >
            {loading
              ? labels.loadingRegister.loading
              : labels.loadingRegister.static}
          </button>
        </form>

        <p className="login-link">
          {labels.registerPageSignInText}{" "}
          <Link to="/login">{labels.loadingLogin.static}</Link>
        </p>

        <div className="terms-text">
          <p>{labels.termConditionText}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
