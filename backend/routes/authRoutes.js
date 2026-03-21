const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
} = require('../controllers/userController');
const { registerAdmin } = require('../controllers/adminController');
const { forgotPassword, resetPassword } = require('../controllers/authController'); // Import the new functions
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword); // Add forgot password route
router.post('/reset-password/:token', resetPassword); // Add reset password route

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Admin routes
router.post('/admin/register', protect, admin, registerAdmin);

module.exports = router;