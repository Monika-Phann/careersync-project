const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Safety Check
if (!authController.login) {
    console.error("❌ CRITICAL: Auth Controller not loaded properly.");
}

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/register-mentor', authController.registerMentor);

module.exports = router;