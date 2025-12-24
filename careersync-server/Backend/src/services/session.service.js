// src/services/sessionService.js
const { Session, ScheduleTimeslot, Mentor, User } = require("../models");

exports.createSession = async (mentorId, sessionData, timeslotsInput) => {
  // MOVE MENTOR CHECK INSIDE
  const mentor = await Mentor.findOne({ where: { userId: mentorId } });
  if (!mentor || mentor.approval_status !== "approved") {
    throw new Error("Only approved mentors can create sessions");
  }

  const { position_id, price, location_name, location_map_url } = sessionData;

  if (!position_id || !price || !location_name || !location_map_url) {
    throw new Error("Missing required fields");
  }
  if (!timeslotsInput) {
    throw new Error("timeslots is required");
  }

  let timeslots = timeslotsInput;
  if (typeof timeslots === 'string') {
    try {
      timeslots = JSON.parse(timeslots);
    } catch (e) {
      throw new Error("Invalid JSON in timeslots field");
    }
  }

  if (!Array.isArray(timeslots) || timeslots.length === 0) {
    throw new Error("timeslots must be a non-empty array");
  }

  const session = await Session.create({
    user_id: mentorId,
    position_id,
    price: parseFloat(price),
    agenda_pdf: sessionData.agenda_pdf || null,
    location_name,
    location_map_url,
    is_available: true
  });

  const timeslotRecords = timeslots.map(slot => ({
    session_id: session.id,
    mentor_id: mentor.id,  // ← use mentor.id
    user_id: mentorId,
    start_date: new Date(slot.start_date),
    end_date: new Date(slot.end_date),
    is_available: true
  }));

  await ScheduleTimeslot.bulkCreate(timeslotRecords);

  return {
    session,
    timeslotsCreated: timeslotRecords.length
  };
};

exports.getMySessions = async (mentorId) => {
  return await Session.findAll({
    where: { user_id: mentorId },
    include: [{
      model: ScheduleTimeslot,
      as: "timeslots",
      attributes: ["id", "start_date", "end_date", "is_available", "booking_id"]
    }],
    order: [["created_at", "DESC"]]
  });
};

exports.editSession = async (sessionId, mentorId, updates, newTimeslotsInput) => {
  // Add mentor check here too
  const mentor = await Mentor.findOne({ where: { userId: mentorId } });
  if (!mentor || mentor.approval_status !== "approved") {
    throw new Error("Only approved mentors can edit sessions");
  }

  const session = await Session.findOne({
    where: { id: sessionId, user_id: mentorId }
  });

  if (!session) {
    throw new Error("Session not found or not yours");
  }

  const { price, location_name, location_map_url, position_id } = updates;

  if (price !== undefined) session.price = parseFloat(price);
  if (location_name !== undefined) session.location_name = location_name;
  if (location_map_url !== undefined) session.location_map_url = location_map_url;
  if (position_id !== undefined) session.position_id = position_id;

  await session.save();

  let addedCount = 0;
  if (newTimeslotsInput) {
    let newTimeslots = newTimeslotsInput;
    if (typeof newTimeslots === 'string') {
      try {
        newTimeslots = JSON.parse(newTimeslots);
      } catch (e) {
        throw new Error("Invalid JSON in new_timeslots");
      }
    }

    if (Array.isArray(newTimeslots) && newTimeslots.length > 0) {
      const timeslotRecords = newTimeslots.map(slot => ({
        session_id: session.id,
        mentor_id: mentor.id,
        user_id: mentorId,
        start_date: new Date(slot.start_date),
        end_date: new Date(slot.end_date),
        is_available: true
      }));

      await ScheduleTimeslot.bulkCreate(timeslotRecords);
      addedCount = timeslotRecords.length;
    }
  }

  return { session, addedCount };
};

exports.getAvailableSessions = async () => {
  return await Session.findAll({
    include: [
      {
        model: ScheduleTimeslot,
        as: "timeslots",
        where: { is_available: true },
        required: true,
        attributes: ["id", "start_date", "end_date"]
      },
      {
        model: Mentor,
        as: "mentor",
        attributes: ["first_name", "last_name", "job_title", "profile_image"],
        include: [{
          model: User,
          as: "mentorUser",
          attributes: ["fullName"]
        }]
      }
    ],
    where: { is_available: true },
    order: [["created_at", "DESC"]]
  });
};