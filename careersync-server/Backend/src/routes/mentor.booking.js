const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth.js");
const {
  getMyBookings,
  getBookingById,
  acceptBooking,
  rejectBooking,
  completeBooking,
  getPendingBookings
} = require("../controllers/mentorbooking.controller.js");

// All routes require authentication
router.use(authenticate);

// Get all bookings for logged-in mentor
router.get("/my-bookings", getMyBookings);

// Get pending bookings only
router.get("/pending", getPendingBookings);

// Get single booking details
router.get("/:bookingId", getBookingById);

// Accept/Confirm booking
router.patch("/:bookingId/accept", acceptBooking);

// Reject/Cancel booking
router.patch("/:bookingId/reject", rejectBooking);

// Mark booking as completed
router.patch("/:bookingId/complete", completeBooking);

module.exports = router;