const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true }, // e.g. 'APPROVE_APPLICATION', 'CREATE_EXAM'
    targetType: { type: String }, // e.g. 'Application', 'Exam', 'User'
    targetId: { type: mongoose.Schema.Types.ObjectId },
    details: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);