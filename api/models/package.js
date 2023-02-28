const mongoose = require('mongoose');

const packageSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: { type: String, required: true },
    price: { type: Number, required: true },
    deleted: Boolean
});

module.exports = mongoose.model('Package', packageSchema);