const express = require('express');
const {
  getMyNotifications, markAsRead, broadcastNotification,
} = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/my', protect, getMyNotifications);
router.put('/:id/read', protect, markAsRead);
router.post('/broadcast', protect, authorize('admin', 'superadmin'), broadcastNotification);

module.exports = router;