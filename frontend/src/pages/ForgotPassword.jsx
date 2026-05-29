import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/servicesApi";
import toast from "react-hot-toast";
import Icons from "../utils/icons/index";
import labels from "../labels/common";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.forgetUserPassword(email);
      toast.success(response.data.message);
      setOtpSent(true);
      setUserEmail(email);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
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
          <h2 className="gradient-text">{labels.forgetPasswordTitleHead}</h2>
          <p>
            {!otpSent
              ? labels.forgetPasswordTextHead
              : `OTP sent to ${userEmail}`}
          </p>
        </div>

        {!otpSent ? (
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
                  placeholder={labels.forgetPasswordEmailPlaceholder}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="login-btn">
              {loading
                ? labels.forgetPasswordBtnText.loading
                : labels.forgetPasswordBtnText.static}
            </button>

            <p className="signup-link">
              Remember your password? <Link to="/login">Back to Login</Link>
            </p>
          </form>
        ) : (
          <div className="otp-sent-message">
            <p>{labels.otpSentMessage}</p>
            <button
              onClick={() =>
                navigate("/verify-otp", { state: { email: userEmail } })
              }
              className="login-btn"
            >
              {labels.verifyPageBtnText}
            </button>

            <button
              onClick={() => {
                setOtpSent(false);
                setEmail("");
              }}
              className="secondary-btn"
            >
              {labels.switchEmailBtnText}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
