const express = require('express');
const {
  enterMarks, publishResults, unpublishResults, getMyResults,
} = require('../controllers/resultController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/enter-marks', protect, authorize('faculty'), enterMarks);
router.post('/publish', protect, authorize('admin', 'superadmin'), publishResults);
router.post('/unpublish', protect, authorize('admin', 'superadmin'), unpublishResults);
router.get('/my', protect, authorize('student'), getMyResults);

module.exports = router;