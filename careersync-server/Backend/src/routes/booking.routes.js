const express = require('express');
const router = express.Router();

const bookingController = require('../controllers/booking.controller');

// This was existing (Create)
router.post('/', bookingController.createBooking);

// --- ADD THIS LINE (Read) ---
// This allows the frontend to fetch the list of bookings
router.get('/', bookingController.getBookings); 

module.exports = router;