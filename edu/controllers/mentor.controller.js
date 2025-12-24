const { Mentor, User } = require('../models');

// --- GET ALL MENTORS (For Admin Dashboard) ---
const getAllMentors = async (req, res) => {
  try {
    // Fetch all mentors and include their User login details (email, status)
    const mentors = await Mentor.findAll({
      include: [
        {
          model: User,
          attributes: ['email', 'status', 'role_name'] // Only get necessary fields
        }
      ],
      order: [['created_at', 'DESC']] // Newest first
    });

    res.json(mentors);
  } catch (error) {
    console.error("Fetch Mentors Error:", error);
    res.status(500).json({ message: "Failed to load mentor data" });
  }
};

// --- UPDATE MENTOR STATUS (Approve/Reject) ---
const updateMentorStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' or 'rejected'

  try {
    const mentor = await Mentor.findByPk(id);
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });

    // 1. Update the Mentor Profile status
    mentor.approval_status = status;
    await mentor.save();

    // 2. If Approved, ensure the User Login is also active
    if (status === 'approved') {
        await User.update({ status: 'active' }, { where: { id: mentor.user_id } });
    } else if (status === 'rejected') {
        // Optional: Deactivate login if rejected
        await User.update({ status: 'inactive' }, { where: { id: mentor.user_id } });
    }

    res.json({ message: `Mentor ${status} successfully`, mentor });
  } catch (error) {
    console.error("Update Mentor Error:", error);
    res.status(500).json({ message: "Update failed" });
  }
};

module.exports = {
  getAllMentors,
  updateMentorStatus
};