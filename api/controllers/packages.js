const mongoose = require('mongoose');

const Package = require('../models/package');


//Add
exports.add_package = (req, res, next) => {

    const tokenRole = req.userData.role;

    if (tokenRole == "Restaurant") {
        const package = new Package({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            price: req.body.price,
            deleted: false
        });

        package.save()
            .then(result => {
                res.status(201).json({ message: 'Package created!', result })
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
exports.get_package = (req, res, next) => {

    //allow getting 1 package by id or name
    filter = { deleted: false };

    if (req.query.id) {
        filter = {...filter, _id: req.query.id };
    }

    if (req.query.packageName) {
        filter = {...filter, name: req.query.packageName };
    }


    Package.find(filter)
        .select('_id name price')
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
exports.edit_package = (req, res, next) => {

    const id = req.params.packageId;
    const tokenRole = req.userData.role;

    if (tokenRole == "Restaurant") {
        Package.updateOne({ _id: id }, { $set: { name: req.body.newName, price: req.body.newPrice } })
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
exports.delete_package = (req, res, next) => {
    const id = req.params.packageId;
    const tokenRole = req.userData.role;

    if (tokenRole == "Restaurant") {
        Package.updateOne({ _id: id }, { $set: { deleted: true } })
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