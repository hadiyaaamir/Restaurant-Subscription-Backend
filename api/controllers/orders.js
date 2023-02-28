const mongoose = require('mongoose');

const Order = require('../models/order');
const Subscription = require('../models/subscription');


//Add 
exports.add_orders = (req, res, next) => {

    const tokenRole = req.userData.role;
    const date = req.params.date;

    if (tokenRole == "Restaurant" || tokenRole == "Dispatcher") {

        //get subscriptions of that day
        Subscription.find()
            .where('startDate').lte(new Date(date))
            .where('endDate').gte(new Date(date))
            .exec()
            .then(subs => {

                var orders = [];

                //create order array
                subs.forEach(sub => {

                    var order = {
                        user: sub.user,
                        address: sub.address,
                        date: date,
                        status: "Preparing",
                        package: sub.package
                    }
                    if (sub.company) {
                        order = {...order, company: sub.company };
                    }

                    new_order = new Order(order);
                    orders.push(new_order);


                });
                // res.status(200).json(orders);

                //save order array
                Order.insertMany(orders)
                    .then(result => {
                        res.status(201).json({ message: 'Orders created!', orders: result })
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({ error: err });
                    });


            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: err });
            });
    } else {
        res.status(403).json({ message: "Unauthorised access" });
    }
}

exports.add_orders_user = (req, res, next) => {
    const tokenId = req.userData.userId;

    if (tokenId == req.body.user || tokenId == req.body.company) {




        var orders = [];
        for (var d = new Date(req.body.startdate); d <= new Date(req.body.enddate); d.setDate(d.getDate() + 1)) {
            var order = new Order({
                _id: new mongoose.Types.ObjectId(),
                user: req.body.user,
                company: req.body.company,
                address: req.body.address,
                date: new Date(d),
                status: "Preparing",
                package: req.body.package

            });
            orders.push(order);
        }
        // order.save()
        //     .then(result => {
        //         console.log(result);
        //         res.status(201).json({
        //             message: 'User created!',
        //             createdUser: result
        //         });
        //     })
        //     .catch(err => {
        //         console.log(err);
        //         res.status(500).json({ error: err });
        //     });

        Order.insertMany(orders)
            .then(result => {
                res.status(201).json({ message: 'Orders created!', orders: result })
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
exports.get_orders = (req, res, next) => {

    const tokenRole = req.userData.role;
    const tokenId = req.userData.userId;

    //filters
    filter = {};

    if (req.query.userId) {
        filter = {...filter, user: req.query.userId };
    }
    if (req.query.companyId) {
        filter = {...filter, company: req.query.companyId };
    }

    if (req.query.date) {
        filter = {...filter, date: req.query.date };
    }

    if (req.query.status) {
        filter = {...filter, status: req.query.status };
    }

    if (req.query.id) {
        filter = {...filter, _id: req.query.id };
    }


    //check user
    if ((tokenRole == "Company" && req.query.companyId && req.query.companyId == tokenId) ||
        (tokenRole == "User" && req.query.userId && req.query.userId == tokenId) ||
        (tokenRole == "Restaurant") || (tokenRole == "Dispatcher")) {

        //get 
        Order.find(filter)
            .populate('user', '_id firstname lastname email address')
            .populate('package', '_id name price')
            .populate('company', '_id firstname address')
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


//Update Status
exports.update_status = (req, res, next) => {
    const id = req.params.orderId;
    const tokenRole = req.userData.role;

    if (tokenRole == "Restaurant" || tokenRole == "Dispatcher") {

        Order.updateOne({ _id: id }, { $set: { status: req.body.status } })
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