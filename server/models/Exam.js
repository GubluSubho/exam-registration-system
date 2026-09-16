const mongoose = require('mongoose');

const examSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    subject: { type: String, required: true },
    examDate: { type: Date, required: true },
    applicationStartDate: { type: Date, required: true },
    applicationEndDate: { type: Date, required: true },
    fee: { type: Number, required: true, default: 0 },
    eligibility: {
      minAttendance: { type: Number, default: 0 },
      maxBacklogs: { type: Number, default: 99 },
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'closed'],
      default: 'draft',
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Exam', examSchema);