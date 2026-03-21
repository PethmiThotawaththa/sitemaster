const Payment = require('../models/Payment');
const Cart = require('../models/Cart');
const multer = require('multer');
const path = require('path');

// Configure multer for payment slip uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/payments');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
}).single('paymentSlip');

const paymentController = {
  // Create payment
  createPayment: async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart || cart.items.length === 0) {
          return res.status(400).json({ message: 'Cart is empty' });
        }

        const payment = await Payment.create({
          user: req.user._id,
          cart: cart._id,
          amount: cart.totalAmount,
          paymentSlip: req.file.path,
          status: 'pending',
        });

        // Clear the cart after successful payment submission
        cart.items = [];
        cart.totalAmount = 0;
        await cart.save();

        res.status(201).json(payment);
      } catch (error) {
        console.error('Create payment error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
      }
    });
  },

  // Get all payments (admin)
  getAllPayments: async (req, res) => {
    try {
      console.log('Fetching all payments for user:', req.user._id, 'Role:', req.user.role);
      const payments = await Payment.find()
        .populate('user', 'name email')
        .populate({
          path: 'cart',
          populate: {
            path: 'items.item',
            select: 'name price budget',
          },
        })
        .sort({ createdAt: -1 });

      console.log('Payments found:', payments);
      res.json(Array.isArray(payments) ? payments : []);
    } catch (error) {
      console.error('Get all payments error:', error);
      res.status(500).json([]);
    }
  },

  // Get user payments
  getUserPayments: async (req, res) => {
    try {
      const payments = await Payment.find({ user: req.user._id })
        .populate({
          path: 'cart',
          populate: {
            path: 'items.item',
            select: 'name price budget',
          },
        })
        .sort({ createdAt: -1 });
      res.json(payments);
    } catch (error) {
      console.error('Get user payments error:', error);
      res.status(500).json({ message: error.message || 'Server error' });
    }
  },

  // Update payment status (admin)
  updatePaymentStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const payment = await Payment.findById(req.params.id);
      
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }

      payment.status = status;
      if (status === 'verified') {
        payment.verifiedAt = new Date();
        payment.verifiedBy = req.user._id;
      }

      await payment.save();
      res.json(payment);
    } catch (error) {
      console.error('Update payment status error:', error);
      res.status(500).json({ message: error.message || 'Server error' });
    }
  },

  // Delete payment (admin)
  deletePayment: async (req, res) => {
    try {
      const payment = await Payment.findById(req.params.id);
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
      await payment.deleteOne();
      res.json({ message: 'Payment deleted successfully' });
    } catch (error) {
      console.error('Delete payment error:', error);
      res.status(500).json({ message: error.message || 'Server error' });
    }
  },
};

module.exports = paymentController;