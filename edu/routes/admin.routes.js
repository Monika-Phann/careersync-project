const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

// Dashboard & Stats
router.get('/dashboard', adminController.getFullDashboard);
router.get('/mentors/stats', adminController.getMentorStats); // 👈 Missing in your running server?

// Mentor Review
router.get('/mentors/pending', adminController.listPendingMentors); // 👈 Missing in your running server?
router.patch('/mentors/:mentorId/review', adminController.reviewMentor);

// User Management
router.get('/users', adminController.getAllUsers); // 👈 Missing in your running server?
router.post('/create-user', adminController.createRole);

module.exports = router;