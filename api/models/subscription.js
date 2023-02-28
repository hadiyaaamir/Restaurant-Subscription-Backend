const mongoose = require('mongoose');

const subscriptionSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'Type', required: true },
    address: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);