const mongoose = require('mongoose');

const Payment = require('../models/payment');
const User = require('../models/user');


//Add Payment Details
exports.add_payment = (req, res, next) => {

    const tokenId = req.userData.userId;
    const tokenRole = req.userData.role;

    User.findOne({ _id: tokenId, deleted: false })
        .exec()
        .then(user => {
            if (user) {
                if ((tokenRole == "User" && !user.company) || //non company user
                    (tokenRole == "Company")) { //or company

                    const payment = new Payment({
                        _id: new mongoose.Types.ObjectId(),
                        userId: tokenId,
                        cardNumber: req.body.cardNumber,
                        expiry: req.body.expiry,
                        deleted: false
                    });

                    payment.save()
                        .then(result => {
                            res.status(201).json({ message: 'Payment created!', result })
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({ error: err });
                        });
                } else {
                    res.status(403).json({ message: "Unauthorised access" });
                }
            } else {
                res.status(404).json({ message: 'Invalid User ID' });
            }
        })
        .catch(err => { res.status(500).json({ error: err }) });

}


//Get all payments details for one user
exports.get_all_payments = (req, res, next) => {

    const tokenId = req.userData.userId;

    Payment.find({ userId: tokenId, deleted: false })
        .select("_id cardNumber expiry")
        .exec()
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });


}


//get payment details by payment id
exports.get_payment = (req, res, next) => {

    const tokenId = req.userData.userId;

    Payment.findOne({ _id: req.params.paymentId, deleted: false })
        .select("_id userId cardNumber expiry")
        .populate('userId', '_id firstname lastname email')
        .exec()
        .then(doc => {
            if (doc) {

                //see if doc.userId is logged in user
                if (doc.userId._id == tokenId) {
                    res.status(200).json(doc);
                } else {
                    res.status(403).json({ message: "Unauthorised access" });
                }

            } else {
                res.status(404).json({ message: 'Payment details not found' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });


}


//delete payment details
exports.delete_payment = (req, res, next) => {

    const id = req.params.paymentId;
    const tokenId = req.userData.userId;

    Payment.findById(id)
        .exec()
        .then(doc => {
            if (doc && doc.userId == tokenId) {

                Payment.updateOne({ _id: id }, { $set: { deleted: true } })
                    .exec()
                    .then(result => {
                        console.log(result);
                        res.status(200).json(result);
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({ error: err });
                    });

            } else if (doc.userId == tokenId) {
                res.status(403).json({ message: 'Unauthorised access' });
            } else {
                res.status(404).json({ message: 'Payment details not found' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });

}