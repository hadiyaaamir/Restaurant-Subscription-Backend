const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const user = require('../models/user');

// Get Users
exports.users_get_all = (req, res, next) => {

    filter = { deleted: false };

    if (req.query.roles) {
        filter = {...filter, role: req.query.roles.split(',') };
    }

    if (req.query.company) {
        filter = {...filter, company: req.query.company };
    }

    if (req.query.userId) {
        filter = {...filter, _id: req.query.userId };
    }

    const tokenId = req.userData.userId;
    const tokenRole = req.userData.role;

    if (tokenRole == "Restaurant" ||
        (tokenRole == "Company" && req.query.company && req.query.company == tokenId)) { //Company checking own users 
        User.find(filter)
            .select("_id firstname lastname email role address company")
            .populate('company', 'id firstname email address')
            .exec()
            .then(docs => {
                res.status(200).json(docs);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    } else {
        res.status(403).json({ message: "Unauthorised access" });
    }
}


// Signup
exports.user_signup = (req, res, next) => {

    //check if email unique
    User.find({ email: req.body.email, deleted: false })
        .exec()
        .then(user => {
            if (user.length >= 1) { //user exists
                return res.status(409).json({
                    message: 'Account with this email exists'
                });
            }

            //user doesnt exist
            else {

                //only add if role is user or company
                console.log(req.body.role);

                if (req.body.role == "Company" || req.body.role == "User") {

                    //encrypt password. If successful, create user
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        if (err) {
                            return res.status(500).json({
                                error: err
                            });
                        } else {
                            const user = new User({
                                _id: new mongoose.Types.ObjectId(),
                                firstname: req.body.firstname,
                                lastname: req.body.lastname,
                                email: req.body.email,
                                role: req.body.role,
                                password: hash,
                                phone: req.body.phone,
                                address: req.body.address,
                                deleted: false
                            });

                            user.save()
                                .then(result => {
                                    console.log(result);
                                    res.status(201).json({
                                        message: 'User created!',
                                        createdUser: result
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json({ error: err });
                                });
                        }
                    });
                } else {
                    res.status(403).json({ message: "Unauthorised access" });
                }
            }
        });
};


// Login
exports.user_login = (req, res, next) => {

    //check if email exists
    User.findOne({ email: req.body.email, deleted: false })
        .exec()
        .then(user => {

            if (!user) { //incorrect email
                return res.status(401).json({
                    message: 'Authentication failed'
                });
            }

            //if email exists
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) { //incorrect password
                    return res.status(401).json({
                        message: 'Authentication failed'
                    });
                }
                if (result) { //correct email and password
                    const token = jwt.sign({ email: user.email, userId: user._id, role: user.role },
                        process.env.JWT_KEY, { expiresIn: "1h" }
                    );
                    return res.status(200).json({
                        message: "Authentication successful!",
                        token: token
                    });
                }
                return res.status(401).json({
                    message: 'Authentication failed'
                });
            });


        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};


// Get 1 User
exports.get_user = (req, res, next) => {

    const id = req.params.userId;
    const tokenId = req.userData.userId;

    User.findById(id)
        .exec()
        .then(doc => {
            // console.log(doc);
            if (doc) { //id found
                if (id == tokenId) { //accessing own profile
                    res.status(200).json(doc);
                } else {
                    res.status(403).json({ message: "Unauthorised access" });
                }

            } else {
                res.status(404).json({ message: "invalid id" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });

};


//Update 
exports.update_user = (req, res, next) => {
    const id = req.params.userId;
    const tokenId = req.userData.userId;

    if (id == tokenId) {
        User.updateOne({ _id: id }, {
                $set: {
                    firstname: req.body.newFirstname,
                    lastname: req.body.newLastname,
                    phone: req.body.newPhone
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
exports.delete_user = (req, res, next) => {
    const id = req.params.userId;
    const tokenId = req.userData.userId;
    const tokenRole = req.userData.role;

    User.findById(id)
        .exec()
        .then(doc => {
            if (doc) {
                if (id == tokenId || tokenRole == "Restaurant" ||
                    (tokenRole == "Company" && doc.company == tokenId)) {
                    User.updateOne({ _id: id }, { $set: { deleted: true } })
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
            } else {
                res.status(404).json({ message: "User not found" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}



//Add User Address
exports.add_address = (req, res, next) => {

    const id = req.params.userId;
    const tokenId = req.userData.userId;
    const tokenRole = req.userData.role;

    //get user using id
    User.findById(id)
        .exec()
        .then(user => {
            if (user) {

                if ((tokenRole == "User" && !user.company && tokenId == id) ||
                    (tokenRole == "Company" && user.company && user.company == tokenId) ||
                    (tokenRole == "Restaurant" && tokenId == id)) {

                    user.address.push(req.body.address);
                    user.save().then(result => {
                            res.status(200).json({
                                message: 'Address Added!',
                                updatedUser: result
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({ error: err });
                        });
                } else {
                    res.status(403).json({ message: "Unauthorised Access" });
                }


            } else {
                res.status(404).json({ message: "User not found" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}



//Edit User Address
exports.edit_address = (req, res, next) => {

    const id = req.params.userId;
    const tokenId = req.userData.userId;
    const tokenRole = req.userData.role;

    //get user using id
    User.findById(id)
        .exec()
        .then(user => {
            if (user) {

                if ((tokenRole == "User" && !user.company && tokenId == id) ||
                    (tokenRole == "Company" && user.company && user.company == tokenId) ||
                    (tokenRole == "Company" && tokenId == id) ||
                    (tokenRole == "Restaurant" && tokenId == id)) {


                    user.address[req.params.addIndex] = req.body.newAddress;
                    user.save().then(result => {
                            res.status(200).json({
                                message: 'Address Updated!',
                                updatedUser: result
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({ error: err });
                        });
                } else {
                    res.status(403).json({ message: "Unauthorised Access" });
                }


            } else {
                res.status(404).json({ message: "User not found" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}


//Delete address 
exports.delete_address = (req, res, next) => {

    const id = req.params.userId;
    const tokenId = req.userData.userId;
    const tokenRole = req.userData.role;

    //get user using id
    User.findById(id)
        .exec()
        .then(user => {
            if (user) {

                if ((tokenRole == "User" && !user.company && tokenId == id) ||
                    (tokenRole == "Company" && user.company && user.company == tokenId) ||
                    (tokenRole == "Company" && tokenId == id) ||
                    (tokenRole == "Restaurant" && tokenId == id)) {

                    user.address.splice(req.params.addIndex, 1);
                    user.save().then(result => {
                            res.status(200).json({
                                message: 'Address Removed!',
                                updatedUser: result
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({ error: err });
                        });
                } else {
                    res.status(403).json({ message: "Unauthorised Access" });
                }

            } else {
                res.status(404).json({ message: "User not found" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}


//Change Password
exports.change_password = (req, res, next) => {

    const id = req.params.userId;
    const tokenId = req.userData.userId;

    User.findById(id)
        .exec()
        .then(user => {

            //can change password
            if (user && id == tokenId) {

                //check if old password correct
                bcrypt.compare(req.body.oldPassword, user.password, (err, result) => {

                    if (err) {
                        res.status(401).json({
                            message: 'Authentication Error'
                        });
                    }

                    //if old password correct, hash and update new Password
                    if (result) {
                        bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
                            if (err) {
                                res.status(500).json({ error: err });
                            } else {
                                User.updateOne({ _id: id }, {
                                        $set: {
                                            password: hash
                                        }
                                    })
                                    .exec()
                                    .then(result => {
                                        res.status(200).json({ message: 'Password changed!' });
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        res.status(500).json({ error: err });
                                    });
                            }
                        });
                    }

                    //incorrect password
                    else {
                        res.status(401).json({
                            message: 'Authentication Error'
                        });
                    }
                });
            }

            // user not found or unauthorised access
            else if (!user) {
                res.status(404).json({
                    message: 'Invalid ID'
                });
            } else {
                res.status(403).json({
                    message: 'Unauthorised Access'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });

}


//Add Company User
exports.add_companyUser = (req, res, next) => {

    const tokenId = req.userData.userId;
    const tokenRole = req.userData.role;

    if (tokenRole == "Company") {

        //check if email unique
        User.find({ email: req.body.email, deleted: false })
            .exec()
            .then(user => {
                if (user.length >= 1) { //user exists
                    return res.status(409).json({
                        message: 'Account with this email exists'
                    });
                }

                //user doesnt exist
                else {
                    console.log(req.body.firstname + req.body.lastname);

                    //encrypt password. If successful, create user
                    bcrypt.hash(req.body.firstname + req.body.lastname, 10, (err, hash) => {
                        if (err) {
                            return res.status(500).json({
                                error: err
                            });
                        } else {
                            const user = new User({
                                _id: new mongoose.Types.ObjectId(),
                                firstname: req.body.firstname,
                                lastname: req.body.lastname,
                                email: req.body.email,
                                role: "User",
                                password: hash,
                                phone: req.body.phone,
                                company: tokenId,
                                deleted: false
                            });

                            user.save()
                                .then(result => {
                                    console.log(result);
                                    res.status(201).json({
                                        message: 'User created!',
                                        createdUser: result
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json({ error: err });
                                });
                        }
                    });

                }
            });
    } else {
        res.status(403).json({ message: 'Unauthorised Access' });
    }

}

//Add dispatcher  
exports.add_dispatcher = (req, res, next) => {

    const tokenRole = req.userData.role;

    if (tokenRole == "Restaurant") {

        //check if email unique
        User.find({ email: req.body.email, deleted: false })
            .exec()
            .then(user => {
                if (user.length >= 1) { //user exists
                    return res.status(409).json({
                        message: 'Account with this email exists'
                    });
                }

                //user doesnt exist
                else {

                    //encrypt password. If successful, create user
                    bcrypt.hash(req.body.firstname + req.body.lastname, 10, (err, hash) => {
                        if (err) {
                            return res.status(500).json({ error: err });
                        } else {
                            const user = new User({
                                _id: new mongoose.Types.ObjectId(),
                                firstname: req.body.firstname,
                                lastname: req.body.lastname,
                                email: req.body.email,
                                role: "Dispatcher",
                                password: hash,
                                phone: req.body.phone,
                                deleted: false
                            });

                            user.save()
                                .then(result => {
                                    console.log(result);
                                    res.status(201).json({
                                        message: 'Dispatcher created!',
                                        createdUser: result
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json({ error: err });
                                });
                        }
                    });

                }
            });
    } else {
        res.status(403).json({ message: 'Unauthorised Access' });
    }

}

//Add Dispatchers (multiple)
exports.add_dispatchers = (req, res, next) => {

    const tokenRole = req.userData.role;
    const dis = req.body.dispatchers;
    dispatchers = [];

    if (tokenRole == "Restaurant") {
        bcrypt.hash(req.body.firstname + req.body.lastname, 10)
            .then(hash => {
                dis.forEach(element => {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        email: req.body.email,
                        role: "Dispatcher",
                        password: hash,
                        phone: req.body.phone,
                        deleted: false
                    });
                    dispatchers.push(user);
                });

                User.insertMany(dispatchers)
                    .then(result => {
                        res.status(201).json({ message: 'Dispatchers created!', dispatchers: result })
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({ error: err });
                    });
            })
            .catch(err => {
                res.status(500).json({ error: err });
            })

    } else {
        res.status(403).json({ message: 'Unauthorised Access' });
    }
}