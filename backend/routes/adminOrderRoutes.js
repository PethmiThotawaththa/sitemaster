const express = require('express');
const router = express.Router();
const {
  updateOrderStatus,
  getAllOrders,
  deleteOrder
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(admin);

// Admin routes
router.put('/:id/status', updateOrderStatus);
router.get('/', getAllOrders);
router.delete('/:id', deleteOrder); // Added DELETE route

module.exports = router;