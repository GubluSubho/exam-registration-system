const mongoose = require('mongoose');

const dutySchema = new mongoose.Schema(
  {
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    center: { type: mongoose.Schema.Types.ObjectId, ref: 'Center', required: true },
    date: { type: Date, required: true },
    roomNumber: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Duty', dutySchema);