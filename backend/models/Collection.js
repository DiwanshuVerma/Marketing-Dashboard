const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    status: { type: String, enum: ['Active', 'Upcoming', 'Inactive'], default: 'Inactive' },
    requestStatus: {type: String},
    photoWeb: { type: String },
    photoApp: { type: String },

    restaurants: [{ type: String }],

    cities: [{ type: String }],
    startDate: { type: Date },
    endDate: { type: Date },

    clicks: [{
        date: { type: Date, default: Date.now }
    }]
});

collectionSchema.set('optimisticConcurrency', false);

module.exports = mongoose.model('Collection', collectionSchema);
