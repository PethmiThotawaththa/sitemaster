const express = require('express');
const router = express.Router();
const { getFinancialData } = require('../controllers/financialController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, getFinancialData);

module.exports = router;