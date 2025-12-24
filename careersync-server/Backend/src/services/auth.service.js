const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { User } = require("../models");
const sendEmail = require("../utils/sendEmail");
const { Op } = require("sequelize");

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRES = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || "15m";
const REFRESH_EXPIRES = process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || "7d";
const APP_URL = process.env.APP_URL || `http://localhost:${process.env.PORT || 3000}`;

function generateToken(payload, secret, expiresIn) {
  return jwt.sign(payload, secret, { expiresIn });
}

async function registerUser(data, file) {
  // ✅ FIX: Destructure 'role_name' instead of 'role' to match Controller & DB
  let { email, password, role_name, firstname, lastname, phone, gender, currentstatus, dob, institution, profileImage } = data;

  console.log("👉 Registering User:", email); // Debug Log

  if (!email || !password) throw new Error("email and password are required");

  const exist = await User.findOne({ where: { email } });
  if (exist) throw new Error("Email already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const verifyToken = crypto.randomBytes(32).toString("hex");
  const verifyTokenExp = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // ✅ FIX: Use 'role_name' to match your User Model
  const user = await User.create({
    email,
    password: hashedPassword,
    role_name: role_name || "acc_user", // Default to acc_user
    firstname,
    lastname,
    phone,
    gender,
    currentstatus,
    dob: dob || null,
    institution,
    profileImage: file ? file.filename : profileImage,
    verifyToken,
    verifyTokenExp,
    emailVerified: false // We will ignore this in login for now
  });

  return user;
}

async function loginUser(email, password) {
  console.log(`🔎 Attempting login for: ${email}`);

  if (!email || !password) throw new Error("Email and password required");

  // 1. Check if user exists
  const user = await User.findOne({ where: { email } });
  if (!user) {
    console.log("❌ User NOT found in database.");
    throw new Error("Invalid email or password");
  }
  console.log("✅ User found:", user.id);

  // 2. Check Password
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    console.log("❌ Password did NOT match.");
    throw new Error("Invalid email or password");
  }
  console.log("✅ Password matched!");

  // 3. Bypass Email Verification (For Development)
  // if (!user.emailVerified) throw new Error("Please verify your email before login");

  // 4. Generate Tokens
  const accessToken = generateToken({ id: user.id, role_name: user.role_name }, JWT_ACCESS_SECRET, ACCESS_EXPIRES);
  const refreshToken = generateToken({ id: user.id }, JWT_REFRESH_SECRET, REFRESH_EXPIRES);

  await user.update({ refreshToken });

  console.log("🚀 Login Successful! Tokens generated.");
  return { user, accessToken, refreshToken };
}

// ... Keep the rest of the file (verifyEmailToken, refreshToken, logoutUser, etc.) exactly as is ...
// Just ensure you include the exports at the bottom!

async function verifyEmailToken(token) {
  const user = await User.findOne({ where: { verifyToken: token, verifyTokenExp: { [Op.gt]: new Date() } } });
  if (!user) throw new Error("Invalid or expired token");
  await user.update({ emailVerified: true, verifyToken: null, verifyTokenExp: null });
  return user;
}

async function refreshToken(token) {
  if (!token) throw new Error("No refresh token");
  const user = await User.findOne({ where: { refreshToken: token } });
  if (!user) throw new Error("Invalid refresh token");
  jwt.verify(token, JWT_REFRESH_SECRET, (err) => { if (err) throw new Error("Token expired"); });
  return generateToken({ id: user.id, role_name: user.role_name }, JWT_ACCESS_SECRET, ACCESS_EXPIRES);
}

async function logoutUser(token) {
  if (!token) return null;
  const user = await User.findOne({ where: { refreshToken: token } });
  if (!user) return null;
  await user.update({ refreshToken: null });
  return user;
}

async function resetPasswordRequest(email) {
  const user = await User.findOne({ where: { email } });
  if (!user) return;
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetExp = new Date(Date.now() + 60 * 60 * 1000);
  await user.update({ resetToken, resetTokenExp: resetExp });
}

async function resetPassword(token, password) {
  const user = await User.findOne({ where: { resetToken: token } });
  if (!user) throw new Error("Invalid token");
  const hashed = await bcrypt.hash(password, 10);
  await user.update({ password: hashed, resetToken: null, resetTokenExp: null });
}

module.exports = {
  registerUser,
  verifyEmailToken,
  loginUser,
  refreshToken,
  logoutUser,
  resetPasswordRequest,
  resetPassword
};