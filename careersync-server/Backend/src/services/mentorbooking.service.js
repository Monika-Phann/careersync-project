// Backend/src/services/mentorbooking.service.js
const { Booking, User, ScheduleTimeslot, Mentor, Invoice, Certificate } = require("../models");
const sendEmail = require("../utils/sendEmail");

const COMMISSION_RATE = 0.20; // 20% platform commission

const generateCertificateNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `CERT-${year}-${random}`;
};

exports.getMyBookings = async (mentorId) => {
  const mentor = await Mentor.findOne({ where: { userId: mentorId } });
  if (!mentor) throw new Error("Only mentors can view bookings");

  const bookings = await Booking.findAll({
    where: { mentor_id: mentor.id },
    include: [
      {
        model: User,
        as: "mentee",
        attributes: ["id", "username", "fullName", "email", "phone", "profileImage"]
      },
      {
        model: ScheduleTimeslot,
        as: "timeslot",
        attributes: ["id", "start_date", "end_date"]
      }
    ],
    order: [["created_at", "DESC"]]
  });

  return { count: bookings.length, bookings };
};

exports.getBookingById = async (bookingId, mentorId) => {
  const mentor = await Mentor.findOne({ where: { userId: mentorId } });
  if (!mentor) throw new Error("Only mentors can view bookings");

  const booking = await Booking.findByPk(bookingId, {
    include: [
      {
        model: User,
        as: "mentee",
        attributes: ["id", "username", "fullName", "email", "phone", "profileImage"]
      },
      {
        model: ScheduleTimeslot,
        as: "timeslot",
        attributes: ["id", "start_date", "end_date"]
      }
    ]
  });

  if (!booking || booking.mentor_id !== mentor.id) {
    throw new Error("Booking not found or not authorized");
  }

  return booking;
};

exports.acceptBooking = async (bookingId, mentorId) => {
  const mentor = await Mentor.findOne({ where: { userId: mentorId } });
  if (!mentor) throw new Error("Only mentors can accept bookings");

  const booking = await Booking.findByPk(bookingId, {
    include: [{ model: User, as: "mentee", attributes: ["email", "fullName"] }]
  });

  if (!booking || booking.mentor_id !== mentor.id) {
    throw new Error("Booking not found or not yours");
  }

  if (booking.status !== "pending") {
    throw new Error("Booking not pending");
  }

  await booking.update({ status: "confirmed" });

  const timeslot = await ScheduleTimeslot.findByPk(booking.timeslot_id);

if (timeslot) {
  await timeslot.update({
    is_available: false,
    booking_id: booking.id
  });
}



  const totalAmount = parseFloat(booking.total_amount);
  const commission = totalAmount * COMMISSION_RATE;
  const mentorEarnings = totalAmount - commission;

  // Create invoice
  await Invoice.create({
    mentor_id: mentor.id,
    acc_user_id: booking.acc_user_id,
    position_id: booking.position_id,
    total_amount: totalAmount,
    mentor_name_snapshot: booking.mentor_name_snapshot,
    mentor_position_snapshot: booking.position_name_snapshot,
    acc_user_name_snapshot: booking.acc_user_name_snapshot,
    start_date_snapshot: booking.start_date_snapshot,
    end_date_snapshot: booking.end_date_snapshot,
    session_price_snapshot: booking.session_price_snapshot,
    payment_method_snapshot: "cash",
    status: "pending"
  });

  // Send email
  const sessionDate = new Date(booking.start_date_snapshot);
  const html = `
    <h2>Invoice for Your Session</h2>
    <p>Dear ${booking.acc_user_name_snapshot},</p>
    <p>Your booking has been confirmed!</p>
    <p><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
    <p><strong>Platform Commission (20%):</strong> $${commission.toFixed(2)}</p>
    <p><strong>Mentor Earnings:</strong> $${mentorEarnings.toFixed(2)}</p>
    <p>Please bring cash payment of <strong>$${totalAmount.toFixed(2)}</strong> to the session.</p>
    <p>Session Date: ${sessionDate.toLocaleString()}</p>
    <p>Thank you!</p>
  `;

  await sendEmail({
    to: booking.mentee.email,
    subject: "Your Booking Invoice - CareerSync",
    html
  });

  return { commission, mentorEarnings };
};

