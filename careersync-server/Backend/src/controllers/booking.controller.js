const BookingService = require('../services/booking.service');

// 1. Existing Create Function
const createBooking = async (req, res) => {
  try {
    const booking = await BookingService.createBooking({
      accUserId: req.body.acc_user_id,
      scheduleTimeslotId: req.body.schedule_timeslot_id
    });

    return res.status(201).json({
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

// 2. NEW: Get Bookings Function
const getBookings = async (req, res) => {
  try {
    // We call the service to get the list
    // (We will update the service in the next step)
    const bookings = await BookingService.getBookings();
    
    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Error getting bookings:", error);
    return res.status(500).json({
      message: "Failed to retrieve bookings"
    });
  }
};

module.exports = {
  createBooking,
  getBookings // <--- Don't forget to export the new function!
};