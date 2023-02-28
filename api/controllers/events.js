const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Events = require("../models/events");

//Get Events
exports.events_get = (req, res, next) => {
    filter = { deleted: false };


    Events.find(filter)
        .select()
        .exec()
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};



//Event Details
exports.get_details = (req, res, next) => {

    const id = req.params.eventId;

    Events.findById(id)
        .exec()
        .then(doc => {
            // console.log(doc);
            if (doc) { //id found
                
                    res.status(200).json(doc);
               

            } else {
                res.status(404).json({ message: "invalid id" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });

};

