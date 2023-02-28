const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const UsersController = require('../controllers/users');


//Get All Users
router.get('/', checkAuth, UsersController.users_get_all);

//Signup
router.post('/signup', UsersController.user_signup);

//Login
router.post("/login", UsersController.user_login);

//get 1 user
router.get('/:userId', checkAuth, UsersController.get_user);

//update 
router.patch('/:userId', checkAuth, UsersController.update_user);

//delete
router.patch('/delete/:userId', checkAuth, UsersController.delete_user);


//add address
router.patch('/addAddress/:userId', checkAuth, UsersController.add_address);

//delete address
router.patch('/deleteAddress/:userId/:addIndex', checkAuth, UsersController.delete_address);

//edit address
router.patch('/editAddress/:userId/:addIndex', checkAuth, UsersController.edit_address);

//edit password
router.patch('/password/:userId', checkAuth, UsersController.change_password);


//Add Company User
router.post('/companyUser', checkAuth, UsersController.add_companyUser);

//Add dispatcher
router.post('/dispatcher', checkAuth, UsersController.add_dispatcher);

//Add dispatchers
router.post('/dispatchers', checkAuth, UsersController.add_dispatchers);

module.exports = router;