const express = require('express');
const {
  getAllAdmins, createAdmin, deactivateAdmin, getAuditLogs,
} = require('../controllers/superAdminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/admins', protect, authorize('superadmin'), getAllAdmins);
router.post('/admins', protect, authorize('superadmin'), createAdmin);
router.put('/admins/:id/deactivate', protect, authorize('superadmin'), deactivateAdmin);
router.get('/audit-logs', protect, authorize('superadmin'), getAuditLogs);

module.exports = router;