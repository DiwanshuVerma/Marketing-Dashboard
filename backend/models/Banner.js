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
  const now = new Date(); // Current time in UTC

  if (now < this.startDate) {
    this.status = "Upcoming";
  } else if (now > this.endDate) {
    this.status = "Inactive";
  } else {
    this.status = "Active";
  }
  next();
});

// Pre-findOneAndUpdate hook: recalc status if both dates are updated
bannerSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  // Only recalc status if both startDate and endDate are present in the update.
  if (update.startDate && update.endDate) {
    const now = new Date();
    const start = new Date(update.startDate);
    const end = new Date(update.endDate);
    if (now < start) {
      update.status = "Upcoming";
    } else if (now > end) {
      update.status = "Inactive";
    } else {
      update.status = "Active";
    }
  }
  next();
});

module.exports = mongoose.model('Banner', bannerSchema);
