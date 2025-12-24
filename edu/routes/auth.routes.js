const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
// ✅ Import the upload middleware from your controller
const { upload } = require('../controllers/admin.controller'); 

// Safety Check
if (!authController.login) {
    console.error("❌ CRITICAL: Auth Controller not loaded properly.");
}

// Public Routes
router.post('/login', authController.login);
router.post('/register', authController.register);

// ✅ FIXED: Add upload.single('profilePicture') middleware here.
// This allows Multer to parse the FormData and populate req.body.
router.post('/register-mentor', upload.single('profilePicture'), authController.registerMentor);

module.exports = router;