import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { authAPI } from "../services/servicesApi";
import labels from "../labels/common";
import toast from "react-hot-toast";
import Icons from "../utils/icons/index";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const resetToken = location.state?.resetToken;

  useEffect(() => {
    if (!resetToken) {
      toast.error("Invalid reset session. Please try again.");
      navigate("/forgot-password");
    }
  }, [resetToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.resetUserPassword(resetToken, newPassword);
      toast.success(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
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
          <h2 className="gradient-text">{labels.resetPasswordTitleHead}</h2>
          <p>{labels.resetPasswordTextHead}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>
              <Icons.FiLock size={16} />{" "}
              {labels.resetPasswordForm.newPasswordLabel}
            </label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={labels.resetPasswordForm.newPasswordPlaceholder}
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
              <Icons.FiLock size={16} />{" "}
              {labels.resetPasswordForm.confirmPasswordLabel}
            </label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={
                  labels.resetPasswordForm.confirmPasswordPlaceholder
                }
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="login-btn">
            {loading
              ? labels.resetPasswordForm.loading.loading
              : labels.resetPasswordForm.loading.static}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="secondary-btn"
          >
            {labels.resetPasswordForm.backToLoginBtnText}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
