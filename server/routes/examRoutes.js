const express = require('express');
const { body } = require('express-validator');
const {
  createExam, getAllExams, getExamById, updateExam, deleteExam,
} = require('../controllers/examController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

const examValidationRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('examDate').isISO8601().withMessage('Valid exam date is required'),
  body('applicationStartDate').isISO8601().withMessage('Valid application start date is required'),
  body('applicationEndDate').isISO8601().withMessage('Valid application end date is required'),
  body('fee').isFloat({ min: 0 }).withMessage('Fee must be a positive number'),
];

router.get('/', protect, getAllExams);
router.get('/:id', protect, getExamById);
router.post('/', protect, authorize('admin', 'superadmin'), examValidationRules, validate, createExam);
router.put('/:id', protect, authorize('admin', 'superadmin'), examValidationRules, validate, updateExam);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteExam);

module.exports = router;