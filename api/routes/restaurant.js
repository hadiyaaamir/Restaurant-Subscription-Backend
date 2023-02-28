const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const RestaurantController = require('../controllers/restaurant');


//Get All Users
//router.get('/', checkAuth, UsersController.users_get_all);

//Add Restaurant
router.post('/', checkAuth, RestaurantController.menu_add);

//Edit Restaurant
router.patch('/:menuId', checkAuth, RestaurantController.menu_edit);

//Delete Restaurant
router.patch('/delete/:menuId', checkAuth, RestaurantController.menu_delete);

//Get Menu
router.get('/get', RestaurantController.menu_get);


module.exports = router;