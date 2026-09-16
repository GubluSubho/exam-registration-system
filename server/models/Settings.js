const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    institutionName: { type: String, default: 'My Institution' },
    institutionLogoUrl: { type: String, default: '' },
    supportEmail: { type: String, default: '' },
    lateFeeAmount: { type: Number, default: 0 },
    reEvaluationFee: { type: Number, default: 0 },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Enforce a single settings document
settingsSchema.statics.getSingleton = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);