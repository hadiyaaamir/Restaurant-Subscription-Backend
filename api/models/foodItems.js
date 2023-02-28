const mongoose = require('mongoose');

const foodItemSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String, required: true },
    name: { type: String, required: true },
    deleted : Boolean

});

module.exports = mongoose.model('FoodItems', foodItemSchema);