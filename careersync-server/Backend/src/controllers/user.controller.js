// src/controllers/userController.js
const userService = require("../services/user.service");

exports.getProfile = async (req, res) => {
  const user = await userService.getProfile(req.user.id);
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  await userService.updateProfile(req.user.id, req.body, req.file);
  res.json({ message: "Profile updated successfully" });
};

exports.changePassword = async (req, res) => {
  await userService.changePassword(req.user.id, req.body);
  res.json({ message: "Password changed successfully" });
};

exports.bookingHistory = async (req, res) => {
  const data = await userService.getBookings(req.user.id);
  res.json(data);
};

exports.certificateList = async (req, res) => {
  const data = await userService.getCertificates(req.user.id);
  res.json(data);
};
