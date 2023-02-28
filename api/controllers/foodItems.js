const mongoose = require("mongoose");
//const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const FoodItems = require("../models/foodItems");

//Add
exports.fooditem_add = (req, res, next) => {
    const tokenRole = req.userData.role;
    if (tokenRole == "Restaurant") {
        const fooditem = new FoodItems({
            _id: new mongoose.Types.ObjectId(),
            type: req.body.type,
            name: req.body.name,
            description: req.body.description,
            deleted: false,
        });

        fooditem
            .save()
            .then((result) => {
                console.log(result);
                res.status(201).json({
                    message: "Food Item created!",
                    createdFoodItem: result,
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({ error: err });
            });
    } else {
        res.status(403).json({ message: "Unauthorised access" });
    }
};

//GET
exports.fooditem_get = (req, res, next) => {
    const tokenRole = req.userData.role;
    const filter = { deleted: false };

    if (req.query.categories) {
        filter = {...filter, role: req.query.categories.split(',') };
    }


    if (tokenRole == "Restaurant") {
        FoodItems.find(filter)
            .populate('type', '_id type')
            .exec()
            .then((docs) => {
                res.status(200).json(docs);
            })
            .catch((err) => {
                res.status(500).json({ error: err });
            });
    } else {
        res.status(403).json({ message: "Unauthorised access" });
    }
};

//EDIT
exports.fooditem_edit = (req, res, next) => {
    const id = req.params.itemId;
    const tokenRole = req.userData.role;

    if (tokenRole == "Restaurant") {
        FoodItems.updateOne({ _id: id }, {
                $set: {
                    name: req.body.newName,
                    description: req.body.newDesc,
                    type: req.body.newType,
                },
            })
            .exec()
            .then((result) => {
                console.log(result);
                res.status(200).json(result);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({ error: err });
            });
    } else {
        res.status(403).json({ message: "Unauthorised access" });
    }
};

//DELETE

exports.fooditem_delete = (req, res, next) => {
    const id = req.params.itemId;
    const tokenRole = req.userData.role;

    if (tokenRole == "Restaurant") {
        FoodItems.updateOne({ _id: id }, {
                $set: {
                    deleted: true
                },
            })
            .exec()
            .then((result) => {
                console.log(result);
                res.status(200).json(result);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({ error: err });
            });
    } else {
        res.status(403).json({ message: "Unauthorised access" });
    }
};