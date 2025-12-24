// src/controllers/mentorController.js
const mentorService = require("../services/mentor.service");
const mentorAdminService = require("../services/mentorAdmin.service");

exports.applyAsMentor = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const profileImage = req.file ? req.file.filename : null;
    const mentor = await mentorService.applyAsMentor(req.user.id, req.body, profileImage);
    res.status(201).json({ message: "Application submitted!", mentor });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMyApplication = async (req, res) => {
  try {
    const application = await mentorService.getMyApplication(req.user.id);
    res.json({ hasApplied: true, application });
  } catch (err) {
    res.status(404).json({ message: err.message, hasApplied: false });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const profile = await mentorService.getMyProfile(req.user.id);
    res.json(profile);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const profileImage = req.file ? req.file.filename : null;
    const updates = req.body;
    const mentor = await mentorService.updateProfile(req.user.id, updates, profileImage);
    res.json({ message: "Profile updated", mentor });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllMentors = async (req, res) => {
  try {
    const mentors = await mentorService.getAllApprovedMentors();
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMentorById = async (req, res) => {
  try {
    const mentor = await mentorService.getMentorById(req.params.id);
    res.json(mentor);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Admin actions
exports.getPending = async (req, res) => {
  try {
    const pending = await mentorAdminService.getPendingApplications();
    res.json(pending);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.approve = async (req, res) => {
  try {
    const mentor = await mentorAdminService.approveApplication(req.params.mentorId, req.user.id);
    res.json({ message: "Mentor approved!", mentor });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.reject = async (req, res) => {
  try {
    await mentorAdminService.rejectApplication(req.params.mentorId, req.user.id, req.body.rejection_reason);
    res.json({ message: "Application rejected" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};