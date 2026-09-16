const mongoose = require('mongoose');

const centerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    capacity: { type: Number, required: true },
    facilities: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Center', centerSchema);