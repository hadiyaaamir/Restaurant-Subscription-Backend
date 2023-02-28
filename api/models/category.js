const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    type: { type: String, required: true },
    deleted : Boolean

});

module.exports = mongoose.model('Category', categorySchema);