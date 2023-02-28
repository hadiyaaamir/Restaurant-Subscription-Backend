const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    deleted: false,
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    event_date:{
        type: Date,
        required : true 
    },
    location :{
        type: String,
        reequired: true
    },
    type :{
        type: String,
        required: true
    }, 
    audience: {
        type: String,
        required: true
    }
    
});

module.exports = mongoose.model('Event', eventSchema);