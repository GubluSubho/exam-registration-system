const express = require('express');
const { getDashboardStats } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/dashboard', protect, authorize('admin', 'superadmin'), getDashboardStats);

module.exports = router;