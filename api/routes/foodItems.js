const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const FoodItemsController = require('../controllers/foodItems');


//Get All Users
//router.get('/', checkAuth, UsersController.users_get_all);

//Add Food Item
router.post('/', checkAuth, FoodItemsController.fooditem_add);

//Edit Food Item
router.patch('/:itemId', checkAuth, FoodItemsController.fooditem_edit);

//Delete
router.patch('/delete/:itemId', checkAuth, FoodItemsController.fooditem_delete);

//Get 
router.get('/get', checkAuth, FoodItemsController.fooditem_get);


module.exports = router;