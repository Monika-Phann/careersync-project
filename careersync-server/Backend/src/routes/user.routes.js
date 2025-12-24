// src/routes/userRoute.js
const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const userController = require("../controllers/user.controller");

// Profile
router.get("/profile", auth, userController.getProfile);
router.put(
  "/profile",
  auth,
  upload.single("profileImage"),
  userController.updateProfile
);

// Security
router.put("/change-password", auth, userController.changePassword);

// Tabs
router.get("/bookings", auth, userController.bookingHistory);
router.get("/certificates", auth, userController.certificateList);

module.exports = router;
