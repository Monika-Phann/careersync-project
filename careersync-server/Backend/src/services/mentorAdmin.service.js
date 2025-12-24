// // src/services/mentorAdminService.js
// const { Mentor, User } = require("../models");
// const sendEmail = require("../utils/sendEmail");
// const crypto = require("crypto");

// exports.getPendingApplications = async () => {
//   return await Mentor.findAll({
//     where: { approval_status: "pending" },
//     include: [{
//       model: User,
//       as: "mentorUser",
//       attributes: ["id", "username", "email", "fullName", "profileImage"]
//     }],
//     order: [["created_at", "DESC"]]
//   });
// };

// exports.approveApplication = async (mentorId, adminId) => {
//   const mentor = await Mentor.findByPk(mentorId, {
//     include: [{ model: User, as: "mentorUser" }]
//   });

//   if (!mentor) throw new Error("Application not found");

//   await mentor.update({
//     approval_status: "approved",
//     approved_by: adminId,
//     approved_at: new Date()
//   });

//   const verifyToken = crypto.randomBytes(32).toString("hex");
//   const verifyTokenExp = new Date(Date.now() + 24 * 60 * 60 * 1000);

//   await mentor.mentorUser.update({ verifyToken, verifyTokenExp });

//   const verifyUrl = `${process.env.APP_URL}/api/auth/verify-mentor/${verifyToken}`;
//   const html = `
//     <h2>Congratulations ${mentor.first_name}! 🎉</h2>
//     <p>Your mentor application has been approved!</p>
//     <p>Click <a href="${verifyUrl}">here</a> to activate your mentor account.</p>
//   `;

//   await sendEmail({
//     to: mentor.mentorUser.email,
//     subject: "Mentor Application Approved",
//     html
//   });

//   return mentor;
// };

// exports.rejectApplication = async (mentorId, adminId, rejection_reason) => {
//   const mentor = await Mentor.findByPk(mentorId, {
//     include: [{ model: User, as: "mentorUser" }]
//   });

//   if (!mentor) throw new Error("Application not found");

//   await mentor.update({
//     approval_status: "rejected",
//     approved_by: adminId,
//     approved_at: new Date()
//   });

//   if (mentor.mentorUser.email && rejection_reason) {
//     await sendEmail({
//       to: mentor.mentorUser.email,
//       subject: "Mentor Application Update",
//       html: `<p>Your application was not approved.</p><p>Reason: ${rejection_reason}</p>`
//     });
//   }

//   return mentor;
// };

// src/services/mentorAdminService.js
const { Mentor, User, sequelize } = require("../models");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

exports.getPendingApplications = async () => {
  return await Mentor.findAll({
    where: { approval_status: "pending" },
    include: [{
      model: User,
      as: "mentorUser",
      attributes: ["id", "username", "email", "fullName", "profileImage"]
    }],
    order: [["created_at", "DESC"]]
  });
};

