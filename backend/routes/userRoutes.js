const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  updateUserStatus,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Admin routes
router.get('/', protect, admin, getUsers);
router.put('/:id/status', protect, admin, updateUserStatus);

module.exports = router; 