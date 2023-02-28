const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
    // menuItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }],
    address: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["Preparing", "Ready", "Dispatched", "Delivered"], required: true }
});

module.exports = mongoose.model('Order', orderSchema);