exports.approveApplication = async (mentorId, adminId) => {
  const t = await sequelize.transaction();

  try {
    // 1. Validate admin exists
    const admin = await User.findByPk(adminId, { transaction: t });
    if (!admin || admin.role !== "admin") {
      await t.rollback();
      throw new Error("Invalid admin user");
    }

    // 2. Find mentor application with user data
    const mentor = await Mentor.findByPk(mentorId, {
      include: [{ model: User, as: "mentorUser" }],
      transaction: t
    });

    if (!mentor) {
      await t.rollback();
      throw new Error("Application not found");
    }

    // 3. Validate current status
    if (mentor.approval_status === "approved") {
      await t.rollback();
      throw new Error("Application already approved");
    }

    if (mentor.approval_status === "rejected") {
      await t.rollback();
      throw new Error("Cannot approve a rejected application");
    }

    // 4. Update mentor status
    await mentor.update({
      approval_status: "approved",
      approved_by: adminId,
      approved_at: new Date()
    }, { transaction: t });

    // 5. Generate verification token for mentor account activation
    const verifyToken = crypto.randomBytes(32).toString("hex");
    const verifyTokenExp = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await mentor.mentorUser.update({ 
      verifyToken, 
      verifyTokenExp 
    }, { transaction: t });

    // 6. Commit transaction before sending email
    await t.commit();

    // 7. Send approval email (non-critical, don't fail if email fails)
    try {
      const verifyUrl = `${process.env.APP_URL}/api/auth/verify-mentor/${verifyToken}`;
      const html = `
        <h2>Congratulations ${mentor.first_name}! 🎉</h2>
        <p>Your mentor application has been approved by our team!</p>
        <p>Please click the link below to activate your mentor account:</p>
        <p><a href="${verifyUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Activate Mentor Account</a></p>
        <p>This link will expire in 24 hours.</p>
        <p>Once activated, you can:</p>
        <ul>
          <li>Create mentorship sessions</li>
          <li>Set your availability</li>
          <li>Connect with mentees</li>
        </ul>
        <p>Welcome to the team!</p>
      `;

      await sendEmail({
        to: mentor.mentorUser.email,
        subject: "🎉 Mentor Application Approved - Activate Your Account",
        html
      });
    } catch (emailError) {
      console.error("Failed to send approval email:", emailError);
      // Don't throw - approval succeeded even if email failed
    }

    return mentor;

  } catch (error) {
    // Rollback if transaction not yet committed
    if (!t.finished) {
      await t.rollback();
    }
    throw error;
  }
};

exports.rejectApplication = async (mentorId, adminId, rejection_reason) => {
  const t = await sequelize.transaction();

  try {
    // 1. Validate inputs
    if (!rejection_reason || rejection_reason.trim() === "") {
      await t.rollback();
      throw new Error("Rejection reason is required");
    }

    // 2. Validate admin exists
    const admin = await User.findByPk(adminId, { transaction: t });
    if (!admin || admin.role !== "admin") {
      await t.rollback();
      throw new Error("Invalid admin user");
    }

    // 3. Find mentor application
    const mentor = await Mentor.findByPk(mentorId, {
      include: [{ model: User, as: "mentorUser" }],
      transaction: t
    });

    if (!mentor) {
      await t.rollback();
      throw new Error("Application not found");
    }

    // 4. Validate current status
    if (mentor.approval_status === "approved") {
      await t.rollback();
      throw new Error("Cannot reject an approved application");
    }

    if (mentor.approval_status === "rejected") {
      await t.rollback();
      throw new Error("Application already rejected");
    }

    // 5. Update mentor status with rejection reason
    // Note: Add 'rejection_reason' field to your Mentor model if not present
    await mentor.update({
      approval_status: "rejected",
      approved_by: adminId,
      approved_at: new Date(),
      // rejection_reason: rejection_reason // Uncomment if you add this field
    }, { transaction: t });

    // 6. Commit transaction before sending email
    await t.commit();

    // 7. Send rejection email (non-critical)
    if (mentor.mentorUser.email) {
      try {
        const html = `
          <h2>Mentor Application Update</h2>
          <p>Dear ${mentor.first_name} ${mentor.last_name},</p>
          <p>Thank you for your interest in becoming a mentor on our platform.</p>
          <p>After careful review, we regret to inform you that your application was not approved at this time.</p>
          <p><strong>Reason:</strong> ${rejection_reason}</p>
          <p>We encourage you to reapply in the future after addressing the feedback above.</p>
          <p>If you have any questions, please don't hesitate to contact our support team.</p>
          <p>Best regards,<br>The Team</p>
        `;

        await sendEmail({
          to: mentor.mentorUser.email,
          subject: "Mentor Application Update",
          html
        });
      } catch (emailError) {
        console.error("Failed to send rejection email:", emailError);
        // Don't throw - rejection succeeded even if email failed
      }
    }

    return mentor;

  } catch (error) {
    // Rollback if transaction not yet committed
    if (!t.finished) {
      await t.rollback();
    }
    throw error;
  }
};