const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', paymentController.createPayment);
router.get('/user', paymentController.getUserPayments);

// Admin routes
router.get('/all', protect, admin, paymentController.getAllPayments);
router.put('/:id', protect, admin, paymentController.updatePaymentStatus);
router.delete('/:id', protect, admin, paymentController.deletePayment);

module.exports = router; 