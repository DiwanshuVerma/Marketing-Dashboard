const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
    name: { type: String},
    discount: {  type: String },
    type: {type: String},
    status: {type: String, enum: ["Active", "Upcoming", "Expired"]},
    startDate: { type: Date },
    endDate: { type: Date },
})


// Automatically calculate status before saving
OfferSchema.pre("save", function (next) {
    const nowUTC = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000); // Convert to UTC
  
    if (nowUTC < this.startDate) {
      this.status = "Upcoming";
    } else if (nowUTC > this.endDate) {
      this.status = "Expired";
    } else {
      this.status = "Active";
    }
    next();
  });
  
  // Update status before updating
  OfferSchema.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate();
    if (update.startDate || update.endDate) {
      const nowUTC = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000);
      const start = new Date(update.startDate);
      const end = new Date(update.endDate);
  
      if (nowUTC < start) {
        update.status = "Upcoming";
      } else if (nowUTC > end) {
        update.status = "Expired";
      } else {
        update.status = "Active";
      }
    }
    next();
  });


module.exports = mongoose.model('Offer', OfferSchema)