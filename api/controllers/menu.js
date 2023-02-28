const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");

const menu = require("../models/menu");

//Add
exports.menu_add = (req, res, next) => {
    const tokenRole = req.userData.role;
    if (tokenRole == "Restaurant") {
        const Menu = new menu({
            _id: new mongoose.Types.ObjectId(),
            foodItem: req.body.foodItem,
            date: req.body.date,
            deleted: false,
            package: req.body.package
        });

        Menu
            .save()
            .then((result) => {
                console.log(result);
                res.status(201).json({
                    message: "Menu Item created!",
                    createdMenuItem: result,
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
exports.menu_get = (req, res, next) => {

    filter = { deleted: false };

    if (req.query.date) {
        filter = {...filter, date: req.query.date.split(',') };
    }
    if (req.query.package) {
        filter = {...filter, package: req.query.package };
    }

    menu.find(filter).populate("package").populate("foodItem")
        .exec()
        .then((docs) => {
            res.status(200).json(docs);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });

};

//EDIT
exports.menu_edit = (req, res, next) => {
    const id = req.params.menuId;
    const tokenRole = req.userData.role;

    if (tokenRole == "Restaurant") {
        menu.updateOne({ _id: id }, {
                $set: {
                    foodItem: req.body.newItem,
                    date: req.body.newdate
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

exports.menu_delete = (req, res, next) => {
    const id = req.params.menuId;
    const tokenRole = req.userData.role;

    if (tokenRole == "Restaurant") {
        menu.updateOne({ _id: id }, {
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