const mongoose = require('mongoose');

const discountSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    percent: Number,
    deleted: Boolean
});

module.exports = mongoose.model('Discount', discountSchema);