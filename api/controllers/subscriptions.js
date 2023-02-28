const mongoose = require('mongoose');

const Subscription = require('../models/subscription');
const User = require('../models/user');


//Add 
exports.add_subscription = (req, res, next) => {

    const tokenId = req.userData.userId;
    const tokenRole = req.userData.role;

    User.findById(req.body.user)
        .exec()
        .then(doc => {
            if (doc) {

                if ((tokenRole == "User" && tokenId == req.body.user) ||
                    (tokenRole == "Company" && doc.company && doc.company == tokenId)) {


                    //create subscription object. Enter company if user belongs to one.
                    sub = {
                        _id: new mongoose.Types.ObjectId(),
                        user: req.body.user,
                        package: req.body.package,
                        type: req.body.type,
                        address: req.body.address,
                        startDate: req.body.startDate,
                        endDate: req.body.endDate
                    };

                    if (doc.company) {
                        sub = {...sub, company: doc.company };
                    }

                    //add
                    const subscription = new Subscription(sub);

                    subscription.save()
                        .then(result => {
                            res.status(201).json({ message: 'Subscription created!', result });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({ error: err });
                        });

                } else {
                    res.status(403).json({ message: "Unauthorised access" });
                }

            } else {
                res.status(404).json({ message: 'User not found' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });

}


//Get
exports.get_subscription = (req, res, next) => {

    const tokenRole = req.userData.role;
    const tokenId = req.userData.userId;

    //filters
    filter = {};

    if (req.query.packages) {
        filter = {...filter, package: req.query.packages.split(',') };
    }
    if (req.query.types) {
        filter = {...filter, type: req.query.types };
    }

    if (req.query.userId) {
        filter = {...filter, user: req.query.userId };
    }
    if (req.query.companyId) {
        filter = {...filter, company: req.query.companyId };
    }

    if (req.query.start) {
        filter = {...filter, startDate: req.query.start };
    }
    if (req.query.end) {
        filter = {...filter, endDate: req.query.end };
    }

    if (req.query.id) {
        filter = {...filter, _id: req.query.id };
    }


    //check user
    if ((tokenRole == "Company" && req.query.companyId && req.query.companyId == tokenId) ||
        (tokenRole == "User" && req.query.userId && req.query.userId == tokenId) ||
        (tokenRole == "Restaurant")) {

        //get 
        Subscription.find(filter)
            .populate('user', '_id firstname lastname email')
            .populate('package', '_id name price')
            .populate('type', '_id name price')
            .exec()
            .then(docs => {
                res.status(200).json(docs);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: err });
            });

    } else {
        res.status(403).json({ message: "Unauthorised access" });
    }
}