const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");

const category = require("../models/category");

//Add
exports.category_add = (req, res, next) => {
    const tokenRole = req.userData.role;
    if (tokenRole == "Restaurant") {
        const categ = new category({
            _id: new mongoose.Types.ObjectId(),

            type: req.body.type,
            deleted: false,
        });

        categ
            .save()
            .then((result) => {
                console.log(result);
                res.status(201).json({
                    message: "Category created!",
                    createdCategory: result,
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
exports.category_get = (req, res, next) => {
    const tokenRole = req.userData.role;
    const filter = { deleted: false };


    if (tokenRole == "Restaurant") {
        category.find(filter)
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
exports.category_edit = (req, res, next) => {
    const id = req.params.categoryId;
    const tokenRole = req.userData.role;

    if (tokenRole == "Restaurant") {
        category.updateOne({ _id: id }, {
                $set: {
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

exports.category_delete = (req, res, next) => {
    const id = req.params.categoryId;
    const tokenRole = req.userData.role;

    if (tokenRole == "Restaurant") {
        category.updateOne({ _id: id }, {
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