const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// User routes
router.post('/', createOrder);
router.get('/my-orders', getUserOrders);

module.exports = router;