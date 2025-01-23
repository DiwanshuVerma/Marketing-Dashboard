const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  status: { type: String, enum: ['Active', 'Upcoming', 'Inactive'], default: 'Inactive' },
  photo: { type: String },
  pages: {type: String},
  startDate: { type: Date },
  endDate: { type: Date },
});

module.exports = mongoose.model('Banner', bannerSchema);
