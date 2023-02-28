const mongoose = require('mongoose');

const menuSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItems', required: true },
    date: { type: Date, required: true },
    deleted : Boolean, 
    package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true }

});

module.exports = mongoose.model('Menu', menuSchema);