// Backend/src/controllers/bookingController.js
const bookingService = require("../services/mentorbooking.service.js");

exports.getMyBookings = async (req, res) => {
  try {
    const result = await bookingService.getMyBookings(req.user.id);
    res.json({
      message: "Your bookings retrieved successfully",
      ...result
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await bookingService.getBookingById(req.params.bookingId, req.user.id);
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.acceptBooking = async (req, res) => {
  try {
    const result = await bookingService.acceptBooking(req.params.bookingId, req.user.id);
    res.json({
      message: "Booking accepted! Invoice generated and sent.",
      commission: result.commission.toFixed(2),
      mentorEarnings: result.mentorEarnings.toFixed(2)
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.rejectBooking = async (req, res) => {
  try {
    const { rejection_reason } = req.body;
    await bookingService.rejectBooking(req.params.bookingId, req.user.id, rejection_reason);
    res.json({ message: "Booking rejected successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.completeBooking = async (req, res) => {
  try {
    const result = await bookingService.completeBooking(req.params.bookingId, req.user.id);
    res.json({
      message: "Session completed and certificate issued!",
      certificateNumber: result.certificateNumber
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getPendingBookings = async (req, res) => {
  try {
    const result = await bookingService.getPendingBookings(req.user.id);
    res.json({
      message: "Pending bookings retrieved successfully",
      ...result
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMyEarnings = async (req, res) => {
  try {
    const earnings = await bookingService.getMyEarnings(req.user.id);
    res.json({
      message: "Your earnings summary",
      ...earnings
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};