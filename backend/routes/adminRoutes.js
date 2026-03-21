const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  registerAdmin,
  getDashboardStats,
  generateReport,
} = require('../controllers/adminController');
const { getSettings, updateSettings } = require('../controllers/settingsController');
const {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  markAllNotificationsAsRead,
} = require('../controllers/notificationController');

// Debug log to confirm imports
console.log('Imported notification functions in adminRoutes.js:', {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  markAllNotificationsAsRead,
});
console.log('Imported settings functions in adminRoutes.js:', {
  getSettings,
  updateSettings,
});

// Protect all routes
router.use(protect, admin);

// User management routes
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/register', registerAdmin);

// Dashboard stats
router.get('/dashboard/stats', getDashboardStats);

// Reports route
router.get('/reports/:type', (req, res, next) => {
  console.log(`Received request for /api/admin/reports/${req.params.type}`);
  next();
}, generateReport);

// Settings routes
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// Notification routes
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationAsRead);
router.delete('/notifications/:id', deleteNotification);
router.put('/notifications/read-all', markAllNotificationsAsRead);

module.exports = router;