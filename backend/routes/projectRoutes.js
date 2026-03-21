const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  calculateExpenseInterest,
} = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getProjects);
router.get('/:id', getProjectById);

// Protected routes (admin only)
router.post('/', protect, admin, upload.array('attachments', 5), createProject);
router.put('/:id', protect, admin, upload.array('attachments', 5), updateProject);
router.delete('/:id', protect, admin, deleteProject);
router.post('/:id/calculate-expense-interest', protect, admin, calculateExpenseInterest);

module.exports = router;