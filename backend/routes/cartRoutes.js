const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const cartController = require('../controllers/cartController');

console.log('cartRoutes loaded'); // Verify the file is loaded

// Get user's cart
router.get('/', protect, (req, res) => {
  console.log('GET /api/cart requested by user:', req.user?.id || 'unknown');
  cartController.getCart(req, res);
});

// Add/Update item in cart
router.post('/add', protect, cartController.addToCart);

// Remove item from cart
router.delete('/remove/:itemId/:itemType', protect, cartController.removeFromCart);

module.exports = router;