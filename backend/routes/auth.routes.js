const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile", authMiddleware, authController.getProfile);
router.put("/profile", authMiddleware, authController.updateProfile);
router.get("/preferences", authMiddleware, authController.getPreferences);
router.put("/preferences", authMiddleware, authController.updatePreferences);
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-otp", authController.verifyOTP);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
