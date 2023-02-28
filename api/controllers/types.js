const mongoose = require('mongoose');

const Type = require('../models/type');


//Add
exports.add_type = (req, res, next) => {

    const tokenRole = req.userData.role;

    if (tokenRole == "Restaurant") {
        const type = new Type({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            price: req.body.price,
            days: req.body.days,
            deleted: false
        });

        type.save()
            .then(result => {
                res.status(201).json({ message: 'Type created!', result })
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
exports.get_type = (req, res, next) => {

    //allow getting 1 package by id or name
    filter = { deleted: false };

    if (req.query.id) {
        filter = {...filter, _id: req.query.id };
    }

    if (req.query.typeName) {
        filter = {...filter, name: req.query.typeName };
    }


    Type.find(filter)
        .select('_id name price days')
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
exports.edit_type = (req, res, next) => {

    const id = req.params.typeId;
    const tokenRole = req.userData.role;

    if (tokenRole == "Restaurant") {
        Type.updateOne({ _id: id }, { $set: { name: req.body.newName, price: req.body.newPrice, days: req.body.newDays } })
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
exports.delete_type = (req, res, next) => {
    const id = req.params.typeId;
    const tokenRole = req.userData.role;

    if (tokenRole == "Restaurant") {
        Type.updateOne({ _id: id }, { $set: { deleted: true } })
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