exports.rejectBooking = async (bookingId, mentorId, rejection_reason) => {
  const mentor = await Mentor.findOne({ where: { userId: mentorId } });
  if (!mentor) throw new Error("Only mentors can reject bookings");

  const booking = await Booking.findByPk(bookingId, {
    include: [
      { model: User, as: "mentee", attributes: ["email"] },
      { model: ScheduleTimeslot, as: "timeslot" }
    ]
  });

  if (!booking || booking.mentor_id !== mentor.id) {
    throw new Error("Booking not found or not yours");
  }

  if (booking.status === "cancelled" || booking.status === "completed") {
    throw new Error("Cannot reject this booking");
  }

  await booking.update({
    status: "cancelled",
    cancelled_by: mentorId
  });

  if (booking.timeslot) {
    await booking.timeslot.update({
      is_available: true,
      booking_id: null
    });
  }

  await sendEmail({
    to: booking.mentee.email,
    subject: "Booking Rejected",
    html: `<p>Unfortunately, your mentor has rejected the booking.</p>
           ${rejection_reason ? `<p>Reason: ${rejection_reason}</p>` : ''}`
  });

  return { rejection_reason };
};

exports.completeBooking = async (bookingId, mentorId) => {
  const mentor = await Mentor.findOne({ where: { userId: mentorId } });
  if (!mentor) throw new Error("Only mentors can complete bookings");

  const booking = await Booking.findByPk(bookingId);
  if (!booking || booking.mentor_id !== mentor.id) {
    throw new Error("Booking not found or not yours");
  }

  if (booking.status !== "confirmed") {
    throw new Error("Only confirmed bookings can be completed");
  }

  await booking.update({ status: "completed" });

const certificateNumber = generateCertificateNumber();
  await Certificate.create({
    booking_id: booking.id,
    position_id: booking.position_id,
    acc_user_id: booking.acc_user_id,
    mentor_id: booking.mentor_id,
    mentor_name_snapshot: mentor.first_name + " " + mentor.last_name,
    position_name_snapshot: booking.position_name_snapshot,
    issue_date: new Date(),
    certificate_number: certificateNumber,
    issued_by: mentorId
  });

  // Send beautiful certificate email
  const issueDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f9; padding: 20px; }
        .container { max-width: 600px; margin: auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; padding: 40px; text-align: center; }
        .content { padding: 40px; text-align: center; color: #333; }
        .certificate { background: #eef2ff; padding: 30px; border-radius: 12px; margin: 30px 0; }
        .button { display: inline-block; padding: 16px 32px; background: #4F46E5; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>CAREERSYNC</h1>
          <h2>Certificate of Completion</h2>
        </div>
        <div class="content">
          <h2>Congratulations, ${booking.acc_user_name_snapshot}! 🎉</h2>
          <p>You have successfully completed your mentoring session:</p>
          
          <div class="certificate">
            <h3>${booking.position_name_snapshot}</h3>
            <p>with Mentor <strong>${mentor.first_name} ${mentor.last_name}</strong></p>
            <p>Completed on: <strong>${issueDate}</strong></p>
            <p><strong>Certificate Number:</strong> ${certificateNumber}</p>
          </div>

          <p>This certificate recognizes your dedication to professional growth.</p>
          <p>You can share this achievement on LinkedIn or your resume!</p>
          
          <a href="${process.env.APP_URL}/my-certificates" class="button">View All My Certificates</a>
        </div>
        <div style="background: #1e293b; color: #94a3b8; padding: 20px; text-align: center; font-size: 14px;">
          <p>&copy; 2025 CareerSync — Connecting students with career mentors</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: booking.mentee.email,
    subject: `🎉 Your CareerSync Certificate - ${booking.position_name_snapshot}`,
    html
  });

  return { certificateNumber };
};

exports.getPendingBookings = async (mentorId) => {
  const mentor = await Mentor.findOne({ where: { userId: mentorId } });
  if (!mentor) throw new Error("Only mentors can view pending bookings");

  const bookings = await Booking.findAll({
    where: { mentor_id: mentor.id, status: "pending" },
    include: [
      {
        model: User,
        as: "mentee",
        attributes: ["id", "username", "fullName", "email", "phone", "profileImage"]
      },
      {
        model: ScheduleTimeslot,
        as: "timeslot",
        attributes: ["id", "start_date", "end_date"]
      }
    ],
    order: [["created_at", "ASC"]]
  });

  return { count: bookings.length, bookings };
};


exports.getMyEarnings = async (mentorId) => {
  const mentor = await Mentor.findOne({ where: { userId: mentorId } });
  if (!mentor) throw new Error("Only mentors can view earnings");

  const bookings = await Booking.findAll({
    where: { mentor_id: mentor.id, status: "completed" },
    attributes: ["total_amount"]
  });

  const COMMISSION_RATE = 0.20; // 20% platform commission

  const totalRevenue = bookings.reduce((sum, b) => sum + parseFloat(b.total_amount || 0), 0);
  const platformCommission = totalRevenue * COMMISSION_RATE;
  const mentorEarnings = totalRevenue - platformCommission;

  return {
    totalSessionsCompleted: bookings.length,
    totalRevenue: totalRevenue.toFixed(2),
    platformCommission: platformCommission.toFixed(2),
    mentorEarnings: mentorEarnings.toFixed(2),
    commissionRate: `${(COMMISSION_RATE * 100).toFixed(0)}%`
  };
};