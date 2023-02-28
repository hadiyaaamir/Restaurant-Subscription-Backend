const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cardNumber: String,
    expiry: { type: String, match: /[0-9]{2}\/[0-9]{4}/ },
    deleted: Boolean
});

module.exports = mongoose.model('Payment', paymentSchema);