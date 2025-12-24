const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const authenticate = require("../middleware/auth");
const {
  applyAsMentor,
  getMyApplication,
  getAllMentors,
  getMentorById,
  getMyProfile,
  updateProfile,
  getPending,
  approve,
  reject
} = require("../controllers/mentor.controller");

//const { getMyBookings } = require("../controllers/bookingController");

// Mentor bookings route
//router.get("/bookings", authenticate, getMyBookings);

// Public routes
router.get("/", getAllMentors); // Browse all approved mentors
router.get("/:id", getMentorById); // View single mentor (MUST be after other routes!)

// Authenticated user routes
router.post("/apply", authenticate, upload.single("profile_image"), applyAsMentor);
router.get("/my-application", authenticate, getMyApplication);

// Authenticated mentor routes
router.get("/me/profile", authenticate, getMyProfile);
router.put("/me/profile", authenticate, upload.single("profile_image"), updateProfile);

// Admin routes
router.get("/admin/pending", authenticate, (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Admin only" });
  next();
}, getPending);

router.patch("/admin/approve/:mentorId", authenticate, (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Admin only" });
  next();
}, approve);

router.patch("/admin/reject/:mentorId", authenticate, (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Admin only" });
  next();
}, reject);

module.exports = router;