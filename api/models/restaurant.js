const mongoose = require('mongoose');

const restaurantSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: String,
    

    foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItems', required: true },
    date: { type: Date, required: true },
    deleted : Boolean

});

module.exports = mongoose.model('Restaurant', restaurantSchema);