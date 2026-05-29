const User = require("../models/User");
const jwt = require("jsonwebtoken");
const OTP = require("../models/OTP.model");
const { generateOTP, sendOTPEmail } = require("../controllers/email.service");

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        phone: user.phone,
        location: user.location,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        phone: user.phone,
        location: user.location,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, bio, phone, location } = req.body;

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;
    if (bio !== undefined) updateFields.bio = bio;
    if (phone !== undefined) updateFields.phone = phone;
    if (location !== undefined) updateFields.location = location;

    const user = await User.findByIdAndUpdate(req.userId, updateFields, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Update profile error:", error);
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { preferences: req.body },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.preferences);
  } catch (error) {
    console.error("Update preferences error:", error);
    res
      .status(500)
      .json({ message: "Error updating preferences", error: error.message });
  }
};

exports.getPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("preferences");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.preferences || {});
  } catch (error) {
    console.error("Get preferences error:", error);
    res
      .status(500)
      .json({ message: "Error fetching preferences", error: error.message });
  }
};

// Request password reset OTP
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this email" });
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP to database
    await OTP.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { upsert: true, new: true },
    );

    // Send OTP via email
    await sendOTPEmail(email, otp);

    res.status(200).json({
      message: "OTP sent successfully to your email",
      email: email,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      message: error.message || "Failed to process request",
      error: error.message,
    });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Find OTP in database
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Check if OTP is expired (10 minutes)
    const otpAge = Date.now() - new Date(otpRecord.createdAt).getTime();
    if (otpAge > 600000) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    // Generate temporary reset token
    const resetToken = jwt.sign(
      { email, purpose: "password_reset" },
      process.env.JWT_SECRET,
      { expiresIn: "10m" },
    );

    // Delete OTP after successful verification
    await OTP.deleteOne({ _id: otpRecord._id });

    res.status(200).json({
      message: "OTP verified successfully",
      resetToken,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      message: "Failed to verify OTP",
      error: error.message,
    });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res
        .status(400)
        .json({ message: "Reset token and new password are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Verify reset token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    if (decoded.purpose !== "password_reset") {
      return res.status(400).json({ message: "Invalid token purpose" });
    }

    const { email } = decoded;

    // Find user and update password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update password (the pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      message:
        "Password reset successfully. Please login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      message: "Failed to reset password",
      error: error.message,
    });
  }
};
