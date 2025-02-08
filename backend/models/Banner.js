const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  status: { type: String, enum: ['Active', 'Upcoming', 'Inactive']},
  photoWeb: { type: String },
  photoApp: { type: String },
  pages: {type: String},
  startDate: { type: Date },
  endDate: { type: Date },
});

bannerSchema.pre("save", function (next) {
  const nowUTC = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000);

  if (nowUTC < this.startDate) {
    this.status = "Upcoming";
  } else if (nowUTC >= this.startDate && nowUTC <= this.endDate) {
    this.status = "Active";
  } else {
    this.status = "Inactive";
  }
  next();
});

module.exports = mongoose.model('Banner', bannerSchema);
