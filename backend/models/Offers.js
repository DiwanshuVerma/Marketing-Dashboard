const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
    id: { type: Number },
    name: { type: String},
    discount: {  type: String },
    type: {type: String},
    status: {type: String, enum: ["Active", "Upcoming", "Expired"]},
    startDate: { type: Date },
    endDate: { type: Date },
})

module.exports = mongoose.model('Offer', OfferSchema)