const express = require('express');
const {
  assignDuty, getMyDuties, getStudentsForAttendance, markAttendance,
} = require('../controllers/dutyController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('admin', 'superadmin'), assignDuty);
router.get('/my', protect, authorize('faculty'), getMyDuties);
router.get('/attendance-list', protect, authorize('faculty'), getStudentsForAttendance);
router.post('/mark-attendance', protect, authorize('faculty'), markAttendance);

module.exports = router;