const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  getInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
  updateQuantity,
  getInventoryByCategory,
  getInventoryQuantity
} = require('../controllers/inventoryController');
const { protect, admin } = require('../middleware/authMiddleware');
const path = require('path');
const fs = require('fs');

// Public routes
router.get('/', getInventory);
router.get('/:id', getInventoryById);
router.get('/category/:category', getInventoryByCategory);
router.get('/quantity/:id', getInventoryQuantity);

// Protected routes (admin only)
router.post('/', protect, admin, upload.array('images', 5), createInventory);
router.put('/:id', protect, admin, upload.array('images', 5), updateInventory);
router.delete('/:id', protect, admin, deleteInventory);
router.patch('/:id/quantity', protect, admin, updateQuantity);

// Add a route to check if an image exists
router.get('/check-image/:filename', (req, res) => {
  const imagePath = path.join(__dirname, '..', 'uploads', 'inventory', req.params.filename);
  if (fs.existsSync(imagePath)) {
    res.json({ exists: true });
  } else {
    res.json({ exists: false });
  }
});

module.exports = router;