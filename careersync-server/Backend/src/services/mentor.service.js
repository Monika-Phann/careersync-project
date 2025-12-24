// src/services/mentorService.js
const { Mentor, User } = require("../models");

exports.applyAsMentor = async (userId, mentorData, profileImage) => {
  // Check if already applied
  const existing = await Mentor.findOne({ where: { userId } });
  if (existing) {
    throw new Error(`You have already applied (status: ${existing.approval_status})`);
  }

  const {
    first_name,
    last_name,
    gender,
    dob,
    phone,
    position_id,
    industry_id,
    job_title,
    expertise_areas,
    experience_years,
    company_name,
    social_media,
    about_mentor
  } = mentorData;

  if (!first_name || !last_name || !gender || !dob || !phone || !job_title) {
    throw new Error("Required fields missing");
  }

  const mentor = await Mentor.create({
    userId,
    first_name,
    last_name,
    email: mentorData.email || null, // from req.user.email in controller
    gender,
    dob,
    phone,
    position_id: position_id || null,
    industry_id: industry_id || null,
    job_title,
    expertise_areas,
    experience_years: experience_years || 0,
    company_name,
    social_media,
    about_mentor,
    profile_image: profileImage,
    approval_status: "pending"
  });

  // Update User table
  await User.update({
    fullName: `${first_name} ${last_name}`,
    phone,
    gender,
    dob
  }, { where: { id: userId } });

  return mentor;
};

exports.getMyApplication = async (userId) => {
  const mentor = await Mentor.findOne({ where: { userId } });
  if (!mentor) throw new Error("No application found");
  return mentor;
};

exports.getMyProfile = async (userId) => {
  const mentor = await Mentor.findOne({ 
    where: { userId },
    include: [{ model: User, as: "mentorUser", attributes: ["id", "username", "email", "fullName"] }]
  });
  if (!mentor) throw new Error("Profile not found");
  return mentor;
};

exports.updateProfile = async (userId, updates, profileImage) => {
  const mentor = await Mentor.findOne({ where: { userId } });
  if (!mentor) throw new Error("Profile not found");

  await mentor.update(updates);

  if (updates.first_name || updates.last_name || updates.phone) {
    const fullName = `${updates.first_name || mentor.first_name} ${updates.last_name || mentor.last_name}`.trim();
    await User.update({
      fullName,
      phone: updates.phone || mentor.phone
    }, { where: { id: userId } });
  }

  return mentor;
};

exports.getAllApprovedMentors = async () => {
  return await Mentor.findAll({
    where: { approval_status: "approved" },
    include: [{ model: User, as: "mentorUser", attributes: ["id", "username", "email", "fullName"] }]
  });
};

exports.getMentorById = async (mentorId) => {
  const mentor = await Mentor.findByPk(mentorId, {
    include: [{ model: User, as: "mentorUser", attributes: ["id", "username", "email", "fullName", "profileImage"] }]
  });
  if (!mentor) throw new Error("Mentor not found");
  return mentor;
};