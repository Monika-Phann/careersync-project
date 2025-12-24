// src/services/userService.js
const bcrypt = require("bcrypt");
const { User, Booking, Certificate } = require("../models");

// PROFILE
exports.getProfile = async (userId) => {
  return User.findByPk(userId, {
    attributes: { exclude: ["password", "refreshToken"] }
  });
};

exports.updateProfile = async (userId, data, file) => {
  const updateData = {
    firstname: data.firstname,
    lastname: data.lastname,
    phone: data.phone,
    institution: data.institution,
    gender: data.gender,
    currentstatus: data.currentstatus,
    dob: data.dob
  };

  if (file) updateData.profileImage = file.filename;

  await User.update(updateData, { where: { id: userId } });
};

// SECURITY
exports.changePassword = async (userId, { oldPassword, newPassword }) => {
  const user = await User.findByPk(userId);

  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) throw new Error("Old password is incorrect");

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();
};

// BOOKINGS
exports.getBookings = async (userId) => {
  return Booking.findAll({
    where: { user_id: userId },
    order: [["createdAt", "DESC"]]
  });
};

// CERTIFICATES
exports.getCertificates = async (userId) => {
  return Certificate.findAll({
    where: { user_id: userId }
  });
};
