const { Booking, ScheduleTimeslot, Session, Mentor, AccUser, sequelize } = require('../models');

class BookingService {
  
  // --- 1. EXISTING: Create Booking ---
  static async createBooking({ accUserId, scheduleTimeslotId }) {
    return sequelize.transaction(async (t) => {
      const timeslot = await ScheduleTimeslot.findOne({
        where: { id: scheduleTimeslotId, is_available: true },
        include: [Session, Mentor],
        lock: t.LOCK.UPDATE,
        transaction: t
      });

      if (!timeslot) {
        throw new Error('Timeslot not available');
      }

      const accUser = await AccUser.findByPk(accUserId);
      if (!accUser) throw new Error('Student not found');

      const booking = await Booking.create({
        schedule_timeslot_id: timeslot.id,
        mentor_id: timeslot.mentor_id,
        acc_user_id: accUser.id,
        session_id: timeslot.session_id,

        mentor_name_snapshot: `${timeslot.Mentor.first_name} ${timeslot.Mentor.last_name}`,
        acc_user_name_snapshot: `${accUser.first_name} ${accUser.last_name}`,
        session_price_snapshot: timeslot.Session.price,
        start_date_snapshot: timeslot.start_date,
        end_date_snapshot: timeslot.end_date,
        total_amount: timeslot.Session.price,
        status: 'upcoming' // Ensure default status is set
      }, { transaction: t });

      await timeslot.update(
        { is_available: false },
        { transaction: t }
      );

      return booking;
    });
  }

  // --- 2. NEW: Get Bookings (Connected to Frontend) ---
  static async getBookings(accUserId = null) {
    const options = {
      include: [
        { 
          model: Mentor,
          // We need these fields for the frontend cards
          // CHECK YOUR DB: Ensure 'job_title' and 'industry' exist in your Mentor table
          attributes: ['job_title', 'industry'] 
        },
        {
          model: Session,
          attributes: ['title', 'location'] // Assuming Session has location
        }
      ],
      order: [['created_at', 'DESC']]
    };

    // If a specific user ID is provided, filter by it
    if (accUserId) {
      options.where = { acc_user_id: accUserId };
    }

    const bookings = await Booking.findAll(options);

    // --- CRITICAL: MAP DB DATA TO FRONTEND FORMAT ---
    return bookings.map(booking => ({
      id: booking.id,
      
      // Frontend: mentorName -> DB: mentor_name_snapshot
      mentorName: booking.mentor_name_snapshot, 
      
      // Frontend: role -> DB: Mentor.job_title (with fallback)
      role: booking.Mentor ? booking.Mentor.job_title : 'Mentor',
      
      // Frontend: industry -> DB: Mentor.industry
      industry: booking.Mentor ? booking.Mentor.industry : 'General',
      
      // Frontend: date -> DB: start_date_snapshot
      date: booking.start_date_snapshot, 
      
      // Frontend: location -> DB: Session.location (or default)
      location: booking.Session ? booking.Session.location : 'Online / Remote',
      
      // Frontend: status
      status: booking.status || 'upcoming',

      // Frontend: invoiceDetails object (Needed for PDF)
      invoiceDetails: {
        invoiceId: `INV-${booking.id}`, // Generate a simple ID
        studentName: booking.acc_user_name_snapshot,
        mentorName: booking.mentor_name_snapshot,
        program: booking.Session ? booking.Session.title : 'Shadowing Session',
        bookingDate: booking.created_at, // When they booked it
        startDate: booking.start_date_snapshot, // When the session actually is
        total: booking.total_amount
      }
    }));
  }
}

module.exports = BookingService;