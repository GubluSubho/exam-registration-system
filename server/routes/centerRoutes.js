const express = require('express');
const { createCenter, getAllCenters, deleteCenter } = require('../controllers/centerController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getAllCenters);
router.post('/', protect, authorize('admin', 'superadmin'), createCenter);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteCenter);

module.exports = router;