// src/routes/authRoute.js
const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const changePassword = require("../controllers/authmentor.controller");
// Auth endpoints
router.post("/register", upload.single("profileImage"), authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/refresh", authController.refresh);
// router.patch("/change-password", authMiddleware.changePassword);

//router.post("/register-mentor", upload.single("profileImage"), authController.registerMentor);

// Email verify
router.get("/verify/:token", authController.verifyEmail);
// Add this line after the other verify route
// router.get("/verify-mentor/:token", authController.verifyMentor);

// Password reset
router.post("/reset-request", authController.resetRequest);
router.post("/reset/:token", authController.resetPassword);

module.exports = router;
