import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Icons from "../utils/icons/index";
import labels from "../labels/common";
import { authAPI } from "../services/servicesApi";
import { formatTime } from "../utils/usage";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(300);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
      return;
    }

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [email, navigate]);

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter complete 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.verifyUserOtp(email, otp);
      toast.success(response.data.message);
      navigate("/reset-password", {
        state: { resetToken: response.data.resetToken },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      const response = await authAPI.forgetUserPassword(email);
      toast.success(response.data.message);
      setTimer(300);
      setCanResend(false);
      setOtp("");

      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
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
          <h2 className="gradient-text">{labels.verifyOtpTitleHead}</h2>
          <p>Enter the 6-digit code sent to {email}</p>
        </div>

        <form className="login-form" onSubmit={handleVerify}>
          <div className="form-group">
            <label>{labels.otpVerifyForm.otpLabel}</label>
            <div className="input-wrapper resetpass">
              <input
                type="text"
                value={otp}
                onChange={handleOtpChange}
                placeholder={labels.otpVerifyForm.otpPlaceholder}
                maxLength="6"
                inputMode="numeric"
                pattern="\d*"
                autoFocus
              />
            </div>
          </div>

          <div className="timer-section">
            {!canResend ? (
              <p className="timer-text">
                <Icons.FiClock size={14} /> Resend code in {formatTime(timer)}
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resendLoading}
                className="resend-btn"
              >
                {resendLoading
                  ? labels.forgetPasswordBtnText.loading
                  : labels.forgetPasswordBtnText.resendStatic}
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="primary-btn login-btn"
          >
            {loading
              ? labels.verifyOtpBtnText.loading
              : labels.verifyOtpBtnText.static}
          </button>

          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="secondary-btn"
          >
            {labels.backToForgetBtnText}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;
