const authService = require("../services/auth.service");

exports.register = async (req, res) => {
  try {
    // ✅ FIX: The valid role in your database is 'acc_user', NOT 'mentee'.
    if (!req.body.role_name) {
      req.body.role_name = 'acc_user';
    }

    await authService.registerUser(req.body, req.file);
    res.status(201).json({ message: "User registered successfully. Please check your email to verify your account." });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    await authService.verifyEmailToken(req.params.token);
    res.send('<h3 style="text-align: center">Email verified successfully!</h3>');
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await authService.loginUser(req.body.email, req.body.password);
    
    res.cookie("refreshToken", refreshToken, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict", 
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });
    
    res.json({ message: "Logged in", accessToken, user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.refresh = async (req, res) => {
  try {
    const accessToken = await authService.refreshToken(req.cookies.refreshToken);
    res.json({ accessToken });
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    await authService.logoutUser(req.cookies.refreshToken);
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resetRequest = async (req, res) => {
  try {
    await authService.resetPasswordRequest(req.body.email);
    res.json({ message: "If an account exists, a reset email was sent" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    await authService.resetPassword(req.params.token, req.body.password);
    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};