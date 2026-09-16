const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid',
    },
  center: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Center',
    default: null
  },
  seatNumber: {
    type: String,
    default: null
  },
  attendanceStatus: {
    type: String,
    enum: ['not-marked', 'present', 'absent', 'ufm'],
    default: 'not-marked',
  },
  },
  { timestamps: true }
);

// Prevent duplicate applications to the same exam
applicationSchema.index({ exam: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);