const mongoose = require('mongoose');

const typeSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: { type: String, required: true },
    price: { type: Number, required: true },
    days: { type: Number, required: true },
    deleted: Boolean
});

module.exports = mongoose.model('Type', typeSchema);