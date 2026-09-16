const express = require('express');
const { body, param } = require('express-validator');
const {
  applyToExam, getMyApplications, createPaymentOrder, verifyPayment,
  downloadHallTicket, approveApplication, allocateSeats,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/',
  protect, authorize('student'),
  [body('examId').isMongoId().withMessage('Valid examId is required')],
  validate,
  applyToExam
);
router.get('/my', protect, authorize('student'), getMyApplications);
router.post(
  '/create-payment',
  protect, authorize('student'),
  [body('applicationId').isMongoId().withMessage('Valid applicationId is required')],
  validate,
  createPaymentOrder
);
router.post('/verify-payment', protect, authorize('student'), verifyPayment);
router.get(
  '/:id/hall-ticket',
  protect, authorize('student'),
  [param('id').isMongoId().withMessage('Invalid application id')],
  validate,
  downloadHallTicket
);
router.put(
  '/:id/status',
  protect, authorize('admin', 'superadmin'),
  [
    param('id').isMongoId().withMessage('Invalid application id'),
    body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
  ],
  validate,
  approveApplication
);
router.post(
  '/allocate-seats',
  protect, authorize('admin', 'superadmin'),
  [body('examId').isMongoId().withMessage('Valid examId is required')],
  validate,
  allocateSeats
);

module.exports = router;