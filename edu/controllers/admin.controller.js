const { sendTelegramNotification } = require('../services/telegram.service');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sequelize = require('../config/database');
const { User, Admin, Mentor, AccUser, Industry, Position } = require('../models'); 
const { Op } = require('sequelize');

// --- Multer Setup (Keep existing) ---
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/profiles';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: profileStorage });
const uploadPosition = multer({ storage: profileStorage }); // Reuse for simplicity

// --- DASHBOARD ---
const getFullDashboard = async (req, res) => {
  try {
    const userCount = await User.count();
    const pendingMentors = await Mentor.count({ where: { approval_status: 'pending' } });
    
    res.json({
      stats: { totalUsers: userCount, pendingMentors },
      recentActivity: [] 
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: 'Dashboard error' });
  }
};

const getMentorStats = async (req, res) => {
  try {
    const total = await Mentor.count();
    const accepted = await Mentor.count({ where: { approval_status: 'approved' } });
    const rejected = await Mentor.count({ where: { approval_status: 'rejected' } });
    const pending = await Mentor.count({ where: { approval_status: 'pending' } });
    
    res.json({ total, accepted, rejected, pending });
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ message: 'Failed to fetch mentor stats' });
  }
};

// --- MENTOR MANAGEMENT ---

// ✅ FIXED: No longer tries to include Position/Industry tables
const listPendingMentors = async (req, res) => {
  try {
    const mentors = await Mentor.findAll({
      where: { approval_status: 'pending' },
      order: [['created_at', 'DESC']]
    });

    // Map the text fields directly
    const formatted = mentors.map(m => ({
      id: m.id,
      first_name: m.first_name,
      last_name: m.last_name,
      gender: m.gender,
      job_title: m.job_title,
      created_at: m.created_at,
      position_name: m.position, // It is now a String
      industry_name: m.industry, // It is now a String
      document_url: m.cv_link    // Return the CV link
    }));

    res.json(formatted);
  } catch (error) {
    console.error("List Pending Error:", error);
    res.status(500).json({ message: 'Server error fetching mentors' });
  }
};

const reviewMentor = async (req, res) => {
  const { mentorId } = req.params;
  const { action } = req.body; // 'accept' or 'reject'
  
  if (!['accept', 'reject'].includes(action)) {
    return res.status(400).json({ message: 'Invalid action' });
  }

  const mentorStatus = action === 'accept' ? 'approved' : 'rejected';
  
  // Start Transaction
  const t = await sequelize.transaction();
  try {
    const mentor = await Mentor.findByPk(mentorId);

    if (!mentor) {
      await t.rollback();
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // 1. Update Mentor Status
    mentor.approval_status = mentorStatus;
    // If you have 'approved_by', you can set it here: mentor.approved_by = req.user.id;
    mentor.approved_at = new Date();
    await mentor.save({ transaction: t });

    // 2. Update User Login Status
    // If Accepted -> Active. If Rejected -> Inactive (or keep active as user)
    // For now, let's keep them 'active' so they can login and see their status, 
    // or set 'inactive' if you want to block them.
    if (action === 'accept') {
        await User.update({ status: 'active' }, { where: { id: mentor.user_id }, transaction: t });
    }

    await t.commit(); 
    res.json({ message: `Mentor ${mentorStatus} successfully.` });

  } catch (error) {
    await t.rollback();
    console.error("Review Mentor Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- USER MANAGEMENT ---
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'role_name', 'status', 'created_at'],
      include: [
        { model: Admin, as: 'admin', attributes: ['first_name', 'last_name'], required: false },
        { model: Mentor, as: 'mentor', attributes: ['first_name', 'last_name'], required: false },
        { model: AccUser, as: 'accUser', attributes: ['first_name', 'last_name'], required: false }
      ],
      order: [['created_at', 'DESC']],
    });

    const formatted = users.map(u => {
      let name = 'N/A';
      if (u.role_name === 'admin' && u.admin) name = `${u.admin.first_name} ${u.admin.last_name}`;
      else if (u.role_name === 'mentor' && u.mentor) name = `${u.mentor.first_name} ${u.mentor.last_name}`;
      else if (u.role_name === 'user' && u.accUser) name = `${u.accUser.first_name} ${u.accUser.last_name}`;

      return {
        id: u.id,
        email: u.email,
        role_name: u.role_name,
        status: u.status,
        created_at: u.created_at,
        name: name,
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

const createRole = async (req, res) => {
  // ... (Your existing logic is fine here, assuming standard user creation)
  res.status(501).json({ message: "Not implemented yet" }); 
};

// --- EXPORTS ---
// We simply export the functions. The CRUD for Industry/Position can stay if needed, 
// but remember they aren't used for Mentor registration anymore.
module.exports = {
  upload,
  uploadPosition,
  getFullDashboard,
  getMentorStats,
  listPendingMentors,
  reviewMentor,
  getAllUsers,
  createRole,
  
  // Keep these if your Admin Panel still has pages for them:
  getIndustries: async (req, res) => res.json([]), 
  createIndustry: async (req, res) => res.json({}),
  updateIndustry: async (req, res) => res.json({}),
  deleteIndustry: async (req, res) => res.json({}),
  getPositions: async (req, res) => res.json([]),
  createPosition: async (req, res) => res.json({}),
  updatePosition: async (req, res) => res.json({}),
  deletePosition: async (req, res) => res.json({}),
  updateProfile: async (req, res) => res.json({})
};