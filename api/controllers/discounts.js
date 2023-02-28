const mongoose = require('mongoose');

const Discount = require('../models/discount');


//Add
exports.add_discount = (req, res, next) => {

    const tokenRole = req.userData.role;

    if (tokenRole == "Restaurant") {
        const discount = new Discount({
            _id: new mongoose.Types.ObjectId(),
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            percent: req.body.percent,
            deleted: false
        });

        discount.save()
            .then(result => {
                res.status(201).json({ message: 'Discount created!', result })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: err });
            });
    } else {
        res.status(403).json({ message: "Unauthorised access" });
    }
}


//Get
exports.get_discount = (req, res, next) => {

    //allow getting 1 package by id or name
    filter = { deleted: false };

    if (req.query.id) {
        filter = {...filter, _id: req.query.id };
    }

    if (req.query.start) {
        filter = {...filter, startDate: req.query.start.split(',') };
    }

    if (req.query.percent) {
        filter = {...filter, percent: req.query.percent };
    }

    Discount.find(filter)
        .select('_id startDate endDate percent')
        .exec()
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}


//Edit
exports.edit_discount = (req, res, next) => {

    const id = req.params.discountId;
    const tokenRole = req.userData.role;

    if (tokenRole == "Restaurant") {
        Discount.updateOne({ _id: id }, {
                $set: {
                    startDate: req.body.newStart,
                    endDate: req.body.newEnd,
                    percent: req.body.newPercent
                }
            })
            .exec()
            .then(result => {
                console.log(result);
                res.status(200).json(result);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: err });
            });
    } else {
        res.status(403).json({ message: "Unauthorised access" });
    }

}


//Delete
exports.delete_discount = (req, res, next) => {
    const id = req.params.discountId;
    const tokenRole = req.userData.role;

    if (tokenRole == "Restaurant") {
        Discount.updateOne({ _id: id }, { $set: { deleted: true } })
            .exec()
            .then(result => {
                console.log(result);
                res.status(200).json(result);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: err });
            });
    } else {
        res.status(403).json({ message: "Unauthorised access" });
    }
}