const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const CategoryController = require('../controllers/category');


//Get All Users
//router.get('/', checkAuth, UsersController.users_get_all);

//Add Category
router.post('/', checkAuth, CategoryController.category_add);

//Edit Category
router.patch('/:categoryId', checkAuth, CategoryController.category_edit);

//Delete Category
router.patch('/delete/:categoryId', checkAuth, CategoryController.category_delete);

//Get Category
router.get('/get', checkAuth, CategoryController.category_get);


module.exports = router;